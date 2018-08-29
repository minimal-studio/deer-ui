import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import Icon from '../icon';
import SelectorBasic from './selector';
import {getElementLeft, getElementTop} from '../set-dom';

export const MenuItem = ({isActive, text, icon, ...other}) => {
  return (
    <div
      className={"menu-item" + (isActive ? ' active' : '')}
      {...other}>
      {icon ? <Icon type={icon}/> : null}
      {text}
    </div>
  )
}

export default class MenuGroup extends SelectorBasic {
  static propTypes = {
    isMultiple: PropTypes.bool,
    value: PropTypes.any,
    values: PropTypes.any,
    style: PropTypes.object,
    defaultValue: PropTypes.array,
    onClickItem: PropTypes.func,
  }
  constructor(props) {
    super(props);

    const {elem, value} = props;

    this.state = Object.assign({}, this.state, {
      searchValue: '',
    });

    this.offset = {
      left: getElementLeft(elem),
      top: elem.offsetHeight + getElementTop(elem) - window.scrollY
    }
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
  }
  handleScroll = () => {
    window.removeEventListener('scroll', this.handleScroll, false);
    this.close();
  }
  onSearch(val) {
    val = val.trim();
    this.setState({
      searchValue: val
    });
  }
  close() {
    this.props.onClose();
  }
  componentDidMount() {
    this._input.focus();
  }
  handleClick(dataItem) {
    const {onClickItem, isMultiple} = this.props;
    onClickItem && onClickItem(dataItem);
    this.changeValue(dataItem.value);
    if(!isMultiple) this.close();
  }
  render() {
    const {
      isMultiple = false, style, event,
    } = this.props;
    const {searchValue, selectedValue} = this.state;
    const isSelectedAll = this.checkIsSelectedAll();
    const canSelectAll = isMultiple && !isSelectedAll;

    const _style = Object.assign({}, this.offset, style);
    let gm = $UKE.getUkeKeyMap;

    return (
      <div className="menu-list"
        ref={c => this._list = c}
        style={_style}>
        <div className="search-bar">
          <input
            placeholder={gm("搜索试试")}
            className="form-control input-sm"
            type="text"
            ref={c => {this._input = c}}
            onChange={e => this.onSearch(e.target.value)} value={searchValue}/>
        </div>
        <div className="items-group">
          <div className="action-btn-group">
            <div className="action-btn" onClick={e => {
              canSelectAll ? this.selectAll() : this.changeEvent(isMultiple ? [] : '');
            }}>{gm(canSelectAll ? '全选' : '取消已选项')}</div>
          </div>
          {
            this.values.map((dataItem, idx) => {
              const {text, value, icon, img} = dataItem;

              const isActive = selectedValue && selectedValue.indexOf(value) > -1;
              let renderable = !searchValue ? true : (text.indexOf(searchValue) != -1 || value.toLowerCase().indexOf(searchValue) != -1);

              return renderable ? (
                <MenuItem
                  key={value}
                  isActive={isActive}
                  onClick={e => this.handleClick(dataItem)}
                  {...dataItem}/>
              ) : null
            })
          }
        </div>
      </div>
    )
  }
}
