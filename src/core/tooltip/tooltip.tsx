import React, { PureComponent } from 'react';
import { Call, DebounceClass } from 'basic-helper';

import { PopoverEntity } from '../popover';
import { Icon } from '../icon';
import { $T } from '../config';
import { Color } from '../utils/props';

import { IconProps } from '../icon/icon';

export interface ToolTipProps extends IconProps {
  /** 提示的标题 */
  title?: any;
  /** 颜色 */
  color?: Color;
  /** 传入 children 的 classNames */
  classNames?: string[];
  /** 点击即关闭弹出曾 */
  clickToClose?: boolean;
  /** 包裹的组件 */
  component?: React.ElementType;
  /** 弹出的位置 */
  position?: 'bottom'|'top'|'right'|'left';
  /** 点击的回调 */
  onClick?: Function;
}

const debounce = new DebounceClass();

const Popover = new PopoverEntity({
  id: 'iconPopover',
  fixed: true
});

const TitleDOM = ({ title }) => {
  const isArr = Array.isArray(title);
  const titleDOM = isArr ? title.map((text, idx) => (
    <p key={text}>{idx + 1}. {$T(text)}</p>
  )) : $T(title);
  return (
    <div style={{ padding: '5px 10px' }}>{titleDOM}</div>
  );
};

const Div = ({ classNames, ...props }) => (
  <span {...props} />
);

/**
 * 提供简单的提示按钮
 *
 * @export
 * @class ToolTip
 * @extends {PureComponent}
 */
export default class ToolTip extends PureComponent<ToolTipProps> {
  static defaultProps = {
    position: 'bottom',
    classNames: []
  }

  componentWillUnmount = () => {
    setTimeout(() => Popover.close(), 10);
  }

  render() {
    const {
      title, clickToClose, onClick, position, component,
      children, color = 'black', classNames = [], ...other
    } = this.props;
    const Com = children ? Div : component || Icon;
    return (
      <Com
        {...other}
        onMouseEnter={(e) => {
          Popover.show({
            elem: e.target,
            props: {
              position,
              showCloseBtn: false,
              enableTabIndex: false,
              className: 'icon-tip',
              type: color
            },
            children: <TitleDOM title={title}/>,
          });
        }}
        onMouseLeave={(e) => {
          Popover.close();
        }}
        onClick={(e) => {
          Call(onClick, e);
          if (clickToClose) return Popover.close();
          debounce.exec(() => {
            Popover.show({
              children: <TitleDOM title={title}/>,
            });
          }, 15);
        }}
        classNames={[...classNames, 'relative']}>
        {children}
      </Com>
    );
  }
}
