const path = require('path');
const {
  createConfig, babel, postcss, sass, setEnv,
} = require('webpack-blocks');
// const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');

// const {
//   generateCSSReferences,
//   generateJSReferences
// } = MiniHtmlWebpackPlugin;

module.exports = {
  webpackConfig: createConfig([
    babel(), postcss(), sass(),
    setEnv({
      NODE_ENV: process.env.NODE_ENV,
      // STYLE_MODE: process.env.STYLE_MODE,
    }),
  ]),
  ignore: ['src/core/**/index.js'],
  styleguideDir: 'docs/',
  // components: 'src/core/**/**.js',
  require: [
    path.join(__dirname, 'style/default.scss')
  ],
  // theme: {
  //   color: {
  //     sidebarBackground: '#34465d',
  //     link: '#cfdfec'
  //   }
  // },
  styles: {
    StyleGuide: {
      sidebar: {
        backgroundColor: '#34465d',
      },
    },
    Logo: {
      logo: {
        color: '#FFF'
      }
    },
    Link: {
      link: {
        color: [['#cfdfec'], '!important']
      }
    },
  },
  sections: [
    {
      name: 'UI Components',
      // content: 'docs/components.md',
      components: 'src/core/**/*.js',
      exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse' // 'hide' | 'collapse' | 'expand'
    },
    {
      name: '配置',
      content: 'docs/configuration.md'
    },
    {
      name: 'UI-logic',
      content: 'docs/ui-logic.md'
    },
    {
      name: 'Ukelli UI 引用说明',
      content: 'docs/import-desc.md'
    },
    {
      name: '三方库引用说明',
      content: 'docs/third-party-lib-desc.md'
    },
    {
      name: 'Update log',
      content: 'docs/update-logs.md'
    },
  ],
  // skipComponentsWithoutExample: true,
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
        }
      ]
    }
  }
}