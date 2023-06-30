const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'FloresCCTV',
      template: path.join(__dirname, '../static', 'index.html'),
      favicon: path.join(__dirname, '../static', 'favicon.ico'),
      inject: 'body',
      scriptLoading: 'blocking'
    })
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
