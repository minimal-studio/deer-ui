import {defineGlobalScope, IsFunc} from 'basic-helper';
import chKeyMapper from '../i18n/zh-CN';
import enKeyMapper from '../i18n/en-US';
import defaultIconMapper from './icon-mapper';

let langConfig = {
  'zh-CN': chKeyMapper,
  'en-US': enKeyMapper,
}
let defaultLanguage = 'zh-CN';
let language = defaultLanguage;

let ukelliui = {
  getImage() {},
  getKeyMap(key) {
    return key;
  },
  getUkeKeyMap(key) {
    let keyMapper = langConfig[language] || langConfig[defaultLanguage];
    return keyMapper[key] || key;
  },
  queryCAPTCHAData() {},
  queryQRCodeData() {},
  avatarImgMap: '',
  iconMapper: {},
  iconPrefix: 'fa fa-'
}

export function getIconMapper() {
  return Object.assign({}, defaultIconMapper, ukelliui.iconMapper);
}

export function getIcon(iconName, moreClassName) {
  const iconMapper = getIconMapper();
  const iconPrefix = getUkelliConfig('iconPrefix');
  if(!iconName) return iconMapper;
  let moreClassNameArr = Array.isArray(moreClassName) ? moreClassName : [moreClassName];
  let resultStr = iconPrefix + (iconMapper[iconName] || iconName) + ' ' + moreClassNameArr.join(' ');
  return resultStr;
}

export function LoadStuff({src, onload, type}) {
  var times = 0;

  var loadUrl = src;

  function load(element) {
    if (times > 2) return 0;
    times++;
    element.onload = onload;
    element.onerror = load;
    document.body.appendChild(element);
  };

  switch (type) {
    case 'css':
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = loadUrl;
      load(link);
      break;
    case 'script':
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = loadUrl;
      load(script);
      break;
  }
}
export function LoadLink(options) {
  options.type = 'css';
  return LoadStuff(options);
}
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
  return ukelliui;
}

export function getUkelliConfig(name) {
  let _ukelliui = Object.assign({}, ukelliui);
  return name ? (_ukelliui[name] || false) : _ukelliui;
}

defineGlobalScope('$UKE', ukelliui);
