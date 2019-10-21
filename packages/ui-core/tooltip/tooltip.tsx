import React, { PureComponent } from 'react';
import { Call, DebounceClass, UUID } from 'basic-helper';

import { PopoverEntity } from '../popover/popover-entity';
import { Icon } from '../icon';
import { $T } from '../config';
import { Color, Children } from '../utils/props';

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
}

const debounce = new DebounceClass();

const TitleDOM = ({ title }) => {
  const isArr = Array.isArray(title);
  const titleDOM = isArr ? title.map((text, idx) => (
    <p key={text}>{idx + 1}. {$T(text)}</p>
  )) : $T(title);
  return (
    <div style={{ padding: '5px 10px' }}>{titleDOM}</div>
  );
};

const Div = ({
  classNames, children, n, ...props
}) => (
  <span {...props}>
    <Icon n={n} />
    {children}
  </span>
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

  Popover!: PopoverEntity

  // constructor(props) {
  //   super(props);
  // }

  componentWillUnmount = () => {
    if (this.Popover) this.Popover.destroy();
  }

  newPopover = () => {
    if (!this.Popover) {
      this.Popover = new PopoverEntity({
        id: UUID(),
        fixed: true
      });
    }
    return this.Popover;
  }

  handleMouseEnter = (e) => {
    const _popover = this.newPopover();
    const {
      title, position, color = 'black'
    } = this.props;
    _popover.show({
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
  }

  handleMouseLeave = (e) => {
    this.Popover.close();
  }

  handleClick = (e) => {
    const {
      clickToClose, onClick
    } = this.props;
    Call(onClick, e);
    if (clickToClose) {
      this.Popover && this.Popover.close();
    } else {
      debounce.exec(() => {
        const { title } = this.props;
        this.Popover && this.Popover.show({
          children: <TitleDOM title={title}/>,
        });
      }, 15);
    }
  }

  render() {
    const {
      title, clickToClose, onClick, position, component,
      children, classNames = [], ...other
    } = this.props;
    // const Com = component;
    const Com = children ? Div : component || Icon;
    return (
      <Com
        {...other}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        classNames={[...classNames, 'relative']}>
        {children}
      </Com>
    );
  }
}
