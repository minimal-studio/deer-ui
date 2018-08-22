import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {HasValue} from 'basic-helper';

import SelectorBasic from './selector';

const MenuItem = ({isActive, text, icon, ...other}) => {
  return (
    <div
      className={"menu-item" + (isActive ? ' active' : '')}
      {...other}>
      {icon ? <Icon type={icon}/> : null}
      {text}
    </div>
  )
}

const itemActiveFilter = (val, targetVal) => {
  let has = HasValue(val);

  if(!has) return false;

  let isInclueVal = false;
  switch (true) {
    case Array.isArray(val):
    case typeof val === 'string':
      isInclueVal = val.indexOf(targetVal) != -1;
      break;
    case typeof val === 'number':
      isInclueVal = val == targetVal;
      break;
  }
  return isInclueVal;
}

export default class DropdownMenu extends SelectorBasic {
  static propTypes = {
    defaultValue: PropTypes.any,
    className: PropTypes.string,
    values: PropTypes.any,
    value: PropTypes.any,
    isNum: PropTypes.bool,
    inRow: PropTypes.bool,
    isMultiple: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func
  };
  state = {
    isShow: false,
    searchValue: '',
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
    const {onClickItem, isMultiple} = this.props;
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
    const {value, isMultiple} = this.props;
    if(!HasValue(value)) return '无';

    return isMultiple ? value.length + '项已选择' : this.valuesObj[value];
  }
  getValuesLength() {
    const {values} = this;
    return Array.isArray(values) ? values.length : Object.keys(values).length;
  }
  handleChange = (val) => {
    const {isMultiple, onChange} = this.props;
    if(isMultiple) this.focusInput();
    onChange(val);
  }
  blur(isShow = false) {
    this.setState({
      isShow,
      searchValue: ''
    })
  }
  render() {
    const {
      style = {}, className = '', isMultiple, withInput = true,
    } = this.props;
    const {isShow, searchValue} = this.state;
    const _selectedValue = this.getValue();
    
    const isSelectedAll = this.checkIsSelectedAll();
    const canSelectAll = isMultiple && !isSelectedAll;
    const activeTitle = this.getActiveTitle();

    return (
      <div
        className={
          "uke-dropdown-menu" +
          (className ? ' ' + className : '') +
          (isMultiple ? ' multiple' : ' single') +
          (withInput ? ' input-mode' : '') +
          (isShow ? ' show' : '')
        }
        style={style}>
        <div className="menu-wrapper" 
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
        </div>
        <TransitionGroup component={null}>
          <CSSTransition
            key={isShow ? 'opened' : 'none'}
            classNames="drop-menu"
            timeout={200}>
            {
              isShow ? (
                <div className="dropdown-items">
                  <span className="caret"></span>
                  {
                    isMultiple ? (
                      <div onClick={e => this.hideSubMenu()} 
                        className="section-mark"></div>
                    ) : null
                  }
                  <div className="action-group">
                    <div className="action-btn" onClick={e => {
                      canSelectAll ? this.selectAll() : this.changeEvent([]);
                    }}>{canSelectAll ? '全选' : '取消'}</div>
                    <div className="items-group">
                      {
                        this.values.map((dataItem, idx) => {
                          const {text, value, icon, img} = dataItem;
  
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
                          ) : null
                        })
                      }
                    </div>
                  </div>
                </div>
              ) : <span></span>
            }
          </CSSTransition>
        </TransitionGroup>
      </div>
    )
  }
}
