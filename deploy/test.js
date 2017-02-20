const assert = require("assert");
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const By = webdriver.By;
const until = webdriver.until;

class WebDriver {
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
}

(async () => {
    try {
        // Initialize
        const test = new WebDriver("./TweetDeckAccountsSwitcher.crx", 30000);
        await test.initialize();

        await test.driver.get("https://tweetdeck.twitter.com");
        await test.driver.wait(until.titleIs("TweetDeck"));
        console.log("Test: Loaded the components.");

        // Login button
        const login = await test.driver.findElement(By.css("form.form-login a.btn"));
        await login.click();

        // Login form
        const form = await test.driver.wait(until.elementLocated(By.css("form.signin")), test.timeout);

        // Input username
        const username = await form.findElement(By.name("session[username_or_email]"));
        await username.sendKeys(process.env.TEST_TWITTER_USERNAME);

        // Input password
        const password = await form.findElement(By.name("session[password]"));
        await password.sendKeys(process.env.TEST_TWITTER_PASSWORD);

        // Execute login
        await form.submit();
        console.log("Test: Logged into TweetDeck.");

        // TweetDeck
        await test.driver.wait(until.elementLocated(By.css(".js-show-drawer")));
        const main = await test.driver.findElement(By.css(".application"));

        // Since the app is loaded, shorten timeout value.
        await test.driver.manage().timeouts().implicitlyWait(50);
        console.log("Test: Application is loaded.");

        for (let i = 0; i < 5; i++) {
            console.log(`Test: New Tweet (${i + 1}/5)`);

            // New Tweet button
            await test.trigger("click", ".js-show-drawer.btn-compose");

            for (let j = 0; j < 10; j++) {
                const accounts = await main.findElements(By.css(".js-account-list .js-account-item"));
                const target = accounts[Math.floor(Math.random() * accounts.length)];
                const key = await target.getAttribute("data-account-key");
                await test.trigger("click", `.js-account-item[data-account-key="${key}"]`)

                const current = await main.findElements(By.css(".js-account-list .js-account-item.is-selected"));
                assert(current.length <= 1);
            }

            // Close Tweet drawer
            await test.trigger("click", ".js-drawer-close");
        }

        for (let i = 0; i < 5; i++) {
            console.log(`Test: Retweet (${i + 1}/5)`);

            // Open Retweet modal
            await test.trigger("click", "a.tweet-action[rel=retweet]");

            for (let j = 0; j < 10; j++) {
                const accounts = await main.findElements(By.css("ul.js-account-selector li.js-account-item"));
                const target = accounts[Math.floor(Math.random() * accounts.length)];
                const id = await target.getAttribute("data-id");
                await test.trigger("click", "li.js-account-item[data-id=\"" + id + "\"]");

                const current = await main.findElements(By.css("li.acc-selected"));
                assert(current.length <= 1);
            }

            // Close Retweet modal
            await test.trigger("click", ".js-dismiss");
        }

        await test.driver.quit();
        console.log("Test: Done.");
    } catch (e) {
        console.error("Error: " + e);
        process.exit(1);
    }
})();
