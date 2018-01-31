const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

module.exports = class WebDriver {
    constructor(path, timeout) {
        const options = new chrome.Options();
        options.addArguments("no-sandbox");
        options.addArguments("load-extension=" + path);

        const builder = new webdriver.Builder();
        builder.forBrowser("chrome");
        builder.setChromeOptions(options);

        this.timeout = timeout;
        this.driver = builder.build();
    }

    initialize() {
        return this.driver.manage().setTimeouts({
            implicit: this.timeout,
            pageLoad: this.timeout,
            script: this.timeout,
        });
    }
};
