const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const AliasPlugin = require("@rollup/plugin-alias");
const ResolvePlugin = require("@rollup/plugin-node-resolve");
const CommonJSPlugin = require("@rollup/plugin-commonjs");
const BabelPlugin = require("rollup-plugin-babel");
const UrlPulgin = require("@rollup/plugin-url");
const PostCSSPlugin = require("rollup-plugin-postcss");
const StylusPlugin = require("rollup-plugin-stylus-compiler");
const VuePlugin = require("rollup-plugin-vue");
const ServePlugin = require("rollup-plugin-serve");
const ESLintPlugin = require("rollup-plugin-eslint");
const TerserPlugin = require("rollup-plugin-terser");

const PostCSSUrl = require("postcss-url");
const PostCSSAutoprefixer = require("autoprefixer");
const PostCSSNano = require("cssnano");

const { config, createBanner } = require("./userscript");

const isProduction = process.env.NODE_ENV === "production";
const buildNumberFile = path.resolve(__dirname, "BUILD");

let buildNumber = 0;

// Read build number from local file.
if (fs.existsSync(buildNumberFile)) {
  const data = fs.readFileSync(buildNumberFile, "UTF-8");
  buildNumber = +data || 0;
}

// Write new build number to file.
function writeNewBuildNumber(number) {
  fs.writeFile(buildNumberFile, number, function(err) {
    if (!err) {
      console.log(chalk.keyword("orange")(`build number set to ${number}`));
    }
  });
}

function resolve(...paths) {
  return path.resolve(__dirname, ...paths);
}

module.exports = {
  input: {
    [config.pkgName]: resolve("src", "main.js")
  },
  external: ["vue"],
  output: {
    dir: resolve("dist"),
    entryFileNames: "[name].user.js",
    format: "iife",
    banner: function() {
      if (!isProduction) {
        writeNewBuildNumber(++buildNumber);
      }

      return createBanner(!isProduction, buildNumber);
    },
    globals: {
      vue: "Vue"
    }
  },
  plugins: [
    AliasPlugin({
      customResolver: ResolvePlugin({
        extensions: [".js"]
      }),
      entries: {
        "@": resolve("src")
      }
    }),
    ESLintPlugin.eslint({
      include: ["src/**/*.js", "src/**/*.vue"],
      throwOnWarning: true,
      throwOnError: true
    }),
    VuePlugin({
      css: true,
      style: {
        postcssPlugins: [
          PostCSSUrl({
            basePath: resolve("src"),
            url: "inline"
          }),
          PostCSSAutoprefixer({}),
          PostCSSNano({})
        ]
      },
      template: {
        isProduction: isProduction
      }
    }),
    StylusPlugin(),
    PostCSSPlugin({
      include: "**/*.css",
      extract: false,
      config: true
    }),
    UrlPulgin({
      limit: 1024 * 1024,
      include: ["**/*.ico", "**/*.gif", "**/*.png"],
      exclude: "node_modules/**"
    }),
    ResolvePlugin(),
    CommonJSPlugin(),
    BabelPlugin({
      exclude: "node_modules/**"
    }),
    TerserPlugin.terser({
      sourcemap: false,
      mangle: false,
      ie8: false,
      keep_fnames: true,
      keep_classnames: true,
      compress: {
        arrows: true,
        warnings: false,
        drop_console: false,
        reduce_vars: false,
        sequences: false,
        keep_classnames: true,
        keep_fargs: true,
        keep_fnames: true
      },
      output: {
        comments: function(_, { value, type }) {
          // Preserve userscript comments
          return type === "comment1" && /@|==/.test(value);
        },
        beautify: true,
        braces: true,
        indent_level: 2,
        max_line_len: 70,
        semicolons: true
      }
    }),
    ...(isProduction
      ? []
      : [
          ServePlugin({
            port: 10010,
            contentBase: path.join(__dirname, "dist")
          })
        ])
  ],
  watch: {
    include: "src/**",
    exclude: "node_modules/**"
  }
};
