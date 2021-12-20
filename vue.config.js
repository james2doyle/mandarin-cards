// https://cli.vuejs.org/config/#configuration-reference
const config = require('./package.json');

process.env.VUE_APP_VERSION = config.version;

const repoName = config.repository.url.match(/\/\w+\/(.*?)\.git$/i)[1];

// pull in tailwind theme colors for the tile colors
const { emerald } = require('tailwindcss/colors');

module.exports = {
  // `docs` is a special folder that can be served via Github Pages without using a `gh-pages` branch
  outputDir: 'docs',
  publicPath: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  pwa: {
    themeColor: emerald['600'],
    msTileColor: emerald['600'],
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  },
  chainWebpack: (config) => {
    // ...other chains
    config.module // fixes https://github.com/graphql/graphql-js/issues/1272
      .rule('mjs$')
      .test(/\.mjs$/)
      .include
        .add(/node_modules/)
        .end()
      .type('javascript/auto');
  },
  configureWebpack: {
    resolve: {
      // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
      extensions: ['*', '.mjs', '.js', '.vue', '.json']
    }
  }
};
