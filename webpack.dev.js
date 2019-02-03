const read = require('fs-readdir-recursive')
const path = require('path')

/** to access built-in plugin. - https://webpack.js.org/concepts/#plugins */
const webpack = require('webpack');

/** Simplifies creation of HTML files to serve your webpack bundles. - https://github.com/jantimon/html-webpack-plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** This is a simple plugin that uses Imagemin to compress all images in your project. - https://github.com/Klathmon/imagemin-webpack-plugin */
const ImageminPlugin = require('imagemin-webpack-plugin').default;

let pages = read(path.join(__dirname, 'views'));
let jsEntries = read(path.join(__dirname, 'src'))

let entries = {}

jsEntries.forEach(entry => {
  let js = entry.replace(/(\.\w+)/g, '');
  entries[js] = `./src/${entry}`;
});

const ASSET_PATH = process.env.ASSET_PATH || '/';


module.exports = {

  mode: 'development',

  output: {
    publicPath: ASSET_PATH
  },

  // entry point for webpack to begin compiling
  entry: entries,

  // Webpack will watch files and recompile whenever they change
  // if neccesary
  watch: true,

  // Control options related to watching the files.
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  },

  // dev Server setup
  devServer: {
    port: 9000,
    compress: true,

    // The local filesystem directory where static html files
    // should be placed to enjoy 'live-reloading'
    contentBase: path.resolve(__dirname, "views"),

    // 'Live-reloading' happens when you make changes to code
    // dependency pointed to by the 'entry' parameter.
    // To make live-reloading happen even when changes are made
    // to the static html pages in 'contentBase', add
    // 'watchContentBase'
    watchContentBase: true
  },

  // Here be modules
  // https://webpack.js.org/loaders/
  module: {
    rules: [
      {
        test: /\.css|scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translate CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },

  // Here be plugins
  // https://webpack.js.org/concepts/plugins/
  plugins:
    pages.map(page => {

      let chunk = page.replace(/(\.\w+)/g, '');

      let plugin = new HtmlWebpackPlugin({
        template: `./views/${page}`,
        inject: true,
        chunks: ['app', `${chunk}`],
        filename: `${page}`
      })

      return plugin;
    }).concat([
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        optipng: {
          optimizationLevel: 9
        }
      }),
      new webpack.DefinePlugin({
        'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        NODE_ENV: JSON.stringify('development'),
        PRODUCTION: JSON.stringify(false),
        VERSION: JSON.stringify('5fa3b9'),
      })
    ]),


}
