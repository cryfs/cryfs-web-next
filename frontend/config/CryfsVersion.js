"use strict";

/*
 * Warning: The /version_info.json URL only works in an exported application.
 *          This json file is created in an export hook in next.config.js.
 *          When running with "next dev" or "next start", it will not work.
 */

/* If you change this version number, you probably also want to change the download links in components/modals/Download.tsx */

/** @type {string} */
const VersionNumber = "1.0.3";

// CommonJS export (for next.config.js)
module.exports = { VersionNumber };

// Also expose as named export for ES modules
module.exports.VersionNumber = VersionNumber;
