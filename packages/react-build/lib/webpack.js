const postcssPresetEnv = require('postcss-preset-env');

const url = [
  {
    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
    loader: 'url-loader',
    options: {
      limit: 8192,
    },
  },
];

const typescript = [];

const css = [
  {
    test: /\.module.css$/i,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          // Run `postcss-loader` on each CSS `@import`, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
          // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
          importLoaders: 1,
          // Automatically enable css modules for files satisfying `/\.module\.\w+$/i` RegExp.
          modules: { auto: true },
        },
      },
      {
        loader: 'postcss-loader',
        options: { plugins: () => [postcssPresetEnv({ stage: 0 })] },
      },
    ],
  },
  {
    test: /\.css$/i,
    exclude: /\.module.css$/i,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: { plugins: () => [postcssPresetEnv({ stage: 0 })] },
      },
    ],
  },
];

exports.rulesets = {
  css,
  typescript,
  url,
};
