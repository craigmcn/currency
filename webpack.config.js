const HtmlWebpackPlugin = require('html-webpack-plugin')
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
    filename: '[name].bundle.js',
    path: __dirname + '/dist',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
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
  //target: 'node'
  node: {
    fs: 'empty',
  },
}
