import doczPluginNetlify from "docz-plugin-netlify";
import { css } from 'docz-plugin-css';
import path from 'path';
import themeConfig from './docz/theme-config/config';

export default {
  // dest: 'docz-dist',
  title: 'Ukelli-UI',
  description: 'Ukelli-UI, 轻量级 React UI 框架',
  notUseSpecifiers: true,
  filterComponents: files => files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath)),
  indexHtml: 'docz/index.html',
  wrapper: 'docz/wrapper',
  public: path.resolve(__dirname, './website/static'),
  // theme: path.resolve(__dirname, './docz/theme/theme.tsx'),
  codeSandbox: false,
  hashRouter: true,
  typescript: true,
  files: '**/*.mdx',
  htmlContext: {
    head: {
      links: [{
        rel: 'stylesheet',
        // href: 'https://codemirror.net/theme/dracula.css'
        href: 'https://codemirror.net/theme/mdn-like.css'
      }],
    },
  },
  themeConfig,
  menu: [
    'Getting Started',
    'Style',
    'Layout',
    'Utils',
    'Components',
    'Selector',
    'Form',
    'FormGenerator',
    'Data Display',
    'Other',
    'Config',
    'More',
  ],
  plugins: [
    doczPluginNetlify(),
    css({
      preprocessor: 'sass',
    })
  ]
};
