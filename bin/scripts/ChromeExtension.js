const os = require("os");
const path = require("path");
const spawn = require("child-process-promise").spawn;
const fs = require("mz/fs");
const glob = require("glob-promise");
const JSZip = require("node-zip");

module.exports = class ChromeExtension {
    constructor(target) {
        this.target = target || "*.{js,png,json}";
    }

    findWin32Registry(key) {
        return new Promise((resolve, reject) => {
            const data = new Map();
            require("regedit").list([ key ])
                              .on("data", entry => data.set(entry.key, entry.data))
                              .on("error", e => reject(e))
                              .on("finish", () => resolve(data));
        });
    }

    async getChromePath() {
        switch (os.platform()) {
            case "linux": {
                return "/usr/bin/google-chrome";
            }
            case "darwin": {
                return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
            }
            case "win32": {
                const path = "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe";
                for (const [ key, { values } ] of await this.findWin32Registry(path)) {
                    return values[""].value;
                }
            }
        }
    }

    async byCrx() {
        const chrome = await this.getChromePath();
        if (!chrome) {
            throw new Error("This operating system is not supported");
        }

        // Remove the files which were already generated
        try {
            await Promise.all([
                fs.unlink("target.crx"),
                fs.unlink("target.pem"),
                fs.mkdir("target"),
            ]);
        } catch (e) {
            // No problem if fails
        }

        // Copy files to the destination directory
        await glob(this.target).then(files =>
            files.map(filename =>
                fs.createReadStream(filename).pipe(fs.createWriteStream(path.join("target", path.basename(filename))))
            )
        );

        await spawn(chrome, ["--pack-extension=" + path.resolve("target")]);
        await fs.unlink("target.pem");
        if (!await fs.exists("target.crx")) {
            throw new Error("The extension was not created.");
        }

        return await fs.realpath("target.crx");
    }

    async byZip(destination) {
        const zip = new JSZip();
        for (const filename of await glob(this.target)) {
            zip.file(path.basename(filename), await fs.readFile(filename));
        }

        return fs.writeFile(destination, zip.generate({
            base64: false,
            compression: "DEFLATE",
        }), "binary");
    }
};
