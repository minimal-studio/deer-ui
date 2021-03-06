import React from 'react';

import { $T } from '../utils';
import { Icon, IconProps } from '../icon';
import { Button } from '../button';
import SelectorBasic, { SelectorValuesDescription, SelectorBasicProps } from '../selector-basic';

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
      // eslint-disable-next-line prefer-destructuring
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

    const selectAllBtn = isMultiple && checkAllBtn && (
      <Button
        color={!isSelectedAll ? 'theme' : 'red'}
        size="tiny"
        className="select-all-btn"
        onClick={() => (isSelectedAll ? this.clearAll() : this.selectAll())}
      >
        {this.$T_IN(isSelectedAll ? '清除' : '全选')}
      </Button>
    );

    const radioGroup = this.values.map((item, idx) => {
      const { text, value, img } = item;
      const isActive = isMultiple ? (selectedValue || [])
        .indexOf(value) > -1 : selectedValue == value;

      return (
        <div
          className={`item ${isActive ? 'active' : ''}`}
          style={{
            width: itemWidth, ...itemStyle
          }}
          key={value}
          onClick={(e) => this.selectItem(value, idx)}
        >
          {
            img && (
              <img src={img} alt="" />
            )
          }
          {/* <div className="caret"></div> */}
          <div className={`frame${n ? ' icon-mode' : ''}`}>
            {
              n ? <Icon n={n} /> : <div className="unit"/>
            }
          </div>
          <div className="text">{$T(text)}</div>
        </div>
      );
    });
    return (
      <div className={`__radio-container${isMultiple ? ' multiple' : ''}`}>
        {selectAllBtn}
        <div className={`layout group${column ? ' col' : ''}`}>
          {radioGroup}
        </div>
      </div>
    );
  }
}
