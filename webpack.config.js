const HtmlWebpackPlugin = require('html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.tsx',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 4000,
  },
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: __dirname + '/dist',
    publicPath: './',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new LodashModuleReplacementPlugin(),
    new Dotenv(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /temp/],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ts(x?)$/,
        exclude: [/node_modules/, /temp/],
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          // cacheGroupKey here is `commons` as the key of the cacheGroup
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .split('/')
              .reduceRight(item => item)
            const allChunksNames = chunks.map(item => item.name).join('~')
            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`
          },
          chunks: 'all',
        },
        defaultVendors: {
          enforce: true,
          reuseExistingChunk: true,
        },
      },
    },
  },
  //target: 'node'
  node: {
    fs: 'empty',
  },
}
