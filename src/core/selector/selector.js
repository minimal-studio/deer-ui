import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, RemoveArrayItem, IsFunc, HasValue } from 'basic-helper';
import { UkeComponent, UkePureComponent } from '../uke-utils';
import FormControlBasic from '../form-control/form-control-basic';

export const selectorValuesType = PropTypes.oneOfType([
  PropTypes.shape({
    value: PropTypes.any,
    text: PropTypes.any
  }),
  PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.any,
      value: PropTypes.any
    })
  )
]);

const checkValuesIsEqual = (value1, value2) => {
  if(!value1 || !value2) return true;
  let res;
  if(Array.isArray(value1)) {
    res = value1.length === value2.length;
  } else {
    const valObj1 = Object.keys(value1);
    const valObj2 = Object.keys(value2);
    if(valObj1.length !== valObj2.length) {
      res = false;
    } else {
      res = JSON.stringify(valObj1) === JSON.stringify(valObj2);
    }
  }
  return res;
};

export default class SelectorBasic extends FormControlBasic {
  static propTypes = {
    values: selectorValuesType.isRequired,
    defaultValue: PropTypes.any,
    className: PropTypes.string,
    value: PropTypes.any,
    isNum: PropTypes.bool,
    isMultiple: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func
  };
  constructor(props) {
    super(props);

    const { value, defaultValue } = props;

    // 受控模式, 详情请查看 react control form
    // selectedValue = [...values];
    // value 结构: ['values.value']
    this.value = this.toArr(HasValue(value) ? value : defaultValue);
    this.state = {
      selectedValue: this.value,
    };

    this.wrapValues();
  }
  
  shouldComponentUpdate(nextProps, prevState) {
    /** 当 values 发生改变时，重新计算 this.values, 并且清空 value */
    if(!checkValuesIsEqual(this.props.values, nextProps.values)) {
      this.wrapValues(nextProps.values);
      this.changeValue();
    }
    return true;
  }
  
  toArr(target) {
    if(!HasValue(target)) return target;
    return Array.isArray(target) ? target : [target];
  }
  changeValue = (value, idx) => {
    const { isNum, isMultiple } = this.props;
    if(isNum) value = +value;
    if(HasValue(value)) {
      const selectedValue = this.getValue();
      let nextValue = [];
      let targetVal = value;
      let removeItem;
      let addVal;

      if(isMultiple) {
        nextValue = selectedValue ? [...selectedValue] : [];
        const valueIdx = nextValue.indexOf(value);
        if(valueIdx > -1) {
          removeItem = nextValue.splice(valueIdx, 1);
          // nextValue = RemoveArrayItem(nextValue, value);
        } else {
          nextValue.push(value);
          addVal = [value];
        }
      } else {
        nextValue = [value];
        addVal = value;
      }
      this.changeEvent(nextValue, {prevVal: selectedValue, idx, removeItem, addVal, targetVal});
    } else {
      this.emitChange();
    }
  }
  wrapValues(values = this.props.values) {
    let isArrayValues = Array.isArray(values);
    this.values = isArrayValues ? values : this.wrapObjValToArr(values);
    this.valuesObj = isArrayValues ? this.wrapArrayValToObj(values) : values;
    return {
      valArr: this.values,
      valObj: this.valuesObj
    };
  }
  wrapObjValToArr(values) {
    if(!values) return {};
    const { isNum } = this.props;
    return Object.keys(values).map(valKey => ({
      text: values[valKey],
      value: isNum ? +valKey : valKey
    }));
  }
  wrapArrayValToObj(values) {
    let result = {};
    values.forEach(val => {
      result[val.value] = val.text;
    });
    return result;
  }
  /**
   * 选择器统一的更改 value 接口，会自动根据自身是否受控组件来更改
   * @param {*} nextValue 下一个 value
   * @param  {...any} other 
   */
  changeEvent = (nextValue, ...other) => {
    const { isNum, isMultiple } = this.props;
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
      this.value = nextValue;
    }
  }
  emitChange = (...args) => {
    Call(this.props.onChange, ...args);
  }
  selectAll() {
    this.changeEvent(Object.keys(this.props.values), {preVal: this.getValue()});
  }
  clearAll() {
    this.changeEvent([], {preVal: this.getValue()});
  }
  checkIsSelectedAll() {
    const selectedValue = this.getValue();
    return !!this.values && !!selectedValue && (this.values.length == selectedValue.length);
  }
}
