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
    values: selectorValuesType,
    onChange: PropTypes.func.isRequired,
    isMultiple: PropTypes.bool,
    checkAllBtn: PropTypes.bool,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    itemStyle: PropTypes.object,
    // didMountChange: PropTypes.bool,
    itemWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };
  selectItem(value, idx) {
    this.changeValue(value, idx);
  }
  render() {
    const {itemWidth, isMultiple, checkAllBtn = true, itemStyle = {}} = this.props;
    const selectedValue = this.getValue();
    let gm = window.$UKE.getUkeKeyMap;

    const selectAllBtn = isMultiple && checkAllBtn ? (
      <span
        className="btn warn flat selectAllBtn"
        onClick={e => this.selectAll()}>{gm('全选')}
      </span>
    ) : null;

    const radioGroup = this.values.map((item, idx) => {
      let {text, value, img} = item;
      let isActive = isMultiple ? (selectedValue || []).indexOf(value) > -1 : selectedValue == value;

      return (
        <div
          className={"item" + (isActive ? ' active' : '')}
          style={{width: itemWidth, ...itemStyle}}
          key={idx}
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
