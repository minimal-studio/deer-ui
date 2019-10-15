import { defineGlobalScope } from 'basic-helper/registe-global-funcs';
import { IsFunc } from 'basic-helper';
import chKeyMapper from '../i18n/zh-CN';
import enKeyMapper from '../i18n/en-US';
import defaultIconMapper from './icon-mapper';

export interface UkeLangStruct {
  [lang: string]: {
    [translateKey: string]: string;
  };
}

export interface UkelliUIConfig {
  iconMapper: {};
  iconPrefix: (str: string) => string;
}

const defaultLanguage = 'zh-CN';

const ukeLangConfig: UkeLangStruct = {
  'zh-CN': chKeyMapper,
  'en-US': enKeyMapper,
};
const translateMapper: UkeLangStruct = {
  'zh-CN': {},
  'en-US': {},
};

let language = defaultLanguage;

const ukelliui: UkelliUIConfig = {
  iconMapper: {},
  iconPrefix: s => `fa${s} fa-`,
};

/**
 * 兼容旧版本的设置
 */
Object.defineProperties(ukelliui, {
  queryCAPTCHAData: {
    set() {
      console.warn('queryCAPTCHAData 已废弃，请使用 Captcha.setAPI');
    }
  },
  queryQRCodeData: {
    set() {
      console.warn('queryQRCodeData 已废弃，请使用 QRCode.setAPI');
    }
  },
});

function _translate(langConfig) {
  return (key): string => {
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

function setUkeLang(lang: string) {
  language = lang;
}

/**
 * 设置 uke 内部语言配置
 * @param {UkeLangStruct} config
 */
function setUkeLangConfig(config: UkeLangStruct) {
  Object.assign(ukeLangConfig, config);
}

/**
 * 设置外部翻译数据
 * @param {object} nextTranslate 翻译的内容
 */
function setLangTranslate(nextTranslate) {
  Object.assign(translateMapper, nextTranslate);
  window.$UKE && window.$UKE.registe({
    $T, $T_UKE, translateMapper
  });
}

/**
 * 设置 ukelli ui 配置
 * @param {ukelliui} config ukelli ui 的配置
 */
function setUkelliConfig(config: typeof ukelliui) {
  Object.assign(ukelliui, config);
  window.$UKE && window.$UKE.registe(config);
  return ukelliui;
}

export function getIsMobile() {
  return /iPhone|Android|iOS/.test(navigator.userAgent);
}

/**
 * 获取 ukelli ui 配置
 * @param {string} configKey 配置的 key
 */
function getUkelliConfig(configKey: string) {
  const _ukelliui = Object.assign({}, ukelliui);
  return configKey ? (_ukelliui[configKey] || false) : _ukelliui;
}

function getIconMapper() {
  return Object.assign({}, defaultIconMapper, ukelliui.iconMapper);
}

/**
 * 合并参数，返回 icon 的 className
 * @param {string} iconName icon 对应的名字
 * @param {string}  iconStyle 对应的 style
 * @param {string[] | string} mergeClassNames 需要合并的 classNames
 * @param {boolean} useIconConfig 是否使用内置的配置
 */
function getIcon(iconName, iconStyle, mergeClassNames, useIconConfig = true) {
  const iconMapper = getIconMapper();
  const iconPrefix = getUkelliConfig('iconPrefix');
  if (!iconName) return iconName;
  const moreClassNameArr = Array.isArray(mergeClassNames) ? mergeClassNames : [mergeClassNames];
  let resultStr = '';
  if (useIconConfig) {
    resultStr = (IsFunc(iconPrefix) ? iconPrefix(iconStyle) : iconPrefix);
  }
  resultStr = `${resultStr + (iconMapper[iconName] || iconName)} ${moreClassNameArr.join(' ')}`;
  return resultStr;
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
