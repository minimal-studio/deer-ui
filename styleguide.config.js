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
      STYLE_MODE: process.env.STYLE_MODE,
    }),
  ]),
  styleguideDir: 'docs/',
  // components: 'src/core/**/**.js',
  require: [
    path.join(__dirname, 'style/default.scss')
  ],
  // theme: {
  //   sidebarBackground: '#34465d',
  // },
  styles: {
    StyleGuide: {
      sidebar: {
        // backgroundColor: '#34465d',
      }
    },
    ComponentsListRenderer: {
      item: {
        // color: '#cfdfec'
      }
    }
  },
  sections: [
    {
      name: 'UI Components',
      // content: 'docs/components.md',
      components: 'src/core/**/*.js',
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
      usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
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
      // scripts: [
      //   {
      //     src: 'assets/js/babelHelpers.min.js'
      //   }
      // ],
      links: [
        {
          rel: 'stylesheet',
          // href: 'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
        }
      ]
    }
  }
}