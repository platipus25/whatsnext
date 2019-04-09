const path = require('path');

let testConfig = {
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
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  },
  resolve: {
    enforceExtension: false,
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ]
  }
};

let webConfig = {
  target: "web",
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
  resolve: {
    enforceExtension: false,
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ]
  }
};

let nodeConfig = {
  target:"node",
  entry: './src/whatsnext.ts',
  mode: "production",
  output: {
      filename: 'whatsnext.node.js',
      path: path.resolve(__dirname, 'dist'),
      library: "whatsnext",
      libraryTarget: "umd"
  },
  module: {
    enforceExtension: false,
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ]
  }
};

module.exports = [testConfig, webConfig, nodeConfig]