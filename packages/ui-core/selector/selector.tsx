/* eslint-disable no-param-reassign */
import React, { Component, PureComponent } from 'react';
import {
  Call, RemoveArrayItem, IsFunc, HasValue
} from 'basic-helper';
import FormControlBasic from '../form-control/form-control-basic';

export interface SelectorValueItem {
  value: any;
  text: any;
}

export type SelectorValuesDescription = {
  /** value 为显示的 title */
  [value: string]: any;
} | SelectorValueItem[];

export interface SelectorBasicProps {
  /** Selector 的基本要素 */
  values?: SelectorValuesDescription;
  /** 默认值 */
  defaultValue?: any;
  /** 与 React 受控组件行为一致，详情请参考 react 受控控件 https://reactjs.org/docs/forms.html */
  value?: any;
  /** className */
  className?: string;
  /** 是否输出 number 类型 */
  isNum?: boolean;
  /** 是否可以多选 */
  isMultiple?: boolean;
  /** style */
  style?: React.CSSProperties;
  /** onChange callback */
  onChange?: (...args) => void;
}

export interface SelectorBasicState {
  selectedValue: any;
}

const checkValuesIsEqual = (value1, value2) => {
  if (!value1 || !value2) return true;
  let res;
  if (Array.isArray(value1)) {
    res = value1.length === value2.length;
  } else {
    const valObj1 = Object.keys(value1);
    const valObj2 = Object.keys(value2);
    if (valObj1.length !== valObj2.length) {
      res = false;
    } else {
      res = JSON.stringify(valObj1) === JSON.stringify(valObj2);
    }
  }
  return res;
};

const toArr = (target) => {
  if (!HasValue(target)) return target;
  return Array.isArray(target) ? target : [target];
};

export default class SelectorBasic<
  P extends SelectorBasicProps, S = SelectorBasicState, SS = {}
> extends FormControlBasic<P, S & SelectorBasicState, SS> {
  values;

  valuesObj;

  onChangeValue;

  state

  constructor(props) {
    super(props);

    const { value, defaultValue } = props;

    // 受控模式, 详情请查看 react control form
    // selectedValue = [...values];
    // value 结构: ['values.value']
    this.value = toArr(HasValue(value) ? value : defaultValue);
    this.state = {
      selectedValue: this.value,
    };

    this.wrapValues();
  }

  shouldComponentUpdate(nextProps, prevState) {
    /** 当 values 发生改变时，重新计算 this.values, 并且清空 value */
    if (!checkValuesIsEqual(this.props.values, nextProps.values)) {
      this.wrapValues(nextProps.values);
      this.changeValue();
    }
    return true;
  }

  changeValue = (value?, idx?) => {
    let _val = value;
    const { isNum, isMultiple } = this.props;
    if (isNum) _val = +_val;
    if (HasValue(_val)) {
      const selectedValue = this.getValue();
      let nextValue: typeof selectedValue[] = [];
      const targetVal = _val;
      let removeItem;
      let addVal;

      if (isMultiple) {
        nextValue = Array.isArray(selectedValue) ? [...selectedValue] : [];
        const valueIdx = nextValue.indexOf(_val);
        if (valueIdx > -1) {
          removeItem = nextValue.splice(valueIdx, 1);
          // nextValue = RemoveArrayItem(nextValue, _val);
        } else {
          nextValue.push(_val);
          addVal = [_val];
        }
      } else {
        nextValue = [_val];
        addVal = _val;
      }
      this.changeEvent(nextValue, {
        prevVal: selectedValue, idx, removeItem, addVal, targetVal
      });
    } else {
      this.emitChange();
    }
  }

  wrapValues(values = this.props.values) {
    const isArrayValues = Array.isArray(values);
    this.values = isArrayValues ? values : this.wrapObjValToArr(values);
    this.valuesObj = isArrayValues ? this.wrapArrayValToObj(values) : values;
    return {
      valArr: this.values,
      valObj: this.valuesObj
    };
  }

  wrapObjValToArr(values) {
    if (!values) return {};
    const { isNum } = this.props;
    return Object.keys(values).map(valKey => ({
      text: values[valKey],
      value: isNum ? +valKey : valKey
    }));
  }

  wrapArrayValToObj = (values) => {
    const result = {};
    values.forEach((val) => {
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
    if (isNum) {
      nextValue.forEach((item, idx) => {
        nextValue[idx] = +item;
      });
    }
    const emitVal = isMultiple ? nextValue : nextValue[0];
    this.emitChange(emitVal, ...other);

    if (IsFunc(this.onChangeValue)) {
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
    const { values = {} } = this.props;
    this.changeEvent(Object.keys(values), { preVal: this.getValue() });
  }

  clearAll() {
    this.changeEvent([], { preVal: this.getValue() });
  }

  checkIsSelectedAll() {
    const selectedValue = this.getValue();
    return !!this.values && !!selectedValue && (this.values.length === selectedValue.length);
  }
}
