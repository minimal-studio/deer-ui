import React from 'react';
import PropTypes from 'prop-types';
import { HasValue, Call } from 'basic-helper';
import classnames from 'classnames';

import SelectorBasic, { selectorValuesType } from './selector';
import DropdownWrapper from './dropdown-wrapper';
import { MenuItem } from '../menu';
// import Radio from './radio';

const itemActiveFilter = (val, targetVal) => {
  let has = HasValue(val);

  if(!has) return false;

  let isInclueVal = false;
  switch (true) {
  case Array.isArray(val):
    isInclueVal = val.indexOf(targetVal) !== -1;
    break;
  case typeof val === 'string':
    isInclueVal = val == targetVal;
    break;
  case typeof val === 'number':
    isInclueVal = val == targetVal;
    break;
  }
  return isInclueVal;
};

/**
 * 下拉菜单组件，带有输入搜索功能
 *
 * @export
 * @class DropdownMenu
 * @extends {SelectorBasic}
 */
export default class DropdownMenu extends SelectorBasic {
  static propTypes = {
    /** 所有的下拉参数的配置 */
    values: selectorValuesType,
    /** 默认值，与 value 冲突 */
    defaultValue: PropTypes.any,
    /** 给 dropdownMenu 的 class */
    className: PropTypes.string,
    /** 一旦设置，便成为受控控件，详情请参考 react 受控控件 https://reactjs.org/docs/forms.html */
    value: PropTypes.any,
    /** 监听滚动时隐藏的外层元素 */
    scrollElem: PropTypes.func,
    /** 是否渲染在 react root 之外 */
    outside: PropTypes.bool,
    /** 是否返回 number 类型的值 */
    isNum: PropTypes.bool,
    /** 是否带搜索输入 */
    withInput: PropTypes.bool,
    /** 是否需要清除选择的按钮 */
    needAction: PropTypes.bool,
    /** 是否多选 */
    isMultiple: PropTypes.bool,
    /** 传入 dropdownMenu 的 style */
    style: PropTypes.shape({}),
    /** 没有值时显示的 title */
    defaultTitle: PropTypes.string,
    /** 无效值的显示 */
    invalidTip: PropTypes.string,
    /** 取消的 title */
    cancelTitle: PropTypes.string,
    /** 弹出的位置，用 , 分隔，最多支持两个不冲突位置，如果冲突，则选择第一个值 */
    position: PropTypes.string,
    /** 值改变的回调 */
    onChange: PropTypes.func
  };
  static defaultProps = {
    withInput: true,
    needAction: true,
    outside: true,
    defaultTitle: '请选择',
    invalidTip: '无效值',
    cancelTitle: '取消',
    position: 'bottom,left',
  };
  handleClick(dataItem, idx, callback) {
    const { onClickItem, isMultiple } = this.props;
    Call(onClickItem, dataItem);
    this.changeValue(dataItem.value, idx);
    Call(callback);
  }
  getActiveTitle() {
    const { isMultiple, defaultTitle, invalidTip } = this.props;
    const value = this.getValue();
    const hasVal = Array.isArray(value) ? value.length > 0 : value;

    let resTitle = '';
    this._error = false;

    switch (true) {
    case !hasVal:
      resTitle = defaultTitle;
      break;
    case !!isMultiple:
      resTitle = value.length + this.gm('项已选择');
      break;
    case !this.valuesObj.hasOwnProperty(value):
      resTitle = invalidTip;
      this._error = true;
      break;
    default:
      let title = this.valuesObj[value];
      if(HasValue(title)) {
        resTitle = title;
      } else if(typeof title == 'undefined') {
        resTitle = defaultTitle;
      } else {
        resTitle = invalidTip;
        this._error = true;
      }
      break;
    }

    return resTitle;
  }
  getValuesLength() {
    const { values } = this;
    return Array.isArray(values) ? values.length : Object.keys(values).length;
  }
  render() {
    const {
      isMultiple, needAction, cancelTitle, withInput
    } = this.props;
    const _selectedValue = this.getValue();
    const hasVal = Array.isArray(_selectedValue) ? _selectedValue.length > 0 : !!_selectedValue;
    
    const isSelectedAll = this.checkIsSelectedAll();
    const canSelectAll = isMultiple && !isSelectedAll;
    const menuTitle = this.getActiveTitle();

    return (
      <DropdownWrapper {...this.props}
        menuTitle={menuTitle}
        overlay={({ hide, searchValue }) => {
          return (
            <div className="action-group">
              {
                needAction && (
                  <div className="action-btn" onClick={e => {
                    canSelectAll ? this.selectAll() : this.clearAll();
                    hide();
                  }}>
                    {this.gm(canSelectAll ? '全选' : cancelTitle)}
                  </div>
                )
              }
              <div className="items-group">
                {/* <Radio values={this.values}
                value={this.value}
                isMultiple={isMultiple} onChange={(val, ...other) => {
                  const emitVal = isMultiple ? val : [val];
                  this.changeEvent(emitVal, ...other);
                }} /> */}
                {
                  this.values.map((dataItem, idx) => {
                    const { text, value, icon, img } = dataItem;

                    const isActive = itemActiveFilter(_selectedValue, value);
                    // HasValue(_selectedValue) && (_selectedValue + '').indexOf(value) > -1;
                    let renderable = !searchValue ? true : (text.toString().indexOf(searchValue) != -1 || value.toString().toLowerCase().indexOf(searchValue) != -1);
  
                    return renderable ? (
                      <MenuItem
                        key={value}
                        isActive={isActive}
                        onClick={e => {
                          if(isMultiple) e.preventDefault();
                          this.handleClick(dataItem, idx, isMultiple ? null : hide);
                        }}
                        {...dataItem}/>
                    ) : null;
                  })
                }
              </div>
            </div>
          );
        }}
        withInput={!withInput ? withInput : !isMultiple}
        error={this._error}
        className={classnames({
          "multiple": isMultiple,
          "single": !isMultiple,
          "has-val": hasVal
        })} />
    );
  }
}
