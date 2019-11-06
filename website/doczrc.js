// import doczPluginNetlify from "docz-plugin-netlify";
// import { css } from 'docz-plugin-css';
// import path from 'path';
// import themeConfig from './docz/theme-config/config';

export default {
  dest: '../public',
  typescript: true,
  title: 'Deer-UI',
  description: 'Deer-UI, 轻量级 React UI 框架',
  menu: [
    'Getting Started',
    'Style',
    'Layout',
    'Utils',
    'Components',
    'Selector',
    'Date Input',
    'Data Display',
    'Form Generator',
    'Enhance-UI',
    'Config',
    'More',
  ],
  // files: 'temp/**/*.mdx',
  files: 'src/pages/**/*.mdx',
  // notUseSpecifiers: true,
  // filterComponents: files => files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath)),
  // indexHtml: 'docz/index.html',
  // wrapper: 'docz/wrapper',
  // public: path.resolve(__dirname, './website/static'),
  // // theme: path.resolve(__dirname, './docz/theme/theme.tsx'),
  // codeSandbox: false,
  // hashRouter: true,
  // htmlContext: {
  //   head: {
  //     links: [{
  //       rel: 'stylesheet',
  //       // href: 'https://codemirror.net/theme/dracula.css'
  //       href: 'https://codemirror.net/theme/mdn-like.css'
  //     }],
  //   },
  // },
  // themeConfig,
  // plugins: [
  //   doczPluginNetlify(),
  //   css({
  //     preprocessor: 'sass',
  //   })
  // ]
};
