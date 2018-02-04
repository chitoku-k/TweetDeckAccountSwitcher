import { version, description } from "../../package";

export default {
    name: "TweetDeck Accounts Switcher",
    version,
    description,
    manifest_version: 2,
    icons: {
        128: "img/icon_128.png",
    },
    web_accessible_resources: [
        "js/inject.js",
    ],
    content_scripts: [{
        js: [ "js/content.js" ],
        matches: [ "https://tweetdeck.twitter.com/*" ],
        run_at: "document_idle",
    }],
}
