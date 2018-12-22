import doczPluginNetlify from "docz-plugin-netlify";

import themeConfig from './docz/theme-config/config';

export default {
  // dest: 'docz-dist',
  title: 'Ukelli-UI',
  // files: '**/*.{md,markdown,mdx}',
  description: 'Ukelli-UI Lib, 轻量级 React UI 框架，简约而不简单',
  indexHtml: 'docz/index.html',
  wrapper: 'docz/wrapper',
  // theme: 'docz/theme/index.tsx',
  codeSandbox: false,
  hashRouter: true,
  // propsParser: false,
  htmlContext: {
    head: {
      links: [{
        rel: 'stylesheet',
        // href: 'https://codemirror.net/theme/dracula.css'
        href: 'https://codemirror.net/theme/mdn-like.css'
      }]
    }
  },
  themeConfig: themeConfig,
  menu: [
    'Getting Started',
    'Style',
    'Layout',
    'Utils',
    'Components / 组件',
    'Selector / 选择器',
    'Form / 表单',
    'FormGenerator / 表单生成',
    'Table / 表格渲染',
    'More',
  ],
  modifyBundlerConfig: (config) => {
    config.resolve.extensions.push('.scss');
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"]
    });
    return config;
  },
  plugins: [doczPluginNetlify()]
};