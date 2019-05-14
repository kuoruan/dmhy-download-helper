const loaderUtils = require("loader-utils");

module.exports = function() {};

module.exports.pitch = function(remainingRequest) {
  if (this.cacheable) {
    this.cacheable();
  }
  return `
    var content = require(${loaderUtils.stringifyRequest(
      this,
      `!!${remainingRequest}`
    )});

    if (typeof content === "string") {
      GM_addStyle(content)
    } else {
      GM_addStyle(content.toString())
    }
  `;
};
