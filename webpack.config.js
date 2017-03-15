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
  entry: './src/index.ts',

  output: {
    path: './dist',
    filename: 'index.js',
  },

  resolve: {
    extensions: [ '.js', '.ts' ],
  },

  module: {

    rules: [{
      test: /\.ts/,
      exclude: /node_modules/,
      use: [
        babelLoader,
        tsLoader,
      ],
    }, {
      test: /\.js/,
      exclude: /node_modules/,
      use: [
        babelLoader,
      ],
    }],
  },
};
