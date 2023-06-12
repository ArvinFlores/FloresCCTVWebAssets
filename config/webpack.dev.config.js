const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    devtool: 'eval-cheap-module-source-map',
    optimization: {
        runtimeChunk: 'single'
    },
    devServer: {
        static: '../build',
        port: 7777
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../build'),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'FloresCCTV',
            template: path.join(__dirname, '../static', 'index.html'),
            favicon: path.join(__dirname, '../static', 'favicon.ico'),
            inject: 'body'
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
                            postcssOptions: {
                                plugins: ['autoprefixer']
                            }
                        }
                    }
                ],
            }
        ]
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, '../src/')
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
};
