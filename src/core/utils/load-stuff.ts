/* eslint-disable no-param-reassign */

import { Call } from 'basic-helper';

interface LoadParams {
  src: string;
  onload?: (loadedEvent) => void;
}

interface LoadStuffParams extends LoadParams {
  type: string;
}

/**
 * 加载外部资源
 */
export function LoadStuff(params: LoadStuffParams) {
  const { src, onload, type } = params;
  return new Promise((resolve, reject) => {
    let reloadTimes = 0;

    const loadUrl = src;

    function load(element: HTMLLinkElement | HTMLScriptElement) {
      if (reloadTimes > 2) return;
      reloadTimes++;
      element.onload = (...arg) => {
        Call(onload, ...arg);
        resolve(...arg);
      };
      /** 如果加载失败，尝试继续加载 */
      element.onerror = () => load(element);
      document.body.appendChild(element);
    }

    switch (type) {
      case 'css':
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = loadUrl;
        load(link);
        break;
      case 'script':
        const script = document.createElement('script');
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
 * @param {object} options { src: string, onload: func }
 */
export function LoadLink(options: LoadParams) {
  const _options = Object.assign({}, options, {
    type: 'css'
  });
  return LoadStuff(_options);
}

/**
 * 加载 script
 *
 * @param {object} options { src: string, onload: func }
 */
export function LoadScript(options: LoadParams) {
  const _options = Object.assign({}, options, {
    type: 'script'
  });
  return LoadStuff(_options);
}
