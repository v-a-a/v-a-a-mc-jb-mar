const PACKAGE = require("../package.json");
const webpack = require("webpack");
const path = require("path");
// const CopyPlugin = require("copy-webpack-plugin");

module.exports = function (env, argv) {
  const prod = argv.mode === "production";
  const distPath = path.join(__dirname, "../dist");

  return {
    mode: prod ? "production" : "development",
    devtool: "cheap-source-map",
    entry: path.resolve(__dirname, "../frontend/js/index.js"),
    output: {
      path: path.resolve(distPath),
      filename: "split-activity.js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
      ],
    },
    plugins: [
      // new CopyPlugin([
      //     {
      //         // you may want to bundle SLDS SASS files with webpack,
      //         // we'll keep things simple for this example and just copy SLDS into dist
      //         from: path.resolve(__dirname, '../node_modules/@salesforce-ux/design-system/assets'),
      //         to: path.resolve(distPath, '../dist/design-system')
      //     },
      // ]),
      new webpack.BannerPlugin(`${PACKAGE.author} - ${PACKAGE.description}`),
    ],
  };
};
