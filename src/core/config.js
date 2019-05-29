import { defineGlobalScope } from 'basic-helper/registe-global-funcs';
import { IsFunc } from 'basic-helper';
import chKeyMapper from '../i18n/zh-CN';
import enKeyMapper from '../i18n/en-US';
import defaultIconMapper from './icon-mapper';

const defaultLanguage = 'zh-CN';

let ukeLangConfig = {
  'zh-CN': chKeyMapper,
  'en-US': enKeyMapper,
};
let translateMapper = {
  'zh-CN': {},
  'en-US': {},
};

let language = defaultLanguage;

const ukelliui = {
  queryCAPTCHAData: null,
  queryQRCodeData() {},
  iconMapper: {},
  iconPrefix: (s) => `fa${s} fa-`,
};

function getIconMapper() {
  return Object.assign({}, defaultIconMapper, ukelliui.iconMapper);
}

function getIcon(iconName, iconStyle, moreClassName, useIconConfig) {
  const iconMapper = getIconMapper();
  const iconPrefix = getUkelliConfig('iconPrefix');
  if(!iconName) return iconMapper;
  let moreClassNameArr = Array.isArray(moreClassName) ? moreClassName : [moreClassName];
  let resultStr = (useIconConfig ? (IsFunc(iconPrefix) ? iconPrefix(iconStyle) : iconPrefix) : '') + (iconMapper[iconName] || iconName) + ' ' + moreClassNameArr.join(' ');
  return resultStr;
}

function _translate(langConfig) {
  return (key) => {
    const keyMapper = langConfig[language] || langConfig[defaultLanguage];
    return keyMapper[key] || key;
  };
}

/**
 * 内部翻译接口
 * @param {string} key 需要翻译的内容
 */
const $T_UKE = _translate(ukeLangConfig);

/**
 * 外部内容翻译接口
 * @param {string} key 需要翻译的内容
 */
const $T = _translate(translateMapper);

function setUkeLang(lang) {
  language = lang;
}

function setUkeLangConfig(config) {
  Object.assign(ukeLangConfig, config);
}

/** 
 * 设置外部翻译数据
 * @param {object} nextTranslate 翻译的内容
 */
function setLangTranslate(nextTranslate) {
  Object.assign(translateMapper, nextTranslate);
}

function setUkelliConfig(config) {
  Object.assign(ukelliui, config);
  window.$UKE && window.$UKE.registe(config);
  return ukelliui;
}

function getUkelliConfig(name) {
  let _ukelliui = Object.assign({}, ukelliui);
  return name ? (_ukelliui[name] || false) : _ukelliui;
}

export {
  $T,
  $T_UKE,
  getUkelliConfig,
  setUkelliConfig,
  getIcon,
  setUkeLang,
  setUkeLangConfig,
  setLangTranslate,
};

defineGlobalScope('$UKE', ukelliui);
