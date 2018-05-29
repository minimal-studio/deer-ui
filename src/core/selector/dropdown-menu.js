import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import SelectorBasic from './selector';
import Icon from '../icon';

import {ShowGlobalMenu} from './show-menu-func';

export default class DropdownMenu extends Component {
  showSubMenu(e) {
    let listStyle = {
      height: (32 * (this.getValuesLength())) + 76
    };
    return ShowGlobalMenu(Object.assign({}, this.props, {
      elem: e.target,
      onClickItem: (clickItem) => {
        this.props.onChange(clickItem.value);
      },
      style: listStyle,
    }));
  }
  getActiveTitle() {
    const {values, value, isMultiple} = this.props;
    if(!value) return;

    return isMultiple ? value.length + '项已选择' : values[value] || '无';
  }
  getValuesLength() {
    const {values} = this.props;
    return Array.isArray(values) ? values.length : Object.keys(values).length;
  }
  render() {
    const {
      style = {}, className = '', values = [],
      inRow = false,
    } = this.props;

    return (
      <div
        className={
          "v-dropdown-menu" +
          (className ? ' ' + className : '') +
          (inRow ? ' in-row' : '')
        }
        style={style}>
        <div className="active-item" onClick={e => this.showSubMenu(e)}>
          <span className="title">
            {
              this.getActiveTitle()
            }
          </span>
        </div>
      </div>
    )
  }
}
DropdownMenu.propTypes = {
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
