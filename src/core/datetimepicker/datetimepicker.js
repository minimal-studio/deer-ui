import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { Call, DateFormat, UUID } from 'basic-helper';
import Flatpickr from 'flatpickr';

// import Flatpickr from '../../libs/flatpickr';
import '../../libs/flatpickr-zh';
import DateBasic from './date-basic';
import { Icon } from '../icon';
import { PopoverEntity } from '../popover';

/**
 * 基于 Flatpickr 的时间控件，样式可以根据喜好选择
 *
 * @export
 * @class DatetimePicker
 * @extends {DateBasic}
 */
export default class DatetimePicker extends DateBasic {
  static propTypes = {
    onChange: PropTypes.func,
    /** 是否需要时分秒 */
    needTime: PropTypes.bool,
    /** 默认的时分秒的值 */
    defaultTimes: PropTypes.arrayOf(PropTypes.string),
    /** 是否转换成标准 UTC 时间 */
    toUTC: PropTypes.bool,
    /** 是否可以选择时分秒 */
    // enableTime: PropTypes.bool,
    /** 类型 */
    mode: PropTypes.string,
    /** 是否输出字符串格式，默认为原生 Date 对象 */
    outputAsString: PropTypes.bool,
    /** 是否允许用户输入 */
    allowInput: PropTypes.bool,
    /** 语言 */
    lang: PropTypes.string,
    /** 默认值 */
    defaultValue: PropTypes.any,
    /** 受控控件的值 */
    value: PropTypes.any
  };
  static defaultProps = {
    needTime: true,
    toUTC: true,
    allowInput: true,
    // clickToClose: true,
    // enableTime: false,
    outputAsString: false,
    mode: 'single',
    lang: 'zh',
    defaultTimes: ['00:00:00', '23:59:59'],
  };
  _refs = {};
  datepicker = null;
  constructor(props) {
    super(props);
    const { value, defaultValue } = this.props;

    this.isControl = props.hasOwnProperty('value');

    let defaultVal = value || defaultValue;
    this.value = defaultVal;
    this._id = UUID();

    this.popTipEntity = new PopoverEntity({
      id: this._id,
    });
  }
  componentDidMount() {
    // setTimeout(this.initPicker.bind(this), 50);
    this.initPicker();
  }
  componentDidUpdate(prevProps) {
    if(JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.datepicker.setDate(this.props.value, false);
    }
  }
  componentWillUnmount() {
    if(this.datepicker) this.datepicker.destroy();
    this.popTipEntity.close();
    this.popTipEntity = this._id = null;
  }
  handleInputError = (inputElem, isError) => {
    inputElem.classList.toggle('error', isError);
    isError ? this.popTipEntity.show({
      elem: inputElem,
      props: {
        type: 'red',
        position: 'bottom',
        // showCloseBtn: false,
      },
      children: (
        <div className="p10">
          输入时间有误，请检查
        </div>
      )
    }) : this.popTipEntity.close();
  }
  getInputValAsync = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getDateRangeFromInput());
      }, 50);
    });
  }
  getDateRangeFromInput = () => {
    const { defaultTimes, needTime, mode } = this.props;
    const isRange = mode === 'range';
    // const expectLen = isRange ? 2 : 1;
    const rangeSeparator = this.datepicker.l10n.rangeSeparator;
    const inputElem = this._refs[this._id];
    const inputVal = inputElem.value;
    /** 如果没有任何值，则没有下一步 */
    if(!inputVal) return;
  
    let valueRange = inputVal.split(rangeSeparator).filter(i => !!i);
    let valueRangeLen = valueRange.length;
    if(isRange && needTime && valueRangeLen === 1) {
      /** 
       * 只选了一天的特殊处理, 给需要时间的添加后缀
       * 把后面的日期加上，
       * 并且改变输入框显示的值 */
      valueRange[1] = DateFormat(valueRange[0], 'YYYY-MM-DD') + (needTime ? ' ' + defaultTimes[1] : '');
      this.datepicker.setDate(valueRange, false);
      valueRangeLen = valueRange.length;
    }
    // if(valueRange !== expectLen) return null;
    const dateRange = (() => {
      let res = [], isValid = true;
      for (let i = 0; i < valueRangeLen; i++) {
        const targetDate = new Date(valueRange[i]);
        const isValidDate = !isNaN(targetDate.getTime());
        if(isValidDate) {
          res.push(targetDate);
        } else {
          isValid = false;
        }
      }
      this.handleInputError(inputElem, !isValid);
      return res;
    })();
    return dateRange;
  }
  handleChange = async (rangeValues, dateStr, instance) => {
    const {
      mode, 
      // enableTime
    } = this.props;
    // if(!enableTime && instance.isOpen) return;

    /** 用定时器确保值的准确性 */
    const dateRange = await this.getInputValAsync();
    if(!dateRange) return;

    const valueLen = dateRange.length;
    let emitVal = [...dateRange];
    if(mode === 'single' && Array.isArray(emitVal)) {
      emitVal = dateRange[0];
      this.changeDate(emitVal);
    } else if(mode === 'range') {
      // if(valueLen === 2) {
      // }
      this.changeDate(emitVal);
    }
  }
  initPicker = () => {
    const {
      mode, needTime, lang, allowInput, 
      // enableTime,
      defaultTimes, onChange, ...others
    } = this.props;

    this.datepicker = new Flatpickr(this._refs[this._id], {
      ...others,
      /** 自带的时分秒选择不符合实际要求 */
      enableTime: false,
      time_24hr: true,
      dateFormat: 'Y-m-d' + (needTime ? ' H:i:S' : ''),
      disableMobile: true,
      defaultDate: this.value,
      defaultHour: 0,
      enableSeconds: false,
      locale: lang,
      mode,
      // wrap: true,
      allowInput,
      // onChange: (rangeValues, dateStr, instance) => {
      onClose: this.handleChange
      // onChange: this.handleChange
    });
  }
  changeDate = (val) => {
    const id = this._id;
    /** 继承 DateBasic 获取的 emitChangeValue 统一处理过滤并广播的 value 接口 */
    const emitVal = this.emitChangeValue(val);
    this.value = emitVal;
    this._refs[id].blur && this._refs[id].blur();
  }
  render() {
    return (
      <div className="flatpickr uke-input-group">
        <input
          type="text"
          className="form-control input-sm"
          id={this._id}
          ref={e => this._refs[this._id] = e}/>
        <span className="input-addon"
          onClick={e => {
            this.datepicker ? this.datepicker.toggle() : null;
          }}>
          <Icon n="date"/>
        </span>
      </div>
    );
  }
}
