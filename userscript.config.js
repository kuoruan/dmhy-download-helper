import packageConfig from "./package.json";

export default {
  pkgName: packageConfig.name,
  name: "DMHY download helper",
  "name:zh-CN": "动漫花园下载助手",
  description: packageConfig.description,
  "description:zh-CN":
    "动漫花园（share.dmhy.org）扩展，提供批量选择、列表下载种子文件及详情页树状展示等功能。",
  author: packageConfig.author,
  namespace: "https://github.com/kuoruan",
  homepage: packageConfig.homepage,
  supportURL: packageConfig.bugs ? packageConfig.bugs.url : "",
  match: [
    "*://share.dmhy.org/",
    "*://share.dmhy.org/topics/list/*",
    "*://share.dmhy.org/topics/list?*",
    "*://share.dmhy.org/topics/view/*",
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js",
    "https://cdn.jsdelivr.net/npm/xbytes@1.7.0/dist/index.min.js",
  ],
  connect: "dmhy.org",
  grant: ["GM_setClipboard", "GM_xmlhttpRequest"],
  source: "https://github.com/kuoruan/dmhy-download-helper.git",
  license: packageConfig.license,
  "run-at": "document-end",
  version: packageConfig.version || "1.0.0",
  icon: "https://share.dmhy.org/favicon.ico",
};
