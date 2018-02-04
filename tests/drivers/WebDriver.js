const execSync = require("child_process").execSync;
const os = require("os");
const webdriver = require("selenium-webdriver");

class WebDriver {
    constructor(timeout) {
        this.timeout = timeout;
    }

    initialize() {
        return this.driver.manage().setTimeouts({
            implicit: this.timeout,
            pageLoad: this.timeout,
            script: this.timeout,
        });
    }
}

WebDriver.prototype.regedit = {
    find(key) {
        return new Promise((resolve, reject) => {
            const map = new Map();
            require("regedit").list([ key ])
                .on("data", entry => map.set(entry.key, entry.data))
                .on("error", e => reject(e))
                .on("finish", () => resolve(map));
        });
    }
};

exports.chrome = class ChromeWebDriver extends WebDriver {
    initialize(path) {
        const chrome = require("selenium-webdriver/chrome");
        const options = new chrome.Options();
        options.addArguments("no-sandbox");
        options.addArguments("load-extension=" + path);

        const builder = new webdriver.Builder();
        builder.forBrowser("chrome");
        builder.setChromeOptions(options);

        this.driver = builder.build();
        return super.initialize();
    }
}

exports.firefox = class FirefoxWebDriver extends WebDriver {
    async initialize(path) {
        const firefox = require("selenium-webdriver/firefox");
        const options = new firefox.Options();
        options.setBinary(await this.binary());
        options.setPreference("xpinstall.signatures.required", false);
        options.addExtensions(path);

        const builder = new webdriver.Builder();
        builder.forBrowser("firefox");
        builder.setFirefoxOptions(options);

        this.driver = builder.build();
        return super.initialize();
    }

    async binary() {
        switch (os.platform()) {
            case "linux": {
                return execSync("which firefox").toString().trim();
            }
            case "darwin": {
                return "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox-bin";
            }
            case "win32": {
                const path = "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\firefox.exe";
                for (const [ key, { values } ] of await this.regedit.find(path)) {
                    return values[""].value;
                }
            }
        }
    }
}
