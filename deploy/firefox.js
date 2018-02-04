const fs = require("mz/fs");
const deploy = require("firefox-extension-deploy");
const { version, applications: { gecko: { id } } } = require("../dist/firefox/manifest.json");

(async () => {
    const filename = "dist/firefox/extension.xpi";
    try {
        const src = await fs.readFile(filename);
        await deploy({
            src,
            version,
            id,
            issuer: process.env.AMO_JWT_ISSUER,
            secret: process.env.AMO_JWT_SECRET,
        });
        console.log("Deploy: Extension is successfully published.");
    } catch (e) {
        console.error("Error: cannot publish extension.");
        console.log(e);
        process.exit(1);
    } finally {
        await fs.unlink(filename);
    }
})();
