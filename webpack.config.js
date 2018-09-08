// Defining rules for loaders
// babel-loader loads JSX/JS; css-loader loads and bundles CSS files into one css file
// style-loader adds all styles inside style tag of document
// NOTE: webpack executes loaders from last to first

const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index_bundle.js"
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            },
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          }
        ]
      },
      plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html"
        })
      ]
};