import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { HasValue } from 'basic-helper';

import setDOMById, { getElementOffset } from '../set-dom';
import { getScrollTop } from '../utils';
import positionFilter from '../position-filter';
import SelectorBasic, { selectorValuesType } from './selector';
import { Icon } from '../icon';
import ClickAway from '../uke-utils/click-away';

const dropdownContainerID = 'DropdownContainer';

const dropdownContainerDOM = setDOMById(dropdownContainerID, 'uke-dropdown-menu');

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
    style: PropTypes.object,
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
    outside: false,
    defaultTitle: '无',
    invalidTip: '无效值',
    cancelTitle: '取消',
    position: 'bottom,left',
  };
  state = {
    ...this.state,
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
      this.hide();
    }
  }
  onSearch(val) {
    val = val.trim();
    this.setState({
      searchValue: val
    });
  }
  getActiveTitle() {
    const { isMultiple, defaultTitle, invalidTip } = this.props;
    const value = this.getValue();

    let resTitle = '';
    this._error = false;

    switch (true) {
    case !HasValue(value):
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
  // handleChange = (val) => {
  //   const { isMultiple, onChange } = this.props;
  //   if(isMultiple) this.focusInput();
  //   onChange(val);
  // }
  hide = () => {
    this.setState({
      isShow: false,
      searchValue: ''
    });
    if(this.addScrollListener) {
      document.removeEventListener('scroll', this.hide);
      this.addScrollListener = false;
    }
  }
  blur = () => {
    // this.hide();
  }
  handleClickAway = () => {
    if(this.state.isShow) this.hide();
  }
  handleClickMenu = e => {
    const { outside, isMultiple, position } = this.props;
    if(outside) {
      e.preventDefault();
      // console.log(e.pageX)
      const { clientX, clientY } = e;
      const { offsetTop, offsetLeft } = getElementOffset(e.target);
      this.containerOffset = {
        offsetTop: offsetTop + e.target.offsetHeight + 10,
        offsetLeft: clientX - 30
        // offsetTop: clientX + 10,
        // offsetLeft: clientY
      };
      if(!this.addScrollListener) document.addEventListener('scroll', this.hide);
      this.addScrollListener = true;
    }
    this.showSubMenu();
    if(!isMultiple) this.focusInput();
  }
  render() {
    const {
      style = {}, className = '', isMultiple, withInput, position, needAction,
      outside, cancelTitle
    } = this.props;
    const { isShow, searchValue } = this.state;
    const _selectedValue = this.getValue();
    
    const isSelectedAll = this.checkIsSelectedAll();
    const canSelectAll = isMultiple && !isSelectedAll;
    const activeTitle = this.getActiveTitle();
    const _position = positionFilter(position);

    const dropdownCom = (
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
              } style={outside ? {
                top: this.containerOffset.offsetTop,
                left: this.containerOffset.offsetLeft,
                position: 'fixed'
              } : {}}>
                <span className="caret" />
                <div className="action-group">
                  {
                    needAction && (
                      <div className="action-btn" onClick={e => {
                        canSelectAll ? this.selectAll() : this.clearAll();
                      }}>
                        {this.gm(canSelectAll ? '全选' : cancelTitle)}
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
    );

    return (
      <ClickAway onClickAway={this.handleClickAway}>
        <div
          className={classnames({
            "uke-dropdown-menu": true,
            [className]: !!className,
            "error": this._error,
            "multiple": isMultiple,
            "single": !isMultiple,
            "input-mode": withInput,
            "show": isShow,
            [_position]: true,
          })
          }
          style={style}>
          <span className="menu-wrapper" 
            onClick={this.handleClickMenu}>
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
          {
            outside ? ReactDOM.createPortal(
              dropdownCom,
              dropdownContainerDOM
            ) : dropdownCom
          }
        </div>
      </ClickAway>
    );
  }
}
