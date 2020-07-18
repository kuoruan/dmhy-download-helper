"use strict";

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: false,
        corejs: false,
      },
    ],
  ],
};
