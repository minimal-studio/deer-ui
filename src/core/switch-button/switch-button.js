import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class SwitchButton extends PureComponent {
  static propTypes = {
    btns: PropTypes.object.isRequired,
    unique: PropTypes.bool,
    disabled: PropTypes.bool,
    activeIdx: PropTypes.any.isRequired,
    onSwitch: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.value = props.activeIdx;
  }
  render() {
    const {btns, activeIdx, disabled = false, unique = true, onSwitch} = this.props;

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
