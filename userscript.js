const userscriptConfig = require("./userscript.config");

const ArrayKeys = [
  "include",
  "match",
  "exclude",
  "require",
  "resource",
  "grant"
];

const IgnoreKeys = ["pkgName"];

module.exports.config = userscriptConfig;
module.exports.createBanner = function(isDev, buildNumber) {
  const keys = Object.keys(userscriptConfig);

  const filteredKeys = [];
  let maxKeyLength = 0;

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];
    if (IgnoreKeys.indexOf(key) > -1) {
      continue;
    }

    filteredKeys.push(key);
    if (key.length > maxKeyLength) {
      maxKeyLength = key.length;
    }
  }

  const headers = [];
  headers.push("// ==UserScript==");

  for (let i = 0, len = filteredKeys.length; i < len; i++) {
    let key = filteredKeys[i];

    const config = userscriptConfig[key];

    if (ArrayKeys.indexOf(key) > -1) {
      if (Array.isArray(config) && config.length > 0) {
        config.forEach(c => {
          headers.push(`// @${key.padEnd(maxKeyLength + 1)} ${c}`);
        });
      } else if (typeof config === "string") {
        headers.push(`// @${key.padEnd(maxKeyLength + 1)} ${config}`);
      }
    } else if (key === "version" && isDev) {
      headers.push(
        `// @${key.padEnd(maxKeyLength + 1)} ${config}-build.${buildNumber}`
      );
    } else {
      headers.push(`// @${key.padEnd(maxKeyLength + 1)} ${config}`);
    }
  }

  headers.push("// ==/UserScript==");

  return headers.join("\n");
};
