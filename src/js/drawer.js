/**
 * Hooks "New Tweet" drawer and choose the last selected account.
 */
export function drawer() {
    // Dispatched when any account is clicked
    $("div.js-drawer.drawer").on("uiAccountsSelected", (e, { accountKeys }) => {
        // Cancel when the number of accounts <= 1
        if (accountKeys.length <= 1) {
            return;
        }

        // Yield callbacks
        setTimeout(() => {
            // Removes an account from the queue
            $(e.currentTarget).triggerHandler(e.type, { accountKeys: accountKeys.slice(-1) });

            // Focuses on the textbox
            $(".js-compose-text").focus();
        }, 0);
    });
}
