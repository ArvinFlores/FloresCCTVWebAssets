const { merge } = require('webpack-merge');
const base = require('./webpack.base');

module.exports = (env) => merge(base(env), {
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
