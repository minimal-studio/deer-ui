import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {CallFunc} from 'basic-helper';
import Icon from '../icon';

const ideaTipsGroup = [1, 5, 10, 100];

export default class MultipleHelper extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    inputable: PropTypes.bool,
    basicUnit: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    defaultValue: PropTypes.any,
    suffix: PropTypes.string,
    range: PropTypes.array
  };
  constructor(props) {
    super(props);
    const {range = ideaTipsGroup, defaultValue} = props;
    this.state = {
      isShowIdea: false,
      value: defaultValue || range[0]
    };
    this.defaultMax = 99999;
  }
  componentDidMount() {
    this.multipleHelper.defaultValue = '1';
  }
  multipleOperation(symbol) {
    const {basicUnit = 1} = this.props;
    const {value} = this.state;
    let _result = +value;
    switch (symbol) {
    case 'plus':
      _result += basicUnit;
      break;
    case 'less':
      _result -= basicUnit;
      break;
    }
    this.changeValue(_result);
  }
  changeValue(val) {
    const {onChange, min = 1, max = this.defaultMax} = this.props;
    let value = +(val) || 1;
    // if(value < min || value === 0) {
    //   value = min;
    // } else if(value > max) {
    //   value = max;
    // }
    this.setState({
      value
    });
    CallFunc(onChange)(value);
  }
  checkValue() {
    const {min = 1, max = this.defaultMax} = this.props;
    let {value} = this.state;
    if(value < min || value === 0) {
      value = min;
    } else if(value > max) {
      value = max;
    }
    this.changeValue(value);
  }
  setIdea(isShow) {
    this.setState({
      isShowIdea: isShow
    });
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props.defaultValue !== nextProps.defaultValue || this.state.isShowIdea !== nextState.isShowIdea;
  // }
  render() {
    const {onChange, defaultValue, suffix, range = ideaTipsGroup, inputable = true} = this.props;
    const {isShowIdea, value} = this.state;

    return (
      <div className={"multiple-helper" + (isShowIdea ? ' show' : '')}>
        <div className="layout a-i-str j-c-b">
          <span className="multiple-action-btn" onClick={e => this.multipleOperation('less')}>-</span>
          <input type="text" name="multiple" className="multiple-input-control"
            onFocus={e => {
              e.target.select();
            }}
            onBlur={e => {
              let self = this;
              setTimeout(() => {
                if(!isShowIdea) return;
                self.setIdea(false);
                // self.checkValue();
              }, 1 * 100);
            }}
            value={value} ref={e => this.multipleHelper = e}
            onChange={(e) => {
              if(!inputable) return;
              this.changeValue(e.target.value);
            }}/>
          <span className="multiple-tip">{suffix}</span>
          <span className="multiple-action-btn" onClick={e => this.multipleOperation('plus')}>+</span>
          <span className="ps5 toggle-tip-btn" onClick={e => {
            this.multipleHelper.focus();
            this.setIdea(true);
          }}>
            <Icon type="more"/>
          </span>
        </div>
        <div className="idea-tip">
          {
            range.map((item, idx) => {
              return (
                <div key={idx} className="item" onClick={e => {
                  this.setIdea(false);
                  this.changeValue(item);
                }}>
                  <span className="mul">{item}</span>{suffix}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
