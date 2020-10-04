const build = require('react-build');

const { moduleRules } = build;

module.exports = {
  module: {
    rules: [...moduleRules.typescript, ...moduleRules.css, ...moduleRules.url],
  },
};
