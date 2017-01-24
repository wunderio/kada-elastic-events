var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/index.tsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
    css: 'styles.css'
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    },
    extensions:["", ".js", ".ts", ".tsx", ".webpack.js", ".web.js"],
    fallback: path.join(__dirname, "node_modules")
  },
  resolveLoader: {
    root: path.join(__dirname, "node_modules")
  },
//  devtool: 'eval-source-map',
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin("styles.css", {allChunks:true}),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['exports', 'require', '$super', 'Drupal', 'DrupalSettings']
      },
      output: {
        comments: false,
      },
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.(tsx|ts|jsx|js)$/,
        loaders: ['react-hot', 'babel', 'ts'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract("style-loader","css-loader!sass-loader")
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
