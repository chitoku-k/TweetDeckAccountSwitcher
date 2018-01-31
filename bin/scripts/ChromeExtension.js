const path = require("path");
const fs = require("mz/fs");
const glob = require("glob-promise");
const JSZip = require("node-zip");

module.exports = class ChromeExtension {
    constructor(target) {
        this.target = target || "*.{js,png,json}";
    }

    async byZip(destination) {
        const zip = new JSZip();

        await Promise.all(
            await glob(this.target, { nodir: true }).then(files =>
                files.map(async filename =>
                    zip.file(
                        path.basename(filename),
                        await fs.readFile(filename),
                    ),
                ),
            ),
        );

        return fs.writeFile(destination, zip.generate({
            base64: false,
            compression: "DEFLATE",
        }), "binary");
    }
};
