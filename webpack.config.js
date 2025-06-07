const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'arcraft.min.js',
    path: path.resolve(__dirname, 'dist/browser'),
    library: {
      type: 'umd',
      name: 'arcraft',
    },
    globalObject: 'this',
  },
  devtool: 'source-map',
  resolve: {
    // Add '.ts' as resolvable extensions
    extensions: ['.ts', '.js'],
    extensionAlias: { '.js': ['.ts', '.js'] },
    fallback: {
      "fs": false,
      "path": false,
      "crypto": false,
      "stream": false,
      "util": false,
      "buffer": false,
      "process": false,
    },
  },
  module: {
    rules: [
      // All files with a '.ts' extension will be handled by 'ts-loader'.
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig-browser.json'),
        },
        exclude: /node_modules/,
      },
    ],
    // Don't parse tweetnacl module — https://github.com/dchest/tweetnacl-js/wiki/Using-with-Webpack
    noParse: [/[\\/]tweetnacl[\\/]/, /[\\/]tweetnacl-auth[\\/]/],
  },
  externals: {
    'form-data': 'FormData',
  },
};