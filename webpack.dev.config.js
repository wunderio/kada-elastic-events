var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
  devtool:"eval",
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index.tsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new WebpackShellPlugin({
      onBuildStart: [],
      onBuildEnd: ['npm run extract-translations']
    }),
  ],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    },
    extensions:[".js", ".ts", ".tsx","", ".webpack.js", ".web.js"],
    fallback: path.join(__dirname, "node_modules")
  },
  resolveLoader: {
    root: path.join(__dirname, "node_modules")
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['react-hot', 'ts'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(scss|css)$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: [
            'file-loader?name=[name].[ext]'
        ]
      }
    ]
  }
};
