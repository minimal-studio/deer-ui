import React from 'react';
import PropTypes from 'prop-types';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { HasValue } from 'basic-helper';

import positionFilter from '../position-filter';
import SelectorBasic, { selectorValuesType } from './selector';
import { Icon } from '../icon';

const MenuItem = ({isActive, text, icon, ...other}) => {
  return (
    <div
      className={"menu-item" + (isActive ? ' active' : '')}
      {...other}>
      {icon ? <Icon n={icon}/> : null}
      {text}
    </div>
  );
};

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
const handleDOMClick = (e) => {
  console.log(e);
};
document.addEventListener('click', handleDOMClick);

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
    /** 是否返回 number 类型的值 */
    isNum: PropTypes.bool,
    /** 是否带搜索输入 */
    withInput: PropTypes.bool,
    /** 是否需要清楚选择的按钮 */
    needAction: PropTypes.bool,
    /** 是否多选 */
    isMultiple: PropTypes.bool,
    /** 传入 dropdownMenu 的 style */
    style: PropTypes.object,
    /** 弹出的位置，用 , 分隔，最多支持两个不冲突位置，如果冲突，则选择第一个值 */
    position: PropTypes.string,
    /** 值改变的回调 */
    onChange: PropTypes.func
  };
  static defaultProps = {
    withInput: true,
    needAction: true,
    position: 'bottom,left',
  };
  state = {
    isShow: false,
    searchValue: '',
  }
  handleDOMClick = (e) => {
    console.log(e);
  }
  showSubMenu(isShow = true) {
    this.setState({
      isShow,
    });
  }
  hideSubMenu() {
    this.showSubMenu(false);
  }
  // emitChange(...args) {
  //   const {isMultiple, onChange} = this.props;
  //   if(!isMultiple) onChange(val, ...other);
  // }
  focusInput() {
    this._input.focus();
  }
  handleClick(dataItem, idx) {
    const { onClickItem, isMultiple } = this.props;
    onClickItem && onClickItem(dataItem);
    this.changeValue(dataItem.value, idx);
    if(!isMultiple) {
      this.blur();
    }
  }
  onSearch(val) {
    val = val.trim();
    this.setState({
      searchValue: val
    });
  }
  getActiveTitle() {
    const { isMultiple } = this.props;
    const value = this.getValue();

    let resTitle = '';
    this._error = false;

    switch (true) {
    case !HasValue(value):
      resTitle = this.gm('无');
      break;
    case !!isMultiple:
      resTitle = value.length + this.gm('项已选择');
      break;
    default:
      let title = this.valuesObj[value];
      if(HasValue(title)) {
        resTitle = title;
      } else {
        resTitle = this.gm('无效值');
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
  handleChange = (val) => {
    const { isMultiple, onChange } = this.props;
    if(isMultiple) this.focusInput();
    onChange(val);
  }
  blur(isShow = false) {
    this.setState({
      isShow,
      searchValue: ''
    });
  }
  render() {
    const {
      style = {}, className = '', isMultiple, withInput, position, needAction
    } = this.props;
    const { isShow, searchValue } = this.state;
    const _selectedValue = this.getValue();
    
    const isSelectedAll = this.checkIsSelectedAll();
    const canSelectAll = isMultiple && !isSelectedAll;
    const activeTitle = this.getActiveTitle();
    const _position = positionFilter(position);

    return (
      <div
        className={
          "uke-dropdown-menu " +
          (this._error ? 'error ' : '') + 
          _position + ' ' +
          (className ? ' ' + className : '') +
          (isMultiple ? ' multiple' : ' single') +
          (withInput ? ' input-mode' : '') +
          (isShow ? ' show' : '')
        }
        style={style}>
        <span className="menu-wrapper" 
          onClick={e => {
            if(isMultiple) {
              this.showSubMenu();
            } else {
              this.focusInput();
            }
          }}>
          <div className="display-title">
            {activeTitle}
          </div>
          {
            isMultiple ? null : (
              <input type="text" 
                ref={_i => {
                  if(_i) this._input = _i;
                }}
                placeholder={activeTitle}
                value={searchValue}
                className="search-input"
                onBlur={e => this.blur()}
                onFocus={e => this.showSubMenu()}
                onChange={e => {
                  this.onSearch(e.target.value);
                }}/>
            )
          }
          <div className="icon-wrap">
            <Icon n="angle-down" />
          </div>
        </span>
        {/* <div className="drop-tip">
        </div> */}
        <TransitionGroup component={null}>
          <CSSTransition
            key={isShow ? 'opened' : 'none'}
            classNames="drop-menu"
            timeout={200}>
            {
              isShow ? (
                <div className={
                  "dropdown-items " + 
                  _position
                }>
                  <span className="caret" />
                  {
                    isMultiple ? (
                      <div onClick={e => this.hideSubMenu()} 
                        className="section-mark" />
                    ) : null
                  }
                  <div className="action-group">
                    {
                      needAction && (
                        <div className="action-btn" onClick={e => {
                          canSelectAll ? this.selectAll() : this.clearAll();
                        }}>
                          {this.gm(canSelectAll ? '全选' : '取消')}
                        </div>
                      )
                    }
                    <div className="items-group">
                      {
                        this.values.map((dataItem, idx) => {
                          const { text, value, icon, img } = dataItem;
  
                          const isActive = itemActiveFilter(_selectedValue, value);
                          // HasValue(_selectedValue) && (_selectedValue + '').indexOf(value) > -1;
                          let renderable = !searchValue ? true : (text.indexOf(searchValue) != -1 || value.toLowerCase().indexOf(searchValue) != -1);
  
                          return renderable ? (
                            <MenuItem
                              key={value}
                              isActive={isActive}
                              onClick={e => {
                                this.handleClick(dataItem, idx);
                              }}
                              {...dataItem}/>
                          ) : null;
                        })
                      }
                    </div>
                  </div>
                </div>
              ) : <span />
            }
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }
}
