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
  plugins: ["vue", "prettier", "simple-import-sort"],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-undef": "off",

    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
  overrides: [
    {
      files: ["tests/**"],
      env: {
        "vitest/env": true,
      },
      plugins: ["vitest"],
      extends: ["plugin:vitest/recommended"],
    },
  ],
};
