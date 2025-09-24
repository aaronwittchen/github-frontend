const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new ESLintPlugin({
        files: ['src/**/*.{js,vue}'],
      }),
    ],
  },
};
