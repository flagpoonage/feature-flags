const assert = require('assert');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');

// require('style-loader');
// require('typings-for-css-modules-loader');
// require('postcss-loader');
// require('css-loader');
require('ts-loader');

console.log(process.cwd());

const missingConfigMessage = 'You must provide a webpack configuration';

const url = [
  {
    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
    loader: 'url-loader',
    options: {
      limit: 8192,
    },
  },
];

const typescript = [
  {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  },
];

const css = [
  {
    test: /\.css$/i,
    use: [
      'style-loader',
      // '@teamsupercell/typings-for-css-modules-loader',
      {
        loader: 'css-loader',
        options: { modules: { auto: true } },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: { plugins: [postcssPresetEnv({ stage: 0 })] },
        },
      },
    ],
  },
];

function assertConfig(webpackConfig) {
  assert(webpackConfig, missingConfigMessage);

  if (
    typeof webpackConfig === 'string' ||
    typeof webpackConfig === 'boolean' ||
    typeof webpackConfig === 'number' ||
    typeof webpackConfig === 'symbol' ||
    typeof webpackConfig === 'bigint' ||
    Array.isArray(webpackConfig)
  ) {
    throw new Error(missingConfigMessage);
  }
}

function pipe(webpackConfig, handlers) {
  return handlers.reduce((config, handler) => {
    return handler(config);
  }, webpackConfig);
}

function configureJs(webpackConfig) {
  return configureResolvedExtensions(webpackConfig, ['.js', '.json']);
}

function configureUrl(webpackConfig) {
  assertConfig(webpackConfig);
  return configureModuleRules(webpackConfig, url);
}

function configureCss(webpackConfig) {
  assertConfig(webpackConfig);
  console.log('Configuring CSS...');
  return configureResolvedExtensions(configureModuleRules(webpackConfig, css), [
    '.css',
  ]);
}

function configureTypescript(webpackConfig, extensions) {
  assertConfig(webpackConfig);
  console.log('Configuring Typescript...');

  return configureResolvedExtensions(
    configureModuleRules(webpackConfig, typescript),
    extensions
  );
}

function configureModuleRules(webpackConfig, newRules) {
  const currentRules = webpackConfig.module && webpackConfig.module.rules;

  if (!Array.isArray(currentRules)) {
    webpackConfig.module = {
      ...(webpackConfig.module || {}),
      rules: newRules,
    };
  } else {
    webpackConfig.module.rules = [...currentRules, ...newRules];
  }

  return webpackConfig;
}
function configureResolvedExtensions(webpackConfig, extensions) {
  assertConfig(webpackConfig);

  const currentResolveExtensions =
    webpackConfig.resolve && webpackConfig.resolve.extensions;

  console.log('Configuring resolve extensions...');

  if (!Array.isArray(currentResolveExtensions)) {
    webpackConfig.resolve = {
      ...(webpackConfig.resolve || {}),
      extensions,
    };
  } else {
    const extensionSet = new Set(currentResolveExtensions);
    extensions.forEach((ext) => extensionSet.add(ext));

    webpackConfig.resolve.extensions = Array.from(extensionSet);
  }

  return webpackConfig;
}

exports.configureAll = function configureAll(webpackConfig) {
  return pipe(webpackConfig, [
    configureUrl,
    configureCss,
    configureJs,
    (config) => configureTypescript(config, ['.ts', '.tsx']),
  ]);
};

exports.configureResolvedExtensions = configureResolvedExtensions;
exports.configureModuleRules = configureModuleRules;
