const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  entry: path.resolve(__dirname, '../lib/main.js'),
  output: {
    filename: 'leapCalendar.js',
    library: 'leapCalendar',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[id].[hash].css',
      chunkFilename: 'static/css/[id].[hash].css'
    })
  ]
})