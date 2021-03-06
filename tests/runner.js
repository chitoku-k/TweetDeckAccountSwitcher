const assert = require("assert");
const fs = require("mz/fs");
const path = require("path");
const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;
const WebDriver = require("./drivers/WebDriver");

(async () => {
    try {
        if (!process.env.TEST_TWITTER_USERNAME || !process.env.TEST_TWITTER_PASSWORD) {
            throw new Error("TEST_TWITTER_USERNAME and TEST_TWITTER_PASSWORD must be specified.");
        }

        if (!WebDriver[process.env.BROWSER]) {
            throw new Error("BROWSER must be specified.");
        }

        // Initialize
        const test = new WebDriver[process.env.BROWSER](30000);
        await test.initialize(
            path.join(
                await fs.realpath("dist"),
                process.env.BROWSER,
                process.env.BROWSER === "firefox" ? "/extension.xpi" : "",
            ),
        );

        await test.driver.get("https://tweetdeck.twitter.com");
        await test.driver.wait(until.titleIs("TweetDeck"));
        console.log("Test: Loaded the components.");

        // Login button
        const login = await test.driver.findElement(By.css("form.form-login a.Button"));
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
        const submit = await test.driver.findElement(By.css("form.signin .submit"));
        await submit.click();
        console.log("Test: Logged into TweetDeck.");

        // TweetDeck
        await test.driver.wait(until.elementLocated(By.css(".js-show-drawer")));
        const main = await test.driver.findElement(By.css(".application"));

        // Since the app is loaded, shorten timeout value.
        await test.driver.manage().setTimeouts({ implicit: 0 });
        console.log("Test: Application is loaded.");

        for (let i = 0; i < 5; i++) {
            console.log(`Test: New Tweet (${i + 1}/5)`);

            // New Tweet button
            const button = await main.findElement(By.css(".js-show-drawer.Button"));
            await button.click();

            // Wait until the buttons become available
            await test.driver.wait(until.elementLocated(By.css(".app-content.is-open")), test.timeout);
            await new Promise(resolve => setTimeout(resolve, 1000));

            for (let j = 0; j < 50; j++) {
                const accounts = await main.findElements(By.css(".js-account-list .js-account-item"));
                const target = accounts[Math.floor(Math.random() * accounts.length)];
                const key = await target.getAttribute("data-account-key");
                const item = await main.findElement(By.css(`.js-account-item[data-account-key="${key}"]`));
                await item.click();

                const current = await main.findElements(By.css(".js-account-list .js-account-item.is-selected"));
                assert(current.length <= 1);
            }

            // Close Tweet drawer
            const closer = await main.findElement(By.css(".js-drawer-close"));
            await closer.click();
        }

        // Reopen Tweet drawer
        const button = await main.findElement(By.css(".js-show-drawer.Button"));
        await button.click();
        await test.driver.wait(until.elementLocated(By.css(".js-show-drawer.Button.is-hidden")), test.timeout);

        for (let i = 0; i < 5; i++) {
            console.log(`Test: Retweet (${i + 1}/5)`);

            // Open Retweet modal
            const retweet = await main.findElement(By.css("a.tweet-action[rel=retweet]"));
            await retweet.click();

            // Wait until the dialog becomes available
            await test.driver.wait(until.elementLocated(By.css(".js-retweet-button")), test.timeout);

            for (let j = 0; j < 50; j++) {
                const accounts = await main.findElements(By.css("ul.js-account-selector a.js-account-item"));
                const target = accounts[Math.floor(Math.random() * accounts.length)];
                const id = await target.getAttribute("data-id");
                const item = await main.findElement(By.css(`a.js-account-item[data-id="${id}"]`));
                await item.click();

                const current = await main.findElements(By.css("ul.js-account-selector a.is-selected"));
                assert(current.length <= 1);
            }

            // Close Retweet modal
            const closer = await main.findElement(By.css(".js-dismiss"));
            await closer.click();
        }

        await test.driver.quit();
        console.log("Test: Done.");
    } catch (e) {
        console.error("Error: " + e);
        process.exit(1);
    }
})();
