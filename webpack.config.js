const path = require('path');

module.exports = {
    entry: './index.js',
    mode: "development",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        { test: /\.ts$/, use: 'ts-loader' }
      ]
    }
  };