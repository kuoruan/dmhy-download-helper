import fs from "fs";
import path from "path";
import chalk from "chalk";

import AliasPlugin from "@rollup/plugin-alias";
import ResolvePlugin from "@rollup/plugin-node-resolve";
import CommonJSPlugin from "@rollup/plugin-commonjs";
import BabelPlugin from "@rollup/plugin-babel";
import UrlPulgin from "@rollup/plugin-url";
import PostCSSPlugin from "rollup-plugin-postcss";
import StylusPlugin from "rollup-plugin-stylus-compiler";
import VuePlugin from "rollup-plugin-vue";
import ServePlugin from "rollup-plugin-serve";
import ESLintPlugin from "rollup-plugin-eslint";
import TerserPlugin from "rollup-plugin-terser";

import PostCSSUrl from "postcss-url";
import PostCSSAutoprefixer from "autoprefixer";
import PostCSSNano from "cssnano";

import { config, createBanner } from "./userscript";

const isProduction = process.env.NODE_ENV === "production";
const buildNumberFile = path.resolve(__dirname, "BUILD");

// Write new build number to file.
function writeNewBuildNumber(number) {
  fs.writeFile(buildNumberFile, number, function (err) {
    if (!err) {
      console.log(chalk.keyword("orange")(`build number set to ${number}`));
    }
  });
}

function resolve(...paths) {
  return path.resolve(__dirname, ...paths);
}

export default function () {
  let buildNumber = 0;

  // Read build number from local file.
  if (fs.existsSync(buildNumberFile)) {
    const data = fs.readFileSync(buildNumberFile, "UTF-8");
    buildNumber = +data || 0;
  }

  if (!isProduction) {
    writeNewBuildNumber(++buildNumber);
  }

  return {
    input: {
      [config.pkgName]: resolve("src", "main.js"),
    },
    external: ["vue", "xbytes"],
    output: {
      dir: resolve("dist"),
      entryFileNames: "[name].user.js",
      format: "iife",
      globals: {
        vue: "Vue",
        xbytes: "xbytes",
      },
    },
    plugins: [
      AliasPlugin({
        entries: {
          "@": resolve("src"),
        },
      }),
      ESLintPlugin.eslint({
        include: ["src/**/*.js", "src/**/*.vue"],
        throwOnWarning: true,
        throwOnError: true,
      }),
      VuePlugin({
        css: true,
        style: {
          postcssPlugins: [
            PostCSSUrl({
              basePath: resolve("src"),
              url: "inline",
            }),
            PostCSSAutoprefixer(),
            PostCSSNano(),
          ],
        },
        template: {
          isProduction: isProduction,
        },
      }),
      StylusPlugin(),
      PostCSSPlugin({
        include: "**/*.css",
        extract: false,
        config: true,
      }),
      UrlPulgin({
        limit: 1024 * 1024,
        include: ["**/*.ico", "**/*.gif", "**/*.png"],
        exclude: "node_modules/**",
      }),
      ResolvePlugin(),
      CommonJSPlugin(),
      BabelPlugin({
        babelHelpers: "bundled",
        extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".vue"],
      }),
      TerserPlugin.terser({
        mangle: false,
        compress: {
          drop_console: false,
          drop_debugger: true,
          sequences: false,
        },
        output: {
          braces: true,
          beautify: true,
          indent_level: 2,
          max_line_len: 70,
          preamble: createBanner(!isProduction, buildNumber),
        },
      }),
      ...(isProduction
        ? []
        : [
            ServePlugin({
              port: 10010,
              contentBase: path.join(__dirname, "dist"),
            }),
          ]),
    ],
    watch: {
      include: "src/**",
      exclude: "node_modules/**",
    },
  };
}
