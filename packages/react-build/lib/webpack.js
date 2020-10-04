const assert = require('assert');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');

require('ts-loader');

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
      MiniCssExtractPlugin.loader,
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

function configureHtml(webpackConfig) {
  assertConfig(webpackConfig);

  return configurePlugins(webpackConfig, [new HtmlWebpackPlugin()]);
}

function configureJs(webpackConfig) {
  assertConfig(webpackConfig);

  return configureResolvedExtensions(webpackConfig, ['.js', '.json']);
}

function configureUrl(webpackConfig) {
  assertConfig(webpackConfig);
  return configureModuleRules(webpackConfig, url);
}

function configureCss(webpackConfig) {
  assertConfig(webpackConfig);
  return pipe(webpackConfig, [
    (cfg) => configurePlugins(cfg, [new MiniCssExtractPlugin()]),
    (cfg) => configureModuleRules(cfg, css),
    (cfg) => configureResolvedExtensions(cfg, ['.css']),
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

function configurePlugins(webpackConfig, plugins) {
  assertConfig(webpackConfig);

  webpackConfig.plugins = Array.isArray(webpackConfig.plugins)
    ? [...webpackConfig.plugins, ...plugins]
    : plugins;

  return webpackConfig;
}

function configureModuleRules(webpackConfig, newRules) {
  assertConfig(webpackConfig);

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
  const output = pipe(webpackConfig, [
    configureHtml,
    configureUrl,
    configureCss,
    configureJs,
    (config) => configureTypescript(config, ['.ts', '.tsx']),
  ]);

  console.log(output.plugins);

  return output;
};

exports.configureResolvedExtensions = configureResolvedExtensions;
exports.configureModuleRules = configureModuleRules;
