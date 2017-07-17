const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: './css/styles.css',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = {
  entry: ['./src/scripts.js'],
  output: {
    filename: './js/scripts.js',
    path: path.resolve(__dirname, './'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
  plugins: [
    extractSass,
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: [path.join(__dirname, '/index.html')],
      purifyOptions: {
        whitelist: ['focus', 'show', 'is-loading']
      }
    }),
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['./'] }
    })
  ],
};
