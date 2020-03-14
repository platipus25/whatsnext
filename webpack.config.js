const path = require('path');

let config = {
  entry: './src/whatsnext.ts',
  mode: "development",
  output: {
      filename: 'whatsnext.js',
      path: path.resolve(__dirname, 'dist'),
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
  }
}

module.exports = config