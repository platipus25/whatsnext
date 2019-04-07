const path = require('path');

module.exports = {
    entry: './src/whatsnext.ts',
    mode: "production",
    output: {
        filename: 'whatsnext.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        { test: /\.ts$/, use: 'ts-loader' }
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 8080
    },
    resolve: {
      modules: [
        "node_modules",
        path.resolve(__dirname, "src")
      ]
    }
  };