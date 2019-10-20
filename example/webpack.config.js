/**
 * @file config file
 */

const path = require('path');
const fs = require('fs');

module.exports = {
  mode: 'development',

  entry: {
    main: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, './static/'),
    publicPath: '/static/',
    filename: 'bootstrap.js',
    // chunkFilename: 'chunk/[name].chunk.js?_t=[chunkhash]',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      }
    ]
  },

  devServer: {
    hot: true,
    contentBase: path.join(__dirname, './'),
    compress: true,
    publicPath: '/static',
    port: 8091,
    inline: true,
    before(app) {
      app.get('/example/rs', function (req, res) {
        const templatePath = path.join(__dirname, './index.html');
        fs.readFile(templatePath, {'encoding': 'UTF-8'}, function(err, html) {
          res.send(html);
        });
      });
    }
  }
};