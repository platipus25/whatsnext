const path = require('path')
//const TerserPlugin = require('terser-webpack-plugin');

let config = {
  entry: path.resolve(__dirname, 'src/whatsnext.js'),
  mode: 'production',
  externals: ['yaml'],
  output: {
      filename: 'whatsnext.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'whatsnext',
      globalObject: 'globalThis',
      libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ]
  },
  /*optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          //keep_fnames: true,
        },
      }),
    ],
  },*/
}

let config_bundle_yaml= {
  ...config,
  externals: [],
  output: {
    ...config.output,
    filename: 'whatsnext.yaml.js',
  }
}

module.exports = [config, config_bundle_yaml]
