import userscriptConfig from "./userscript.config";

const ArrayKeys = [
  "include",
  "match",
  "exclude",
  "require",
  "resource",
  "connect",
  "grant",
];

const IgnoreKeys = ["pkgName"];

export const config = userscriptConfig;
export function createBanner(isDev, buildNumber) {
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
        config.forEach((c) => {
          headers.push(`// @${key.padEnd(maxKeyLength + 1)} ${c}`);
        });
      } else if (typeof config === "string") {
        headers.push(`// @${key.padEnd(maxKeyLength + 1)} ${config}`);
      }
    } else if (key === "version" && isDev) {
      headers.push(
        `// @${key.padEnd(maxKeyLength + 1)} ${config}-alpha.${buildNumber}`,
      );
    } else {
      headers.push(`// @${key.padEnd(maxKeyLength + 1)} ${config}`);
    }
  }

  headers.push("// ==/UserScript==");
  headers.push("");

  return headers.join("\n");
}
