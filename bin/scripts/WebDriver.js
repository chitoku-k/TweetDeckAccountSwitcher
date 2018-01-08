const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

module.exports = class WebDriver {
    constructor(path, timeout) {
        const options = new chrome.Options();
        options.addArguments("no-sandbox");
        options.addExtensions(path);

        const builder = new webdriver.Builder();
        builder.forBrowser("chrome");
        builder.setChromeOptions(options);

        this.timeout = timeout;
        this.driver = builder.build();
        this.action = new webdriver.ActionSequence(this.driver);
    }

    initialize() {
        const timeouts = this.driver.manage().timeouts();
        return Promise.all([
            timeouts.implicitlyWait(this.timeout),
            timeouts.pageLoadTimeout(this.timeout),
            timeouts.setScriptTimeout(this.timeout),
        ]);
    }

    trigger(event, selector) {
        return this.driver.executeScript("$('" + selector + "').trigger('" + event + "')");
    }
};
