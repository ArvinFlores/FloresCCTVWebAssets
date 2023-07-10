const { merge } = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  optimization: {
    runtimeChunk: 'single'
  },
  devServer: {
    static: '../build',
    port: 7777,
    https: true
  },
});
