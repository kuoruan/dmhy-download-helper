const fs = require("fs");
const path = require("path");

const AliasPlugin = require("rollup-plugin-alias");
const ResolvePlugin = require("rollup-plugin-node-resolve");
const CommonJSPlugin = require("rollup-plugin-commonjs");
const ImagePulgin = require("rollup-plugin-image");
const PostCSSPlugin = require("rollup-plugin-postcss");
const StylusPlugin = require("rollup-plugin-stylus-compiler");
const VuePlugin = require("rollup-plugin-vue");
const ServePlugin = require("rollup-plugin-serve");
const ESLintPlugin = require("rollup-plugin-eslint");
const TerserPlugin = require("rollup-plugin-terser");

const pkg = require("./package.json");
const userscript = require("./userscript");

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
      console.log(`Build Number Set to ${number}`);
    }
  });
}

function resolve(...paths) {
  return path.resolve(__dirname, ...paths);
}

module.exports = {
  input: {
    [pkg.name]: resolve("src", "index.js")
  },
  external: ["vue"],
  output: {
    dir: path.join(__dirname, "dist"),
    entryFileNames: "[name].user.js",
    format: "iife",
    banner: function() {
      if (!isProduction) {
        writeNewBuildNumber(++buildNumber);
      }

      return userscript.createBanner(!isProduction, buildNumber);
    },
    globals: {
      vue: "Vue"
    }
  },
  plugins: [
    AliasPlugin({
      resolve: ["", ".js"],
      "@": resolve("src")
    }),
    ESLintPlugin.eslint({
      include: ["src/**/*.js", "src/**/*.vue"],
      exclude: "node_modules/**",
      throwOnWarning: true,
      throwOnError: true
    }),
    VuePlugin({
      css: true,
      template: {
        isProduction: isProduction
      }
    }),
    StylusPlugin(),
    PostCSSPlugin({
      include: "**/*.css"
    }),
    ImagePulgin({
      include: "src/**",
      exclude: "node_modules/**"
    }),
    ResolvePlugin(),
    CommonJSPlugin(),
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
            contentBase: path.join(__dirname, "dist")
          })
        ])
  ],
  watch: {
    include: "src/**",
    exclude: "node_modules/**"
  }
};
