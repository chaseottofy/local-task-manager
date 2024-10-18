const path = require('node:path');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const zlib = require('node:zlib');

const webpackConfig = (_, argv) => {
  const { mode } = argv;
  const isDev = mode === 'development';
  const config = {
    entry: ['whatwg-fetch', './src/index.js'],
    output: {
      // filename: isDev ? '[name].js' : '[name].[contenthash].js',
      // chunkFilename: isDev ? '[name].js' : '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devtool: isDev ? 'source-map' : false,
    mode,
    experiments: {
      topLevelAwait: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          // : [MiniCssExtractPlugin.loader, 'css-loader'],
          test: /\.css$/,
          use: isDev
            ? ['style-loader', 'css-loader']
            : [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  postcssOptions: {
                    plugins: [
                      postcssPresetEnv(),
                      autoprefixer(),
                    ],
                  },
                },
              },
            ],
        },
        {
          test: /\.woff2$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(ico|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new WebpackManifestPlugin(
        {
          fileName: 'manifest.json',
          basePath: 'dist/',
        },
      ),
      new HtmlWebpackPlugin({
        title: 'task manager',
        template: './src/index.html',
        favicon: './src/favicon.ico',
        filename: 'index.html',
        inject: 'head',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      open: {
        target: ['http://localhost:9000'],
        app: {
          name: 'chrome',
          arguments: ['--incognito'],
        },
      },
    },
    optimization: {
      minimize: isDev === false,
      minimizer: [
        new TerserPlugin({
          extractComments: true,
        }),
        new HtmlMinimizerPlugin(),
        new CssMinimizerPlugin(),
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$|\.json$/,
          threshold: 10_240, // Only compress files larger than 10KB
          minRatio: 0.8,
        }),
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|json|svg)$/,
          compressionOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
            },
          },
          threshold: 10_240,
          minRatio: 0.8,
        }),
      ],

      splitChunks: {
        chunks: 'all',
        minSize: 20_000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50_000,
        cacheGroups: {
          defaultVendors: {
            test: /[/\\]node_modules[/\\]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  };

  if (isDev === false) {
    /**
     * html-loader with custom svg processing script
     * -- Production-only --
     *
     * Extracts inline svg elements from HTML
     * Creates svg file in dist
     * replaces inline svg with <img> with reference to new svg file
    */
    config.module.rules.push({
      test: /\.html$/,
      use: [
        'html-loader',
        path.resolve(__dirname, './scripts/handle-inline-svg.js'),
      ],
    });

    const svgMinify = new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.svgoMinify,
        options: {
          encodeOptions: {
            multipass: true,
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                    removeTitle: false,
                  },
                },
              },
            ],
          },
        },
      },
    });

    config.optimization.minimizer.push(svgMinify);
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          { from: './src/assets/robots.txt', to: 'robots.txt' },
        ],
      }),
      svgMinify,
    );
  }

  return config;
};

module.exports = webpackConfig;
