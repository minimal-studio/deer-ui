const path = require('path');
const webpack = require('webpack');
const {
  createConfig, babel, postcss, sass, setEnv,
  env, devServer, sourceMaps, uglify, addPlugins
} = require('webpack-blocks');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');

const {
  generateCSSReferences,
} = MiniHtmlWebpackPlugin;

function generateJSReferences(files = [], publicPath = '', attrMapper) {
  return files
    .map(file => `<script src="${publicPath}${file}" ${attrMapper[file]}></script>`)
    .join('');
}

module.exports = {
  webpackConfig: createConfig([
    babel(), postcss(), sass(),
    setEnv({
      NODE_ENV: process.env.NODE_ENV,
      // STYLE_MODE: process.env.STYLE_MODE,
    }),
    env('development', [
      devServer(),
      // devServer.proxy({
      //   '/api': { target: 'http://localhost:3000' }
      // }),
      sourceMaps()
    ]),
    env('production', [
      uglify(),
      addPlugins([
        new webpack.LoaderOptionsPlugin({ minimize: true })
      ])
    ]),
  ]),
  ignore: ['src/core/**/index.js'],
  styleguideDir: 'docs/',
  // components: 'src/core/**/**.js',
  require: [
    path.join(__dirname, 'style/default.scss'),
    path.join(__dirname, 'styleguide/style.scss'),
  ],
  // styles: {
  //   StyleGuide: {
  //     sidebar: {
  //       backgroundColor: '#313b48',
  //     },
  //   },
  //   Logo: {
  //     logo: {
  //       color: '#FFF',
  //       borderBottom: 0,
  //     }
  //   },
  //   Link: {
  //     link: {
  //       color: [['#cfdfec'], '!important']
  //     }
  //   },
  // },
  sections: [
    {
      content: 'docs/ref.md'
    },
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
    // {
    //   name: 'Ukelli UI 引用说明',
    //   content: 'docs/import-desc.md'
    // },
    {
      name: '三方库引用说明',
      content: 'docs/third-party-lib-desc.md'
    },
    {
      name: 'Update log',
      content: 'docs/update-logs.md'
    },
  ],
  skipComponentsWithoutExample: true,
  // template: {
  //   head: {
  //     links: [
  //       {
  //         rel: 'stylesheet',
  //         href: 'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
  //       }
  //     ]
  //   }
  // }
  template: ({ css, js, title, publicPath }) => {
    return `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          ${generateCSSReferences(css, publicPath)}
          <link rel="stylesheet" href="./resource/loading.css">
        </head>
        <body>
          <div id="rsg-root"></div>
          <div class="sk-folding-cube" id="loadingBg">
            <div class="sk-cube1 sk-cube"></div>
            <div class="sk-cube2 sk-cube"></div>
            <div class="sk-cube4 sk-cube"></div>
            <div class="sk-cube3 sk-cube"></div>
          </div>
          <script>
          window.__removeLoading = function() {
            document.body.removeChild(document.querySelector('#loadingBg'))
          }
          </script>
          ${generateJSReferences(js, publicPath, {
            'build/main.bundle.js': 'onload="window.__removeLoading()"'
          })}
        </body>
      </html>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.5.1/themes/material_red.css" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
    `;
  }
};