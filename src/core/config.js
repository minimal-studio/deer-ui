import {defineGlobalScope} from 'basic-helper';
import chKeyMapper from '../i18n/zh-CN';
import enKeyMapper from '../i18n/en-US';

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
