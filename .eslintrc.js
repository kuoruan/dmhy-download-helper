module.exports = {
  "env": {
    "node": true,
    "browser": true
  },
  "extends": ["plugin:prettier/recommended", "plugin:vue/recommended", "@vue/prettier"],
  "rules": {
    "no-console": "off",
    "no-debugger": "off",
    "no-undef": "off"
  },
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "vue",
    "prettier"
  ]
}
