import { drawer } from "./drawer";
import { observe } from "./observe";

$(document).on("dataColumnsLoaded", () => {
    // Some environments reach here many times
    if ($(document).data("TweetDeckAccountsSwitcher")) {
        return;
    }

    $(document).data("TweetDeckAccountsSwitcher", true);
    drawer();
    observe();
});
