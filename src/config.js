import {defineGlobalObj} from 'basic-helper';

let ukelliui = {
  getIcon() {},
  getImage() {},
  getKeyMap() {},
  queryCAPTCHAData() {},
  queryQRCodeData() {},
  avatarImgMap: '',
}

export function setUkelliConfig(config) {
  Object.assign(ukelliui, config);
  return ukelliui;
}

export function getUkelliConfig(name) {
  let _ukelliui = Object.assign({}, ukelliui);
  return name ? (_ukelliui[name] || false) : _ukelliui;
}

defineGlobalObj('$UK', ukelliui);
