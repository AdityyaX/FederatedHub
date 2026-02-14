const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
      publicPath: 'auto',
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },

    plugins: [
      // Module Federation Plugin - This is the MAGIC! 🪄
      new ModuleFederationPlugin({
        name: 'shell', // Name of this host application
        
        // Remotes: Other MFEs we want to load dynamically
        // Format: remoteName: 'remoteName@remoteURL/remoteEntry.js'
        remotes: {
          // We'll add these as we create the MFEs
          // analytics: 'analytics@http://localhost:3001/remoteEntry.js',
          // dashboard: 'dashboard@http://localhost:3002/remoteEntry.js',
        },

        // Shared dependencies - CRITICAL for React!
        shared: {
          react: {
            singleton: true, // Only one instance of React
            requiredVersion: '^18.2.0',
            eager: true, // Load immediately
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true,
          },
          '@federated-hub/shared-sdk': {
            singleton: true, // Ensure all MFEs share the same SDK instance
            eager: true,
          },
        },
      }),

      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'FederatedHub - Shell',
      }),
    ],

    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow MFEs to be loaded
      },
    },

    // Performance hints
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };
};
