const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const packageConfig = require("./package.json");
const userscript = require("./userscript");

const buildNumberFile = path.resolve(__dirname, "BUILD");

function resolve(...paths) {
  return path.resolve(__dirname, ...paths);
}

function writeNewBuildNumber(number) {
  fs.writeFile(buildNumberFile, number, function(err) {
    if (err) {
      throw err;
    } else {
      console.log(`Build Number Set to ${number}`);
    }
  });
}

module.exports = (env, options) => {
  const isProduction = options.mode === "production";

  let buildNumber = 0;

  if (fs.existsSync(buildNumberFile)) {
    const data = fs.readFileSync(buildNumberFile, "UTF-8");
    buildNumber = +data || 0;
  }

  return {
    mode: options.mode,
    entry: {
      [packageConfig.name]: resolve("src", "index.js")
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].user.js"
    },
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    resolveLoader: {
      alias: {
        "userscript-style-loader": resolve("userscript-style-loader.js")
      }
    },
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      disableHostCheck: true,
      port: 9000,
      https: {
        key: fs.readFileSync("/Users/liao/keys/private.key"),
        cert: fs.readFileSync("/Users/liao/keys/private.crt"),
        ca: fs.readFileSync("/Users/liao/keys/private.pem")
      } // Can't disable https when window.location.protocol === https:
    },
    externals: {
      vue: "Vue"
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /(node_modules)/,
          loader: "vue-loader"
        },
        {
          test: /\.css$/,
          exclude: /(node_modules)/,
          use: ["userscript-style-loader", "css-loader", "postcss-loader"]
        },
        {
          test: /\.styl(us)?$/,
          exclude: /(node_modules)/,
          use: [
            "userscript-style-loader",
            "css-loader",
            "postcss-loader",
            "stylus-loader"
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          exclude: /(node_modules)/,
          loader: "url-loader"
        },
        {
          test: /\.pug$/,
          loader: "pug-plain-loader"
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
            output: {
              beautify: true
            }
          }
        }),
        new webpack.BannerPlugin({
          banner: function() {
            if (!isProduction) {
              writeNewBuildNumber(++buildNumber);
            }

            return userscript.createBanner(!isProduction, buildNumber);
          },
          raw: true,
          entryOnly: true
        })
      ]
    }
  };
};
