/* eslint-disable import/no-mutable-exports */
import { PopoverEntity, PopShowParams } from './popover-entity';

/** 在服务端渲染不初始化 PopoverEntity */
let _GlobalPopover;
const GlobalPopover = {};
Object.defineProperties(GlobalPopover, {
  show: {
    writable: false,
    value: (options: PopShowParams) => {
      if (!_GlobalPopover) {
        _GlobalPopover = new PopoverEntity();
      }
      _GlobalPopover.show(options);
    }
  },
  set: {
    writable: false,
    value: (options: PopShowParams) => {
      if (!_GlobalPopover) {
        _GlobalPopover = new PopoverEntity();
      }
      _GlobalPopover.set(options);
    }
  },
  close: {
    writable: false,
    value: () => {
      _GlobalPopover.close();
    }
  },
  destroy: {
    writable: false,
    value: () => {
      _GlobalPopover.destroy();
    }
  },
});

const Pop = GlobalPopover;

/**
 * 例子
 * GlobalPopover.setPopover({
 *   position, width = 400, onClose, elem, children, open, props = prevProps, id = 'topPopover'
 * })
 * id: 用于区分不同的 popover ，避免关闭错误
 */


export {
  Pop, GlobalPopover
};
