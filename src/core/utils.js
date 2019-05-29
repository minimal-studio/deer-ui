
import { Call } from 'basic-helper';

export function getScreenWidth() {
  return document.documentElement.clientWidth;
}
export function getScreenHeight() {
  return document.documentElement.clientHeight;
}

/** 如果 body 为 overflow: hidden, 则忽略 scrollTop */
export function getScrollTop(elem) {
  if(!elem && getComputedStyle(document.body).overflow === 'hidden') {
    return 0;
  }
  const _elem = elem || document.documentElement;
  return _elem.scrollTop;
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