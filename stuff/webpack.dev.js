const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",

  devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: "./",
    clean: true,
  },
});
