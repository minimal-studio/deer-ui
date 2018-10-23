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
    /** 是否禁用 */
    disabled: PropTypes.bool,
    /** 当前激活的 index */
    activeIdx: PropTypes.any.isRequired,
    /** 值改变的回调 */
    onSwitch: PropTypes.func.isRequired
  };
  static defaultProps = {
    unique: true
  }
  constructor(props) {
    super(props);
    this.value = props.activeIdx;
  }
  render() {
    const {btns, activeIdx, disabled = false, unique, onSwitch} = this.props;

    const switchBtnGroup = (
      <div className="switch-btn-group layout j-c-b">
        {Object.keys(btns).map((btnKey, idx) => {
          let btnText = btns[btnKey].text || btns[btnKey];
          let isActive = btnKey === activeIdx && !disabled;
          return (
            <span
              disabled={disabled}
              key={idx}
              className={isActive ? 'switch-btn active' : 'switch-btn'}
              onClick={e => {
                if((!unique || activeIdx !== btnKey) && !disabled) {
                  this.value = btnKey;
                  onSwitch(btnKey, isActive);
                }
              }}>{btnText}
            </span>
          );
        })}
      </div>
    );
    return switchBtnGroup;
  }
}
