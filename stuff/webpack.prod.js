const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map", // inline-- or eval-- increase the bundle size
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "/dist"),
    clean: true,
  },
});
