import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { Call, DateFormat, GenerteID } from 'basic-helper';
import Flatpickr from '../../libs/flatpickr';
import '../../libs/flatpickr-zh';

import DateBasic from './date-basic';

import { Icon } from '../icon';

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
    enableTime: PropTypes.bool,
    /** 类型 */
    mode: PropTypes.string,
    /** 是否输出字符串格式，默认为原生 Date 对象 */
    outputAsString: PropTypes.bool,
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
    // clickToClose: true,
    enableTime: false,
    outputAsString: false,
    mode: 'single',
    lang: 'zh',
    defaultTimes: ['00:00:00', '23:59:59'],
  };
  _refs = {};
  dateFormat = 'YYYY-MM-DD';
  timeFormat = 'hh:mm:ss';
  constructor(props) {
    super(props);
    const {value, defaultValue, needTime} = this.props;

    this.isControl = props.hasOwnProperty('value');

    let defaultVal = value || defaultValue;
    this.value = defaultVal;
    this.datepicker = null;
    this._id = GenerteID();
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
  }
  initPicker() {
    const { mode, needTime, enableTime, lang, defaultTimes, onChange, ...others } = this.props;

    this.datepicker = new Flatpickr(this._refs[this._id], {
      ...others,
      enableTime: enableTime,
      time_24hr: true,
      dateFormat: 'Y-m-d' + (enableTime ? ' H:i:S' : ''),
      disableMobile: true,
      // enableSeconds: true,
      onChange: (rangeValues, dateStr, instance) => {
        if(instance.isOpen) return;
        let emitVal = [...rangeValues];
        if(mode === 'single' && Array.isArray(emitVal)) emitVal = rangeValues[0];
        this.changeDate(emitVal);
      },
      locale: lang,
      // wrap: true,
      mode,
      // allowInput: true,
      defaultDate: this.value
    });
  }
  changeDate(val) {
    const id = this._id;
    /** 继承 DateBasic 获取的 emitChangeValue 统一处理过滤并广播的 value 接口 */
    const emitVal = this.emitChangeValue(val);
    this.value = emitVal;
    this._refs[id].blur && this._refs[id].blur();
  }
  render() {
    return (
      <div className="flatpickr">
        <input
          type="text"
          className="form-control input-sm"
          id={this._id}
          ref={e => this._refs[this._id] = e}
          // onChange={e => this.changeDate()}
        />
        <Icon n="date" data-toggle
          onClick={e => {
            (this.datepicker ? this.datepicker.toggle : function(){})();
          }}/>
      </div>
    );
  }
}
