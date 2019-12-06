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
  /** 激活指示器与外层容器的间距 */
  offset?: number;
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
    offset: 1,
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

  renderIndicator = () => {
    const { activeIdx, offset = 1 } = this.props;
    const activeDOM = this._refs[activeIdx];

    return activeDOM && (
      <span
        className="indicator"
        style={{
          transform: `translateX(${activeDOM.offsetLeft}px)`,
          left: offset,
          top: offset,
          height: activeDOM.offsetHeight - offset * 2,
          width: activeDOM.offsetWidth - offset * 2
        }}
      />
    );
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
          }}
        >
          {btnText}
        </span>
      );
    });

    const switchBtnGroup = (
      <span className="switch-btn-group">
        {btnGroup}
        {this.renderIndicator()}
      </span>
    );
    return switchBtnGroup;
  }
}
