import React from 'react';
import { HasValue, Call } from 'basic-helper';
import classnames from 'classnames';
import { tuple } from 'basic-helper/utils/type';

import SelectorBasic, { SelectorValuesDescription, SelectorBasicProps } from './selector';
import DropdownWrapper, { DropdownWrapperProps } from './dropdown-wrapper';
import { MenuItem } from '../menu';
import { $T, $T_UKE } from '../config';
// import Radio from './radio';

const positionList = tuple('button', 'top', 'left', 'right', 'button,left', 'button,right', 'top,left', 'top,right');
export type DropdownPosition = (typeof positionList)[number];

export interface DropdownMenuProps extends SelectorBasicProps, DropdownWrapperProps {
  // /** 所有的下拉参数的配置 */
  // values: SelectorValuesDescription;
  /** 给 dropdownMenu 的 class */
  className?: string;
  /** 监听滚动时隐藏的外层元素 */
  scrollElem?: () => HTMLElement;
  /** 是否渲染在 react root 之外 */
  outside?: boolean;
  /** 是否返回 number 类型的值 */
  isNum?: boolean;
  /** 是否带搜索输入 */
  withInput?: boolean;
  /** 是否需要清除选择的按钮 */
  needAction?: boolean;
  /** 是否多选 */
  isMultiple?: boolean;
  /** 传入 dropdownMenu 的 style */
  style?: React.CSSProperties;
  /** 没有值时显示的 title */
  defaultTitle?: string;
  /** 无效值的显示 */
  invalidTip?: string;
  /** 取消的 title */
  cancelTitle?: string;
  /** 弹出的位置，用 , 分隔，最多支持两个不冲突位置，如果冲突，则选择第一个值 */
  position?: DropdownPosition;
  /** 点击菜单的回调 */
  onClickItem?: (dataItem) => void;
}

const itemActiveFilter = (val, targetVal) => {
  const has = HasValue(val);

  if (!has) return false;

  let isInclueVal = false;
  switch (true) {
    case Array.isArray(val):
      isInclueVal = val.indexOf(targetVal) !== -1;
      break;
    case typeof val === 'string':
      isInclueVal = val === targetVal;
      break;
    case typeof val === 'number':
      isInclueVal = val === targetVal;
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
export default class DropdownMenu extends SelectorBasic<DropdownMenuProps> {
  static defaultProps = {
    withInput: true,
    needAction: true,
    outside: true,
    defaultTitle: '请选择',
    invalidTip: '无效值',
    cancelTitle: '取消',
    position: 'bottom,left',
  };

  _error = false;

  handleClick(dataItem, idx, callback) {
    const { onClickItem } = this.props;
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
        resTitle = $T_UKE(defaultTitle);
        break;
      case !!isMultiple:
        resTitle = value.length + $T_UKE('项已选');
        break;
      case typeof this.valuesObj[value] == 'undefined':
        resTitle = $T_UKE(invalidTip);
        this._error = true;
        break;
      default:
        const title = this.valuesObj[value];
        if (HasValue(title)) {
          resTitle = title;
        } else if (typeof title == 'undefined') {
          resTitle = $T_UKE(defaultTitle);
        } else {
          resTitle = $T_UKE(invalidTip);
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
        menuTitle={$T(menuTitle)}
        overlay={({ hide, searchValue }) => (
          <div className="action-group">
            {
              needAction && (
                <div className="action-btn" onClick={(e) => {
                  canSelectAll ? this.selectAll() : this.clearAll();
                  hide();
                }}>
                  {$T_UKE(canSelectAll ? '全选' : cancelTitle)}
                </div>
              )
            }
            <div className="items-group">
              {
                this.values.map((dataItem, idx) => {
                  const {
                    text, value, icon, img
                  } = dataItem;

                  const isActive = itemActiveFilter(_selectedValue, value);
                  const renderable = !searchValue
                    ? true
                    : (text.toString().indexOf(searchValue) !== -1
                      || value.toString().toLowerCase().indexOf(searchValue) !== -1);

                  return renderable ? (
                    <MenuItem
                      key={value}
                      isActive={isActive}
                      onClick={(e) => {
                        if (e && isMultiple) e.preventDefault();
                        this.handleClick(dataItem, idx, isMultiple ? null : hide);
                      }}
                      {...dataItem}/>
                  ) : null;
                })
              }
            </div>
          </div>
        )}
        withInput={!withInput ? withInput : !isMultiple}
        error={this._error}
        className={classnames({
          multiple: isMultiple,
          single: !isMultiple,
          "has-val": hasVal
        })} />
    );
  }
}
