const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  entry: './src/whatsnext.ts',
  mode: "development",
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

const test = {
  ...config,
  externals: ["ava"],
  entry: ["./test/time-tests.ts"],
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, 'dist/test'),
    libraryTarget: "commonjs2",
  },
}
 
module.exports = [config, test]