import { defineGlobalScope, IsFunc, Call } from 'basic-helper';
import chKeyMapper from '../i18n/zh-CN';
import enKeyMapper from '../i18n/en-US';
import defaultIconMapper from './icon-mapper';

const langConfig = {
  'zh-CN': chKeyMapper,
  'en-US': enKeyMapper,
};
const defaultLanguage = 'zh-CN';

let language = defaultLanguage;

const ukelliui = {
  getImage(...args) {
    return args.join('/');
  },
  getKeyMap(key) {
    return key;
  },
  getUkeKeyMap(key) {
    const keyMapper = langConfig[language] || langConfig[defaultLanguage];
    return keyMapper[key] || key;
  },
  queryCAPTCHAData() {},
  queryQRCodeData() {},
  avatarImgMap: '',
  iconMapper: {},
  iconPrefix: (s) => `fa${s} fa-`,
};

export function getIconMapper() {
  return Object.assign({}, defaultIconMapper, ukelliui.iconMapper);
}

export function getIcon(iconName, iconStyle, moreClassName, useIconConfig) {
  const iconMapper = getIconMapper();
  const iconPrefix = getUkelliConfig('iconPrefix');
  if(!iconName) return iconMapper;
  let moreClassNameArr = Array.isArray(moreClassName) ? moreClassName : [moreClassName];
  let resultStr = (useIconConfig ? (IsFunc(iconPrefix) ? iconPrefix(iconStyle) : iconPrefix) : '') + (iconMapper[iconName] || iconName) + ' ' + moreClassNameArr.join(' ');
  return resultStr;
}

export function LoadStuff({src, onload, type}) {
  return new Promise((resolve, reject) => {
    let times = 0;

    let loadUrl = src;
  
    function load(element) {
      if (times > 2) return 0;
      times++;
      element.onload = function() {
        Call(onload, ...arguments);
        resolve(...arguments);
      };
      element.onerror = load;
      document.body.appendChild(element);
    }
  
    switch (type) {
    case 'css':
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = loadUrl;
      load(link);
      break;
    case 'script':
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = loadUrl;
      load(script);
      break;
    }
  });
}

/**
 * 加载 link
 *
 * @export
 * @param {object} options { src: string, onload: func }
 * @returns
 */
export function LoadLink(options) {
  options.type = 'css';
  return LoadStuff(options);
}

/**
 * 加载 script
 *
 * @export
 * @param {object} options { src: string, onload: func }
 * @returns
 */
export function LoadScript(options) {
  options.type = 'script';
  return LoadStuff(options);
}

export function setUkeLang(lang) {
  language = lang;
}

export function setUkeLangConfig(config) {
  Object.assign(langConfig, config);
}

export function setUkelliConfig(config) {
  Object.assign(ukelliui, config);
  window.$UKE && window.$UKE.registe(config);
  return ukelliui;
}

export function getUkelliConfig(name) {
  let _ukelliui = Object.assign({}, ukelliui);
  return name ? (_ukelliui[name] || false) : _ukelliui;
}

defineGlobalScope('$UKE', ukelliui);
