import vue2 from "@vitejs/plugin-vue2";
import chalk from "chalk";
import fs from "fs";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import banner from "vite-plugin-banner";

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

export default defineConfig(({ command }) => {
  const isServe = command === "serve";

  if (isServe) {
    writeNewBuildNumber(++buildNumber);
  }

  return {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      port: 10010,
    },
    build: {
      minify: false,
      cssMinify: true,
      cssCodeSplit: true,
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
        content: createBanner(isServe, buildNumber),
        verify: false,
      }),
    ],
  };
});
