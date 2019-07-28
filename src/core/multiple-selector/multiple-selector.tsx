import React, { PureComponent } from 'react';
import { Call } from 'basic-helper';
import { Icon } from '../icon';

export interface MultipleProps {
  /** onChange */
  onChange: (val) => void;
  /** 是否可输入 */
  inputable?: boolean;
  /** 每一次输入的单位 */
  basicUnit?: number;
  /** 最小输入 */
  min?: number;
  /** 最大输入 */
  max?: number;
  /** 默认值 */
  defaultValue?: any;
  /** 后缀 */
  suffix?: string;
  /** 下拉提示的组合 */
  range?: number[];
}

interface State {
  isShowIdea: boolean;
  value: any;
}

export default class Multiple extends PureComponent<MultipleProps, State> {
  static defaultProps = {
    max: 999999,
    inputable: true,
    min: 1,
    range: [1, 5, 10, 100],
  }

  multipleHelper

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
    const { basicUnit = 1 } = this.props;
    const { value } = this.state;
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
    const { min = -1000, max = 10000 } = this.props;
    let { value } = this.state;
    if (value < min || value === 0) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    this.changeValue(value);
  }

  setIdea(isShow) {
    this.setState({
      isShowIdea: isShow
    });
  }

  render() {
    const { suffix, range, inputable } = this.props;
    const { isShowIdea, value } = this.state;

    return (
      <div className={`multiple-helper${isShowIdea ? ' show' : ''}`}>
        <div className="layout a-i-str j-c-b">
          <input type="text" name="multiple" className="multiple-input-control"
            onFocus={(e) => {
              e.target.select();
            }}
            onBlur={(e) => {
              const self = this;
              setTimeout(() => {
                if (!isShowIdea) return;
                self.setIdea(false);
                // self.checkValue();
              }, 1 * 100);
            }}
            value={value}
            ref={(e) => { this.multipleHelper = e; }}
            onChange={(e) => {
              if (!inputable) return;
              this.changeValue(e.target.value);
            }}/>
          <span className="multiple-tip">{suffix}</span>
          <span className="multiple-action-btn"
            onClick={e => this.multipleOperation('less')}>-</span>
          <span className="multiple-action-btn"
            onClick={e => this.multipleOperation('plus')}>+</span>
          <span className="ps5 toggle-tip-btn" onClick={(e) => {
            this.multipleHelper.focus();
            this.setIdea(true);
          }}>
            <Icon n="arrow-down"/>
          </span>
        </div>
        <div className="idea-tip">
          {
            range && range.map(item => (
              <div key={item} className="item" onClick={(e) => {
                this.setIdea(false);
                this.changeValue(item);
              }}>
                <span className="mul">{item}</span>{suffix}
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
