const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/scripts/index.js'),
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({ patterns: [{ from: Path.resolve(__dirname, '../public'), to: 'public' }] }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
    }),
    new WebpackPwaManifest({
      name: 'My Progressive Web App',
      short_name: 'MyPWA',
      description: 'My awesome Progressive Web App!',
      background_color: '#ffffff',
      theme_color: "#ffffff",
      "theme-color": "#ffffff",
      start_url: "/",
      publicPath: "/",
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      icons: [
        {
          src: Path.resolve(__dirname, '../public/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        },
        {
          src: Path.resolve(__dirname, '../public/large-icon.png'),
          size: '1024x1024' // you can also use the specifications pattern
        },
        {
          src: Path.resolve(__dirname, '../public/maskable-icon.png'),
          size: '1024x1024',
          purpose: 'maskable'
        },
        {
          src: Path.resolve(__dirname, '../public/icon.png'),
          sizes: [120, 152, 167, 180, 1024],
          destination: Path.join('icons', 'ios'),
          ios: true
        },
        {
          src: Path.resolve(__dirname, '../public/icon.png'),
          size: 1024,
          destination: Path.join('icons', 'ios'),
          ios: 'startup'
        },
        {
          src: Path.resolve(__dirname, '../public/icon.png'),
          sizes: [36, 48, 72, 96, 144, 192, 512],
          destination: Path.join('icons', 'android')
        }
      ],
    }),
    new WorkboxPlugin.GenerateSW({
      // Do not precache images
      exclude: [/\.(?:png|jpg|jpeg|svg)$/],

      // Define runtime caching rules.
      runtimeCaching: [{
        // Match any request that ends with .png, .jpg, .jpeg or .svg.
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

        // Apply a cache-first strategy.
        handler: 'CacheFirst',

        options: {
          // Use a custom cache name.
          cacheName: 'images',

          // Only cache 10 images.
          expiration: {
            maxEntries: 10,
          },
        },
      }],
    })
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
};
