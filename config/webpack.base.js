const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const rootPath = path.join(__dirname, '..');
  const envFile = `.env.${env.APP_ENV}`;
  const envPath = `${rootPath}/${envFile}`;

  if (!fs.existsSync(envPath)) {
    throw Error(`The ${envFile} file was not found, have you declared it in the root of the project?`);
  }

  const config = dotenv.config({ path: envPath }).parsed;
  const envConfig = Object.keys(config).reduce(
    (acc, key) => ({
      ...acc,
      [key]: JSON.stringify(config[key])
    }),
    {}
  );

  return {
    entry: './src/index.tsx',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'FloresCCTV',
        template: path.join(__dirname, '../static', 'index.html'),
        favicon: path.join(__dirname, '../static', 'favicon.ico'),
        inject: 'body',
        scriptLoading: 'blocking'
      }),
      new webpack.DefinePlugin(envConfig)
    ],
    module: {
      rules: [
        {
          test: /\.(?:js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }]
              ]
            }
          }
        },
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader'
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: { plugins: ['autoprefixer'] }
              }
            }
          ],
        }
      ]
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, '../src/'),
        config: path.resolve(__dirname, '../config/')
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  };
};
