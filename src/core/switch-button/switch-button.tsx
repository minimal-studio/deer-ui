import React, { PureComponent } from 'react';
import classnames from 'classnames';

export interface SwitchButtonProps {
  /** 按钮的配置 */
  btns: {
    [btnKey: string]: string;
  };
  /** 当前激活的 index */
  activeIdx: string | number;
  /** 值改变的回调 */
  onSwitch: (val, isActive: boolean) => void;
  /** 是否只有唯一值 */
  unique?: boolean;
  /** 是否输出数字 */
  isNum?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 单选集合的模版
 *
 * @export
 * @class SwitchButton
 * @extends {PureComponent}
 */
export default class SwitchButton extends PureComponent<SwitchButtonProps> {
  static defaultProps = {
    unique: true,
    disabled: false,
    isNum: false,
  }

  value

  _refs = {};

  constructor(props) {
    super(props);
    this.value = props.activeIdx;
  }

  componentDidMount() {
    /** 为了让指示器初始化显示宽度 */
    this.forceUpdate();
  }

  render() {
    const {
      btns, activeIdx, disabled, unique, isNum,
      onSwitch
    } = this.props;

    const btnsArr = Object.keys(btns);

    const btnGroup = btnsArr.map((btnKey, idx) => {
      const btnText = btns[btnKey];
      const isActive = btnKey.toString() === activeIdx.toString();
      return (
        <span
          key={btnText}
          ref={(e) => { this._refs[btnKey] = e; }}
          className={`switch-btn${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`}
          onClick={(e) => {
            if ((!unique || activeIdx != btnKey) && !disabled) {
              const _btnKey = isNum ? +btnKey : btnKey;
              this.value = btnKey;
              onSwitch(_btnKey, isActive);
            }
          }}>
          {btnText}
        </span>
      );
    });
    const activeDOM = this._refs[activeIdx] || {};

    const switchBtnGroup = (
      <span className="switch-btn-group">
        {btnGroup}
        <span className="indicator" style={{
          transform: `translateX(${activeDOM.offsetLeft}px)`,
          width: activeDOM.offsetWidth
        }} />
      </span>
    );
    return switchBtnGroup;
  }
}
