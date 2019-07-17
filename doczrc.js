// import doczPluginNetlify from "docz-plugin-netlify";
import { css } from 'docz-plugin-css';
import themeConfig from './docz/theme-config/config';

export default {
  // dest: 'docz-dist',
  title: 'Ukelli-UI',
  description: 'Ukelli-UI Lib, 轻量级 React UI 框架',
  notUseSpecifiers: true,
  filterComponents: (files) =>
    files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath)),
  indexHtml: 'docz/index.html',
  wrapper: 'docz/wrapper',
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
    'Getting Started / 开始',
    'Style / 样式',
    'Layout / 布局',
    'Utils / 效率',
    'Config / 配置',
    'Components / 组件',
    'Selector / 选择器',
    'Form / 表单',
    'FormGenerator / 表单生成',
    'Table / 表格渲染',
    'Other / 其他组件',
    'More',
  ],
  // modifyBundlerConfig: (config) => {
  //   config.resolve.extensions.push('.scss');
  //   config.module.rules.push({
  //     test: /\.scss$/,
  //     use: ["style-loader", "css-loader", "sass-loader"]
  //   });
  //   return config;
  // },
  plugins: [
    // doczPluginNetlify(),
    css({
      preprocessor: 'sass',
    })
  ]
};
