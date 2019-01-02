import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import SelectorBasic, { selectorValuesType } from './selector';

export default class Radio extends SelectorBasic {
  static getDefaultValue(values) {
    let result = null;
    if(Array.isArray(values)) {
      result = values[0].value;
    } else {
      result = Object.keys(values)[0];
    }
    return result;
  }
  static propTypes = {
    /** Selector 通用的 values 格式 */
    values: selectorValuesType,
    /** 值改变的回调 */
    onChange: PropTypes.func.isRequired,
    /** 是否多选 */
    isMultiple: PropTypes.bool,
    /** 是否需要多选按钮 */
    checkAllBtn: PropTypes.bool,
    /** 默认值 */
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    /** 受控组件的 value */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    /** 传入每个 item 的 style */
    itemStyle: PropTypes.object,
    // didMountChange: PropTypes.bool,
    /** 统一控制每个 item 的宽度 */
    itemWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };
  selectItem(value, idx) {
    this.changeValue(value, idx);
  }
  render() {
    const { itemWidth, isMultiple, checkAllBtn = true, itemStyle = {} } = this.props;
    const selectedValue = this.getValue();
    const isSelectedAll = isMultiple && selectedValue && selectedValue.length === this.values.length;
    const gm = this.gm;

    const selectAllBtn = isMultiple && checkAllBtn ? (
      <span
        className={"btn flat selectAllBtn " + (isSelectedAll ? 'red' : 'theme')}
        onClick={e => isSelectedAll ? this.clearAll() : this.selectAll()}>
        {gm(isSelectedAll ? '清除' : '全选')}
      </span>
    ) : null;

    const radioGroup = this.values.map((item, idx) => {
      let { text, value, img } = item;
      let isActive = isMultiple ? (selectedValue || []).indexOf(value) > -1 : selectedValue == value;

      return (
        <div
          className={"item" + (isActive ? ' active' : '')}
          style={{
            width: itemWidth, ...itemStyle
          }}
          key={value}
          onClick={e => this.selectItem(value, idx)}>
          {
            img ? (
              <img src={img} alt=""/>
            ) : null
          }
          <div className="text">{text}</div>
          {/* <div className="caret"></div> */}
          <div className="cycle">
            <div className="unit"/>
          </div>
        </div>
      );
    });
    return (
      <div className="uke-radio-container">
        <div className="group">
          {selectAllBtn}
          {radioGroup}
        </div>
      </div>
    );
  }
}
