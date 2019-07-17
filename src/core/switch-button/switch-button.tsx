import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

/**
 * 单选集合的模版
 *
 * @export
 * @class SwitchButton
 * @extends {PureComponent}
 */
export default class SwitchButton extends PureComponent {
  static propTypes = {
    /** 按钮的配置 */
    btns: PropTypes.object.isRequired,
    /** 是否只有唯一值 */
    unique: PropTypes.bool,
    /** 是否输出数字 */
    isNum: PropTypes.bool,
    /** 是否禁用 */
    disabled: PropTypes.bool,
    /** 当前激活的 index */
    activeIdx: PropTypes.any.isRequired,
    /** 值改变的回调 */
    onSwitch: PropTypes.func.isRequired
  };
  static defaultProps = {
    unique: true,
    disabled: false,
    isNum: false,
  }
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
      const btnText = btns[btnKey].text || btns[btnKey];
      const isActive = btnKey == activeIdx;
      return (
        <span
          disabled={disabled}
          key={btnText}
          ref={e => this._refs[btnKey] = e}
          className={'switch-btn' + (isActive ? ' active' : '')}
          onClick={e => {
            if((!unique || activeIdx != btnKey) && !disabled) {
              this.value = btnKey;
              isNum ? btnKey = +btnKey : btnKey;
              onSwitch(btnKey, isActive);
            }
          }}>{btnText}
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
