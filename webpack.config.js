const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    chunkIds: 'deterministic',
    runtimeChunk: {
      name: entrypoint => `runtimechunk~${entrypoint.name}`
    },
    minimize: true,
  },
  entry: "./index.js",
  output: {
    path: __dirname + '/dist',
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
    hash: true,
    inject: true,
    template: './public/index.html',
    favicon: `public/favicon.ico`,
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }
  }),
  new MiniCssExtractPlugin({
    filename: `static/css/[name].[contenthash].css`,
    chunkFilename: `static/css/[id].[contenthash].css`
}),
new TerserPlugin({
  terserOptions: {
      format: {
          comments: false,
      },
  },
  extractComments: false,
  parallel: true,
}),
],
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
