const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;

const extractSass = new ExtractTextPlugin({
  filename: './css/styles.css',
});


module.exports = {
  entry: ['./src/scripts.js', './src/styles.scss'],
  output: {
    filename: './js/scripts.js',
    path: path.resolve(__dirname, './'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')(),
                ],
              },
            },
            { loader: 'sass-loader' },
          ],
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env'],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    extractSass,
    new PurifyCSSPlugin({
      paths: [path.join(__dirname, 'index.html')],
      purifyOptions: {
        whitelist: ['focus', 'show', 'is-loading'],
      },
    }),
    new CssoWebpackPlugin({ comments: 'first-exclamation' }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['./'] },
      files: ["css/styles.css", "js/scripts.js", "index.html"],
    }),
  ],
};
