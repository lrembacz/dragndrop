const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const configs = [
    {
        name: 'main-js-a-la-carte',
        entry: {
            draggable: path.resolve(__dirname, './packages/draggable/index.ts'),
            // dropzone: path.resolve(__dirname, './packages/dropzone/index.ts')
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            // publicPath: httpDirAbsolutePath,
            filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].js',
            libraryTarget: 'umd',
            library: ['dnd', '[name]']
        },
        resolve: {
          extensions: ['.ts', '.js']
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                              configFile: path.resolve(__dirname, './tsconfig.json')
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        }
                    ]
                }
            ]
        },
        optimization: {
            minimize: process.env.NODE_ENV === 'production',
            minimizer: [
                new UglifyJSPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false // Removes repeated @license comments and other code comments.
                        },
                        sourceMap: true
                    }
                })
            ]
        }
    },
    {
        name: 'main-js-combined',
        entry: {
            draggable: path.resolve(__dirname, './packages/dnd/index.ts')
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            // publicPath: httpDirAbsolutePath,
            filename: process.env.NODE_ENV === 'production' ? 'dnd.min.js' : 'dnd.js',
            libraryTarget: 'umd',
            library: ['dnd']
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.resolve(__dirname, './tsconfig.json')
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        }
                    ]
                }
            ]
        },
        optimization: {
            minimize: process.env.NODE_ENV === 'production',
            minimizer: [
                new UglifyJSPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false // Removes repeated @license comments and other code comments.
                        },
                        sourceMap: true
                    }
                })
            ]
        }
    }
];

module.exports = configs;