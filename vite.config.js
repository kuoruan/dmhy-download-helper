import vue2 from "@vitejs/plugin-vue2";
import chalk from "chalk";
import fs from "fs";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import banner from "vite-plugin-banner";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

import { createBanner } from "./userscript";

const buildNumberFile = fileURLToPath(new URL("./BUILD", import.meta.url));

// Write new build number to file.
function writeNewBuildNumber(number) {
  fs.writeFile(buildNumberFile, String(number), function (err) {
    if (!err) {
      console.log(chalk.yellowBright(`build number set to ${number}`));
    }
  });
}

let buildNumber = 0;

// Read build number from local file.
if (fs.existsSync(buildNumberFile)) {
  const data = fs.readFileSync(buildNumberFile, "UTF-8");
  buildNumber = +data || 0;
}

export default defineConfig(({ mode }) => {
  const isDev = mode === "dev";

  return {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      minify: false,
      cssMinify: true,
      cssCodeSplit: false,
      sourcemap: false,
      assetsInlineLimit: Number.POSITIVE_INFINITY, // always inline assets
      rollupOptions: {
        input: {
          [process.env.npm_package_name]: fileURLToPath(
            new URL("./src/main.js", import.meta.url),
          ),
        },
        output: {
          entryFileNames: "[name].user.js",
          format: "iife",
          globals: {
            vue: "Vue",
            xbytes: "xbytes",
          },
        },
        external: ["vue", "xbytes"],
      },
    },
    plugins: [
      vue2(),
      banner({
        content: (fileName) => {
          if (isDev) {
            writeNewBuildNumber(++buildNumber);
          }

          return fileName.endsWith(".js")
            ? createBanner(isDev, buildNumber)
            : "";
        },
        verify: false,
      }),
      cssInjectedByJsPlugin({
        injectCode: (cssCode) => {
          return `GM_addStyle(${cssCode})`;
        },
      }),
    ],

    test: {
      include: ["tests/*.{test,spec}.js"],
      globals: true,
    },
  };
});
