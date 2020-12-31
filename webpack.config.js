const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

function addPlugins() {

  const plugins = [];

  fs.readdirSync('./src/html').forEach(file => {
    plugins.push(new HtmlWebpackPlugin({
      hash: true, //This is useful for cache busting
      filename: `${file}`,
      chunks: ['main'],
      inject: true,
      template: `./src/html/${file}`
    }))
  });

  plugins.push(new CleanWebpackPlugin())
  plugins.push(new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css'
  }))
  plugins.push(new CopyPlugin({
    patterns: [
      { from: './src/images', to: 'images' },
    ],
  }))

  return plugins
}

const config = {
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: addPlugins(),
  //https://webpack.js.org/guides/caching/
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   outputPath: 'sadas'
            // }
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true, // если true включить оптимизацию, false - выключить. Нужно настроить для dev-a и продакшина
            },
          }
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      }
    ],
  }
}

module.exports = (env, { mode }) => {

  const isProduction = mode;
  config.mode = isProduction ? 'production' : 'development'

  if (isProduction) {

  } else {
    config.devtool = 'source-map'
  }

  return config
  
} 