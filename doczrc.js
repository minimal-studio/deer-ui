import doczPluginNetlify from "docz-plugin-netlify";

export default {
  // dest: 'docz-dist',
  title: 'Ukelli-UI',
  description: 'Ukelli-UI Lib',
  indexHtml: 'docz/index.html',
  wrapper: 'docz/wrapper',
  codeSandbox: false,
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