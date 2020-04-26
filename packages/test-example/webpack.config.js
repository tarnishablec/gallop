const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const { DefinePlugin } = require('webpack')

const ProdMode = process.env.NODE_ENV === 'production'

// console.log(__dirname)

module.exports = {
  mode: 'development',
  entry: {
    main: './App.ts'
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // watch: true,
  // watchOptions: {
  //   poll: 1000,
  //   aggregateTimeout: 500,
  //   ignored: /node_modules/,
  // },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
    alias: {
      // '~': path.resolve(__dirname, 'src')
    }
  },
  optimization: {
    minimize: ProdMode,
    /**
     * TODO
     * 🚫 terser cause component props name can not be auto detected
     * Feature request: https://github.com/terser/terser/issues/622
     * if you want to enable minimization
     * ensure using propNameList argument in component(name,builder,[...propNames])
     * to make gallop having ability to know your component's prop names
     */
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i
      })
    ]
  },
  module: {
    rules: [
      { test: /\.(j|t)sx?$/, use: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.((s[ac])|c)ss$/,
        use: [
          // 'to-string-loader',
          ProdMode ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.ico$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/assets/',
              name: 'icon/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // publicPath: '',
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  outputPath: '/assets/',
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  },
  devtool: ProdMode ? false : 'inline-source-map',
  // devtool: false,
  devServer: {
    contentBase: './dist',
    open: true,
    stats: 'errors-only',
    compress: false,
    host: 'localhost',
    port: 8089
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['./dist']
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
      favicon: './public/favicon.ico',
      minify: {
        // collapseWhitespace: true,
        removeComments: true
      },
      hash: true,
      templateParameters: {
        env: JSON.stringify(process.env)
      }
    }),
    new DefinePlugin({
      'process.env': {
        BASE_URL: '""'
      }
    }),
    new CopyWebpackPlugin([
      {
        from: __dirname + '/public',
        to: __dirname + '/dist',
        toType: 'dir',
        ignore: ['index.html', 'favicon.ico']
      }
    ]),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ]
}
