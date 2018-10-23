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

const TitleDOM = ({title}) => {
  return (
    <div className="text-center p5">{title}</div>
  );
};

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
    title: PropTypes.string,
    /** 点击的回调 */
    onClick: PropTypes.func,
  }
  render() {
    const { title, onClick, ...other } = this.props;
    return (
      <Icon
        {...other}
        onMouseEnter={e => {
          Popover.show({
            position: 'bottom',
            elem: e.target,
            props: {
              showCloseBtn: false,
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
          debounce.exec(() => {
            Popover.setPopover({
              children: <TitleDOM title={this.props.title}/>,
            });
          }, 1);
        }}
        classNames={['relative']}/>
    );
  }
}
