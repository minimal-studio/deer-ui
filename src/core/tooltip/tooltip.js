import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, DebounceClass } from 'basic-helper';

import { PopoverEntity } from '../popover';
import { Icon } from '../icon';

const debounce = new DebounceClass();

const Popover = new PopoverEntity({
  id: 'iconPopover',
  fixed: true
});

const TitleDOM = ({ title }) => {
  const isArr = Array.isArray(title);
  const titleDOM = isArr ? title.map((text, idx) => {
    return (
      <p key={text}>{idx + 1}. {text}</p>
    );
  }) : title;
  return (
    <div style={{padding: '5px 10px'}}>{titleDOM}</div>
  );
};

const Div = ({classNames, ...props}) => (
  <div {...props} />
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
    /** 点击即关闭弹出曾 */
    clickToClose: PropTypes.bool,
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
    position: 'bottom'
  }
  render() {
    const { title, clickToClose, onClick, position, component, children, ...other } = this.props;
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
              type: 'black'
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
              children: <TitleDOM title={this.props.title}/>,
            });
          }, 15);
        }}
        classNames={['relative']}>
        {children}
      </Com>
    );
  }
}
