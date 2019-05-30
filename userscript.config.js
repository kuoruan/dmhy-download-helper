const packageConfig = require("./package.json");

module.exports = {
  pkgName: packageConfig.name,
  name: "DMHY download helper",
  "name:zh-CN": "动漫花园下载助手",
  description: packageConfig.description,
  "description:zh-CN": "一个用于 dmhy.org 动漫下载的用户脚本",
  author: packageConfig.author,
  namespace: "https://github.com/kuoruan",
  homepage: packageConfig.homepage,
  supportURL: packageConfig.bugs ? packageConfig.bugs.url : "",
  match: [
    "*://share.dmhy.org/",
    "*://share.dmhy.org/topics/list/*",
    "*://share.dmhy.org/topics/list?*"
  ],
  require: ["https://cdn.jsdelivr.net/npm/vue@2.6.8/dist/vue.min.js"],
  grant: "GM_setClipboard",
  source: "https://github.com/kuoruan/dmhy-download-helper.git",
  license: "MIT - https://opensource.org/licenses/MIT",
  "run-at": "document-end",
  version: packageConfig.version || "1.0.0",
  icon: "https://www.google.cn/s2/favicons?domain=share.dmhy.org"
};
