const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const base = require('./webpack.base');

module.exports = (env) => {
  const plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ];

  if (Boolean(env.ANALYZE)) {
    plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    }));
  }

  return merge(base(env), {
    mode: 'production',
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, '../build'),
      clean: true
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          }
        }
      },
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false
            }
          }
        })
      ]
    }
  });
};
