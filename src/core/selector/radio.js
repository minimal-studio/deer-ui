import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import SelectorBasic from './selector';

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
  selectItem(value) {
    this.changeValue(value);
  }
  componentDidMount() {
    const {defaultValue, isMultiple = false, didMountChange = true} = this.props;
    if(!didMountChange || isMultiple) return;
    let _defVal = this.values[0] ? this.values[0].value : '';
    this.selectItem(defaultValue === 0 ? 0 : defaultValue || _defVal, 0);
  }
  render() {
    const {itemWidth = 100, isMultiple, checkAllBtn = true, itemStyle = {}} = this.props;
    const selectedValue = this.getValue();

    const selectAllBtn = isMultiple && checkAllBtn ? (
      <span
        className="btn warn flat selectAllBtn"
        onClick={e => this.selectAll()}>全选</span>
    ) : null;

    const container = this.values.map((item, idx) => {
      let {text, value, img} = item;
      let isActive = isMultiple ? (selectedValue || []).indexOf(value) > -1 : selectedValue == value;

      let imgCon = img ? (
        <img src={img}/>
      ) : null;

      return (
        <div
          className={"block-radio text-center" + (isActive ? ' active' : '')}
          style={Object.assign({width: itemWidth}, itemStyle)}
          key={idx}
          onClick={e => this.selectItem(value, idx)}>
          {imgCon}
          <div className="pu5">{text}</div>
          <div className="caret"></div>
        </div>
      )
    });
    return (
      <div className="radio-container">
        <div className="radio-group layout">
          {selectAllBtn}
          {container}
        </div>
      </div>
    );
  }
}
Radio.propTypes = {
  values: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  checkAllBtn: PropTypes.bool,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  didMountChange: PropTypes.bool,
  itemWidth: PropTypes.any,
}
