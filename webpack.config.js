const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

let config = {
  entry: './src/whatsnext.ts',
  mode: "production",
  //externals: ["countdown"],
  output: {
      filename: 'whatsnext.js',
      path: path.resolve(__dirname, 'public'),
      library: "whatsnext",
      globalObject: 'this',
      libraryTarget: "umd",
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          //keep_fnames: true,
        },
      }),
    ],
  },
}

module.exports = config