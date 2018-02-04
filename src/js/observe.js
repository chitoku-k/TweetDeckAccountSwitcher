/**
 * Observes "Retweet from" modal appear and choose the last selected account.
 */
export function observe() {
    // The MutationObserver monitors the style attribute of the retweet modal
    // since its all descendent elements are removed when it is closed.
    const modal = $("#actions-modal");
    const observer = new MutationObserver(() => {
        const selector = modal.find("ul.js-account-selector");
        let selected = selector.find(".is-selected").data("id");

        selector.on("td-accounts-change", (e, { selectedAccounts }) => {
            // Cancel when the number of accounts <= 1
            if (selectedAccounts.length <= 1) {
                // Assign the last selected account or undefined
                const [ current ] = selectedAccounts;
                selected = current ? current.accountKey : null;
                return;
            }

            // Gets the last selected account
            const [ current ] = selectedAccounts.filter(x => selected !== x.accountKey);

            // Click all the selected accounts except the last selected one
            selector.find(".is-selected").each((i, e) => e.dataset.id === current.accountKey || e.click());
        });
    });

    observer.observe(modal.get(0), {
        attributes: true,
        attributeFilter: ["style"],
    });
}
