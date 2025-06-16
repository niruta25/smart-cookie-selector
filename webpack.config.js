const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      background: './src/background.js',
      content: './src/content.js',
      popup: './src/popup.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/manifest.json', to: 'manifest.json' },
          { from: 'src/popup.html', to: 'popup.html' },
          { from: 'src/icons', to: 'icons' },
          { from: 'src/styles', to: 'styles', noErrorOnMissing: true }
        ]
      }),
      ...(isProduction ? [
        new ZipPlugin({
          filename: 'smart-cookie-selector.zip',
          exclude: [/\.map$/]
        })
      ] : [])
    ],
    devtool: isProduction ? false : 'source-map',
    optimization: {
      minimize: isProduction
    },
    resolve: {
      extensions: ['.js', '.json']
    }
  };
};