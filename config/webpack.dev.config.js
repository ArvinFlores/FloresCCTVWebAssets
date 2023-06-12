const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
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
