import { PopoverEntity } from './popover-entity';

/** 在服务端渲染不能初始化 PopoverEntity */
const GlobalPopover = new PopoverEntity();
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
