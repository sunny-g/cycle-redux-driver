const path = require('path');
const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');
const EXAMPLE_DIR = path.resolve(__dirname, 'example');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: [
      [ 'es2015', { modules: false } ],
      'stage-0',
    ],
  },
};
const tsLoader = {
  loader: 'ts-loader',
};

module.exports = {
  devServer: {
    contentBase: EXAMPLE_DIR,
    port: 8080,
  },

  entry: './src/index.ts',

  output: {
    path: DIST_DIR,
    filename: 'index.js',
  },

  resolve: {
    extensions: [ '.js', '.ts' ],
  },

  module: {

    rules: [{
      test: /\.ts/,
      include: SRC_DIR,
      use: [
        babelLoader,
        tsLoader,
      ],
    }, {
      test: /\.js/,
      include: SRC_DIR,
      use: [
        babelLoader,
      ],
    }],
  },
};
