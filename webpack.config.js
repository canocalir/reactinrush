const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin({
    hash: true,
    inject: true,
    template: './public/index.html'
  })],
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
    extensions: [".js", "jsx", ".json"],
  },
  devServer: {
    port: "auto",
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
