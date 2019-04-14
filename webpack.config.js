const path = require('path');

let baseConfig = {
  entry: './src/whatsnext.ts',
  mode: "production",
  output: {
      filename: 'whatsnext.js',
      path: path.resolve(__dirname, 'dist'),
      library: "whatsnext",
      libraryTarget: "ES2015"
  },
  module: {
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
}

let webConfig = {
  ...baseConfig, 
  target: "web",
  output:{
    filename: "whatsnext.web.js"
  }
}


let nodeConfig = {
  ...baseConfig, 
  target: "node",
  output:{
    filename: "whatsnext.node.js"
  }
}

module.exports = [webConfig, nodeConfig]