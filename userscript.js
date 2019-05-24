const packageConfig = require("./package.json");

const userscript = packageConfig.userscript || {};

const userscriptConfig = Object.assign(userscript, {
  name: userscript.name || packageConfig.name || "",
  version: userscript.version || packageConfig.version || "",
  author: userscript.author || packageConfig.author || "",
  description: userscript.description || packageConfig.description || "",
  homepage: userscript.homepage || packageConfig.homepage || "",
  supportURL:
    userscript.supportURL ||
    (packageConfig.bugs ? packageConfig.bugs.url : "") ||
    ""
});

module.exports.config = userscriptConfig;
module.exports.createBanner = function(isDev, buildNumber) {
  const headers = [];
  headers.push("// ==UserScript==");

  Object.keys(userscriptConfig).forEach(key => {
    const config = userscriptConfig[key];

    if (
      ["include", "match", "exclude", "require", "resource", "grant"].indexOf(
        key
      ) > -1
    ) {
      if (Array.isArray(config) && config.length > 0) {
        config.forEach(c => {
          headers.push(`// @${key.padEnd(12)} ${c}`);
        });
      } else if (typeof config === "string") {
        headers.push(`// @${key.padEnd(12)} ${config}`);
      }
    } else if (key === "version" && isDev) {
      headers.push(`// @${key.padEnd(12)} ${config}-build.${buildNumber}`);
    } else {
      headers.push(`// @${key.padEnd(12)} ${config}`);
    }
  });

  headers.push("// ==/UserScript==");

  return headers.join("\n");
};
