module.exports = {
  env: {
    node: true,
    browser: true,
  },
  extends: [
    "plugin:prettier/recommended",
    "plugin:vue/recommended",
    "@vue/prettier",
  ],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-undef": "off",
  },
  plugins: ["vue", "prettier"],
};
