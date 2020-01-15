/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const devMode = false;
const ROOT_DIR = path.resolve(__dirname);
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
module.exports = {
  entry: ['./src/index.jsx', './styles/main.css'],
  devServer: {
    contentBase: [BUILD_DIR, PUBLIC_DIR],
    hot: true,
    host: 'localhost',
    port: 8081,
    filename: 'js/[name].bundle.js',
  },
  output: {
    path: BUILD_DIR,
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].[hash].js',
    publicPath: '/',
    hotUpdateChunkFilename: 'hot/hot-update.[hash].js',
    hotUpdateMainFilename: 'hot/hot-update.[hash].json',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: devMode,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: devMode,
            },
          },
        ],
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&name=fonts/compiled/[name].[ext]',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.(ttf|eot)(\?[\s\S]+)?$/,
        use: 'file-loader?name=fonts/compiled/[name].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: ['file-loader?name=img/compiled/[name].[ext]'],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: !devMode },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new ExtractCssChunks({
      hot: true,
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: !devMode,
          annotation: true,
        },
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    namedModules: true,
    namedChunks: true,
    nodeEnv: devMode ? 'development' : 'production',
    flagIncludedChunks: false,
    occurrenceOrder: false,
    sideEffects: false,
    usedExports: false,
    concatenateModules: false,
    splitChunks: {
      hidePathInfo: true,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
    },
    noEmitOnErrors: true,
    checkWasmTypes: false,
    minimize: false,
  },
};
