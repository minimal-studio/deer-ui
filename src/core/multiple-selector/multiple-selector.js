import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call } from 'basic-helper';
import { Icon } from '../icon';

export default class Multiple extends PureComponent {
  static propTypes = {
    /** onChange */
    onChange: PropTypes.func,
    /** 是否可输入 */
    inputable: PropTypes.bool,
    /** 每一次输入的单位 */
    basicUnit: PropTypes.number,
    /** 最小输入 */
    min: PropTypes.number,
    /** 最大输入 */
    max: PropTypes.number,
    /** 默认值 */
    defaultValue: PropTypes.any,
    /** 后缀 */
    suffix: PropTypes.string,
    /** 下拉提示的组合 */
    range: PropTypes.arrayOf(PropTypes.number)
  };
  static defaultProps = {
    max: 999999,
    inputable: true,
    min: 1,
    range: [1, 5, 10, 100],
  }
  constructor(props) {
    super(props);
    const { range, defaultValue } = props;
    this.state = {
      isShowIdea: false,
      value: defaultValue || range[0]
    };
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
    const { onChange } = this.props;
    const value = +(val) || 1;
    this.setState({
      value
    });
    Call(onChange, value);
  }
  checkValue() {
    const { min, max } = this.props;
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
    const { suffix, range, inputable } = this.props;
    const { isShowIdea, value } = this.state;

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
            value={value}
            ref={e => this.multipleHelper = e}
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
            <Icon n="more"/>
          </span>
        </div>
        <div className="idea-tip">
          {
            range.map(item => {
              return (
                <div key={item} className="item" onClick={e => {
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
