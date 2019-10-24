import React from 'react';

import { Icon } from '../icon';
import { IconProps } from '../icon/icon';
import SelectorBasic, { SelectorValuesDescription, SelectorBasicProps } from './selector';
import { $T } from '../config';

export interface RadioProps extends SelectorBasicProps, IconProps {
  values: SelectorValuesDescription;
  /** 是否需要多选按钮 */
  checkAllBtn?: boolean;
  /** 是否竖向排列 */
  column?: boolean;
  /** 传入每个 item 的 style */
  itemStyle?: React.CSSProperties;
  /** 统一控制每个 item 的宽度 */
  itemWidth?: string | number;
}

export default class Radio extends SelectorBasic<RadioProps> {
  static getDefaultValue(values) {
    let result;
    if (Array.isArray(values)) {
      result = values[0].value;
    } else {
      result = Object.keys(values)[0];
    }
    return result;
  }

  static defaultProps = {
    column: false
  }

  selectItem(value, idx) {
    this.changeValue(value, idx);
  }

  render() {
    const {
      itemWidth, isMultiple, checkAllBtn = true, itemStyle = {}, n, column
    } = this.props;
    const selectedValue = this.getValue();
    const isSelectedAll = isMultiple && selectedValue
      && selectedValue.length === this.values.length;

    const selectAllBtn = isMultiple && checkAllBtn ? (
      <span
        className={`btn flat selectAllBtn ${isSelectedAll ? 'red' : 'theme'}`}
        onClick={e => (isSelectedAll ? this.clearAll() : this.selectAll())}>
        {this.$T_UKE(isSelectedAll ? '清除' : '全选')}
      </span>
    ) : null;

    const radioGroup = this.values.map((item, idx) => {
      const { text, value, img } = item;
      const isActive = isMultiple ? (selectedValue || []).indexOf(value) > -1 : selectedValue == value;

      return (
        <div
          className={`item ${isActive ? 'active' : ''}`}
          style={{
            width: itemWidth, ...itemStyle
          }}
          key={value}
          onClick={e => this.selectItem(value, idx)}>
          {
            img && (
              <img src={img} alt="" />
            )
          }
          <div className="text">{$T(text)}</div>
          {/* <div className="caret"></div> */}
          <div className={`frame${n ? ' icon-mode' : ''}`}>
            {
              n ? <Icon n={n} /> : <div className="unit"/>
            }
          </div>
        </div>
      );
    });
    return (
      <div className={`__radio-container${isMultiple ? ' multiple' : ''}`}>
        {selectAllBtn}
        <div className={`layout ${column ? 'col' : ''} group`}>
          {radioGroup}
        </div>
      </div>
    );
  }
}
