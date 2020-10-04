const path = require('path');
const { configureAll } = require('react-build');

module.exports = configureAll({
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
});
