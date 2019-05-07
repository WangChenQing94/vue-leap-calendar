const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static/images'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.vue']
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, '../build/favicon.ico'),
      template: path.resolve(__dirname, '../build/index.html')
    }),
    new VueLoaderPlugin()
  ],
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all'
    }
  }
}