import React, { PureComponent } from 'react';
import { Call } from '@mini-code/base-func';
import { Icon } from '@deer-ui/core/icon';
import { InputNumber } from '@deer-ui/core/input-number';
import { DropdownWrapper, Menus, MenuItem } from '@deer-ui/core';

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
    min: 0,
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

  changeValue(val) {
    const { min, max, onChange } = this.props;
    if (val > max) return;
    if (val < min) return;
    this.setState({
      value: val
    });
    Call(onChange, val);
  }

  setIdea(isShow) {
    this.setState({
      isShowIdea: isShow
    });
  }

  renderHints = ({ hide }) => {
    const { suffix, range } = this.props;
    return (
      <Menus padding={0}>
        {
          range && range.map((item) => (
            <MenuItem
              key={item}
              className="item"
              onClick={(e) => {
                this.setIdea(false);
                this.changeValue(item);
                hide();
              }}
            >
              <span className="mul">{item}</span>{suffix}
            </MenuItem>
          ))
        }
      </Menus>
    );
  }

  render() {
    const { value } = this.state;
    const { min, max = 999999 } = this.props;
    return (
      <DropdownWrapper
        overlay={this.renderHints}
      >
        <InputNumber
          numRange={[min, max]}
          value={value}
          onChange={(val) => {
            this.changeValue(val);
          }}
        />
      </DropdownWrapper>
    );
  }
}
