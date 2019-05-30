import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, DebounceClass } from 'basic-helper';

import { PopoverEntity } from '../popover';
import { Icon } from '../icon';
import { $T } from '../config';

const debounce = new DebounceClass();

const Popover = new PopoverEntity({
  id: 'iconPopover',
  fixed: true
});

const TitleDOM = ({ title }) => {
  const isArr = Array.isArray(title);
  const titleDOM = isArr ? title.map((text, idx) => {
    return (
      <p key={text}>{idx + 1}. {$T(text)}</p>
    );
  }) : $T(title);
  return (
    <div style={{padding: '5px 10px'}}>{titleDOM}</div>
  );
};

const Div = ({classNames, ...props}) => (
  <span {...props} />
);

/**
 * 提供简单的提示按钮, 其余 props 都会传入到 icon 组件
 *
 * @export
 * @class ToolTip
 * @extends {PureComponent}
 */
export default class ToolTip extends PureComponent {
  static propTypes = {
    /** 提示的标题 */
    title: PropTypes.any,
    /** 颜色 */
    color: PropTypes.string,
    /** 传入 children 的 classNames */
    classNames: PropTypes.arrayOf(PropTypes.string),
    /** 点击即关闭弹出曾 */
    clickToClose: PropTypes.bool,
    /** 包裹的组件 */
    component: PropTypes.any,
    /** 弹出的位置 */
    position: PropTypes.oneOf([
      'bottom',
      'top',
      'right',
      'left',
    ]),
    /** 点击的回调 */
    onClick: PropTypes.func,
  }
  static defaultProps = {
    position: 'bottom',
    classNames: []
  }
  componentWillUnmount() {
    setTimeout(() => Popover.close(), 10);
  }
  render() {
    const {
      title, clickToClose, onClick, position, component,
      children, color = 'black', classNames, ...other
    } = this.props;
    const Com = children ? Div : component ? component : Icon;
    return (
      <Com
        {...other}
        onMouseEnter={e => {
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
        onMouseLeave={e => {
          Popover.close();
        }}
        onClick={e => {
          Call(onClick, e);
          if(clickToClose) return Popover.close();
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
