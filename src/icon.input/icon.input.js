import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Input extends Component {
  constructor(props) {
    super(props);

    const {inputProps} = props;
    const {defaultValue, value} = inputProps;

    this.state = {
      showTitle: !!defaultValue || !!value,
      viewClass: 'normal',
    }
  }
  changeText(val) {
    this.setState({
      showTitle: !!val
    })
  }
  addForceClass() {
    this.setState({
      viewClass: 'forcing'
    });
  }
  delForceClass() {
    this.setState({
      viewClass: 'normal'
    });
  }
  focus() {
    this.refs.iconInput.focus();
  }
  select() {
    this.refs.iconInput.select();
  }
  render() {
    const {
      iconClassName = '', iconName, inputProps, inputBtnConfig} = this.props;
    const {showTitle, viewClass = ''} = this.state;

    const hasIcon = !!iconName;
    const IconClass = iconName;
    const {placeholder} = inputProps;

    const iconDOM = hasIcon ? (
      <span className="input-icon">
        <i className={$UK.getIcon(iconName, ['icon', iconClassName])}/>
      </span>
    ) : null;
    const titleDOM = (
      <span className="title"><span>{placeholder}</span></span>
    );
    const inputBtnDOM = inputBtnConfig ? (
      <span className={"input-btn btn flat " + inputBtnConfig.className} onClick={() => {inputBtnConfig.action(this.refs.iconInput)}}>{inputBtnConfig.text}</span>
    ) : null;

    return (
      <div className={`icon-input ${viewClass} ${hasIcon ? 'has-icon' : ''} ${showTitle ? 'show-title' : ''} ${inputBtnConfig ? 'has-btn' : ''}`}>
        {iconDOM}
        <div className="input-con">
          <span className="input-group">
            <input
              {...inputProps}
              onFocus={e => {
                this.addForceClass();
               $GH.CallFunc(inputProps.onFocus)(e);
              }}
              onBlur={e => {
                this.delForceClass();
               $GH.CallFunc(inputProps.onBlur)(e);
              }}
              onChange={e => {
                const val = e.target.value;
                this.changeText(val);
               $GH.CallFunc(inputProps.onChange)(e);
              }}
              ref="iconInput"
            />
            {titleDOM}
          </span>
          {inputBtnDOM}
        </div>
      </div>
    )
  }
}
Input.propTypes = {
  iconClassName: PropTypes.any,
  iconName: PropTypes.string,
  inputProps: PropTypes.object,
  inputBtnConfig: PropTypes.object,
}
