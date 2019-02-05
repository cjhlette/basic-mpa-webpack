const read = require('fs-readdir-recursive');
const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const ImageminPlugin = require('imagemin-webpack-plugin').default;

const CopyWebpackPlugin = require('copy-webpack-plugin');

let pages = read(path.join(__dirname, 'views'));
let jsEntries = read(path.join(__dirname, 'src'));

let entries = {};

for (const entry of jsEntries) {
  let js = entry.replace(/(\.\w+)/g, '');
  entries[js] = `./src/${entry}`;
}

module.exports = {

  mode: 'development',

  entry: entries,

  watch: true,

  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  },

  stats: {
    colors: true
  },

  devtool: 'source-map',

  devServer: {
    port: 9000,
    compress: true,
    contentBase: path.resolve(__dirname, "views"),
    watchContentBase: true,
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        }
      },
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

  plugins:
    pages.map(page => {

      let chunk = page.replace(/(\.\w+)/g, '');

      let plugin = new HtmlWebpackPlugin({
        template: `./views/${page}`,
        inject: true,
        chunks: ['app', `${chunk}`],
        filename: `${page}`
      });

      return plugin;
    }).concat([
      new CopyWebpackPlugin([{
        from: 'public/'
      }]),
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        optipng: {
          optimizationLevel: 9
        }
      }),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify('development'),
        PRODUCTION: JSON.stringify(false),
        VERSION: JSON.stringify('5fa3b9'),
      })
    ])

};
