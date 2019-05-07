const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');

module.exports = merge(webpackConfig, {
  entry: path.resolve(__dirname, '../lib/dev.js'),
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'static/js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    open: true,
    port: 5000,
    hot: true,
    overlay: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});