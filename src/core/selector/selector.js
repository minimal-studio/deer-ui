import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {CallFunc, RemoveArrayItem, IsFunc} from 'basic-helper';

export default class SelectorBasic extends Component {
  constructor(props) {
    super(props);

    const {value, defaultValue, isMultiple} = props;

    // 如果是多选模式，value, defaultValue 必须为array，否则value, defaultValue必须为string

    this.isControl = props.hasOwnProperty('value');

    // 受控模式, 详情请查看 react control form
    // selectedValue = [...values];
    // value 结构: ['values.value']
    this.value = value || defaultValue;
    this.state = {
      selectedValue: this.toArr(this.value),
    }

    this.values = this.getValueArray();
  }
  toArr(target) {
    return Array.isArray(target) ? target : [target];
  }
  // shouldUpdateComponent(nextState, nextProps) {
  //   // 如果是受控模式，必须是外部value改变才作出渲染
  //   const isChange = this.isControl ? JSON.stringify(this.props) !== JSON.stringify(nextProps) : JSON.stringify(this.state) !== JSON.stringify(nextState);
  //   return isChange || this.state.isShow !== nextState.isShow;
  // }
  changeValue(value, idx) {
    const {isMultiple} = this.props;
    const selectedValue = this.getValue();

    let nextValue = [];
    if(isMultiple) {
      nextValue = selectedValue || [];
      if(nextValue.indexOf(value) > -1) {
        nextValue = RemoveArrayItem(nextValue, value);
      } else {
        nextValue.push(value);
      }
    } else {
      nextValue = [value];
    }

    this.changeEvent(nextValue, {prevVal: value, idx});
  }
  getValueArray(values = this.props.values) {
    return Array.isArray(values) ? values : this.wrapObjValToArr(values);
  }
  wrapObjValToArr(values) {
    return Object.keys(values).map(valKey => ({
      text: values[valKey],
      value: valKey
    }));
  }
  changeEvent(nextValue, ...other) {
    const {isNum, isMultiple} = this.props;
    if(isNum) {
      nextValue.forEach((_, idx) => {
        nextValue[idx] = +_;
      });
    }
    let emitVal = isMultiple ? nextValue : nextValue[0];
    this.emitChange(emitVal, ...other);

    if(IsFunc(this.onChangeValue)) {
      this.onChangeValue(emitVal, ...other);
    } else {
      this.setState({
        selectedValue: nextValue,
      });
    }
  }
  emitChange(...args) {
    CallFunc(this.props.onChange)(...args);
  }
  selectAll() {
    this.changeEvent(Object.keys(this.props.values));
  }
  checkIsSelectedAll() {
    const selectedValue = this.getValue();
    return !!this.values && !!selectedValue && (this.values.length == selectedValue.length);
  }
  getValue() {
    // return this.state.selectedValue;
    return this.isControl ? this.props.value : this.state.selectedValue;
  }
}
SelectorBasic.propTypes = {
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
