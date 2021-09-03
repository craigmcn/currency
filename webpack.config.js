const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const config = {
  entry: {
    app: './src/index.tsx',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './tmp',
    port: 4000,
    publicPath: '/',
  },
  output: {
    filename: '[name].[contenthash].bundle.js',
    publicPath: './',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new LodashModuleReplacementPlugin(),
    new Dotenv({ systemvars: true }),
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
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          // cacheGroupKey here is `commons` as the key of the cacheGroup
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .replace(/\\/g, '/')
              .split('/')
              .reduceRight((item) => item);
            const allChunksNames = chunks.map((item) => item.name).join('~');
            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
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
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
};

module.exports = (env) => {
  const distConfig = Object.assign({}, config, {
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
  });

  const netlifyRootConfig = Object.assign({}, config, {
    output: {
      path: path.resolve(__dirname, 'netlify'),
    },
  });

  const netlifySubConfig = Object.assign({}, config, {
    output: {
      path: path.resolve(__dirname, 'netlify', 'currency'),
    },
  });

  return env.netlify ? [netlifyRootConfig, netlifySubConfig] : distConfig;
};
