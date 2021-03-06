import { IsFunc } from '@mini-code/base-func';
import { ApiRename } from ".";

import chKeyMapper from './i18n/zh-CN';
import enKeyMapper from './i18n/en-US';
import { defaultIconMapper } from './icon-mapper';

export interface UILangStructure {
  [lang: string]: {
    [translateKey: string]: string;
  };
}

export interface UIConfigStruct {
  iconMapper: {};
  iconPrefix: (str: string) => string;
}

const defaultLanguage = 'zh-CN';

const internalLangConfig: UILangStructure = {
  'zh-CN': chKeyMapper,
  'en-US': enKeyMapper,
};
const translateMapper: UILangStructure = {
  'zh-CN': {},
  'en-US': {},
};

let language = defaultLanguage;

const UIConfig: UIConfigStruct = {
  iconMapper: {},
  iconPrefix: (s) => `fa${s} fa-`,
};

/**
 * 兼容旧版本的设置
 */
Object.defineProperties(UIConfig, {
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
const $T_IN = _translate(internalLangConfig);

/**
 * 外部内容翻译接口
 * @param {string} key 需要翻译的内容
 */
const $T = _translate(translateMapper);

function setUkeLang(lang: string) {
  ApiRename('setUkeLang', 'setUILang');
  setUILang(lang);
}

function setUILang(lang: string) {
  language = lang;
}

function setUkeLangConfig(config: UILangStructure) {
  ApiRename('setUkeLangConfig', 'setUILangConfig');
  setUILangConfig(config);
}

/**
 * 设置内部语言配置
 * @param {UILangStructure} config
 */
function setUILangConfig(config: UILangStructure) {
  Object.assign(internalLangConfig, config);
}

/**
 * 设置外部翻译数据
 * @param {object} nextTranslate 翻译的内容
 */
function setLangTranslate(nextTranslate) {
  Object.keys(translateMapper).forEach((lang) => {
    translateMapper[lang] = Object.assign({}, translateMapper[lang], nextTranslate[lang]);
  });
}

function setUkelliConfig(config: typeof UIConfig) {
  ApiRename('setUkelliConfig', 'setUIConfig');
  return setUIConfig(config);
}

/**
 * 设置 ui 配置
 * @param {UIConfig} config ui 的配置
 */
function setUIConfig(config: typeof UIConfig) {
  Object.assign(UIConfig, config);
  return UIConfig;
}

export function getIsMobile() {
  return /iPhone|Android|iOS/.test(navigator.userAgent);
}

function getUkelliConfig(configKey: string) {
  ApiRename('setUkelliConfig', 'setUIConfig');
  return getUIConfig(configKey);
}

/**
 * 获取 ui 配置
 * @param {string} configKey 配置的 key
 */
function getUIConfig(configKey: string) {
  const _config = { ...UIConfig };
  return configKey ? (_config[configKey] || false) : _config;
}

function getIconMapper() {
  return { ...defaultIconMapper, ...UIConfig.iconMapper };
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
  const iconPrefix = getUIConfig('iconPrefix');
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
  $T_IN,
  /** 需要废弃的接口 start */
  getUkelliConfig,
  setUkelliConfig,
  setUkeLang,
  setUkeLangConfig,
  /** 需要废弃的接口 end */
  getUIConfig,
  setUIConfig,
  getIcon,
  setUILang,
  setLangTranslate,
  setUILangConfig,
};
