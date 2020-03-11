const path = require('path');

let baseConfig = {
  entry: './src/whatsnext.ts',
  mode: "development",
  output: {
      filename: 'whatsnext.js',
      path: path.resolve(__dirname, 'public')
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

let webConfig = {
  ...baseConfig, 
  target: "web",
  output: {
    ...baseConfig.output,
    filename: "whatsnext.web.js",
    library: "whatsnext",
    libraryTarget: "umd"
  }
}


let nodeConfig = {
  ...baseConfig, 
  target: "node",
  output:{
    ...baseConfig.output,
    filename: "whatsnext.node.js",
    library: "whatsnext",
    libraryTarget: "commonjs2"
  }
}

module.exports = [webConfig, nodeConfig]