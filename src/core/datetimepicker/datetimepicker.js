import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { Call, DateFormat, GenerteID } from 'basic-helper';
import Flatpickr from '../../libs/flatpickr';
import '../../libs/flatpickr-zh';

import { Icon } from '../icon';

/**
 * 基于 Flatpickr 的时间控件，样式可以根据喜好选择
 *
 * @export
 * @class DatetimePicker
 * @extends {PureComponent}
 */
export default class DatetimePicker extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    /** 是否需要时分秒 */
    needTime: PropTypes.bool,
    // clickToClose: PropTypes.bool,
    /** 是否可以选择时分秒 */
    enableTime: PropTypes.bool,
    /** 类型 */
    mode: PropTypes.string,
    /** 语言 */
    lang: PropTypes.string,
    /** 默认值 */
    defaultValue: PropTypes.any,
    /** 受控控件的值 */
    value: PropTypes.any
  };
  static defaultProps = {
    needTime: true,
    // clickToClose: true,
    enableTime: false,
    mode: 'single',
    lang: 'zh',
  };
  _refs = {};
  constructor(props) {
    super(props);
    const {value, defaultValue, needTime} = this.props;

    this.dateFormater = 'YYYY-MM-DD' + (needTime ? ' hh:mm:ss' : '');

    let defaultVal = value || defaultValue;
    this.value = defaultVal;
    this.datepicker = null;
    this._id = GenerteID();
  }
  componentDidMount() {
    // setTimeout(this.initPicker.bind(this), 50);
    this.initPicker();
  }
  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      this.datepicker.setDate(nextProps.value, false);
    }
  }
  initPicker() {
    const { mode, needTime, enableTime, lang } = this.props;

    this.datepicker = new Flatpickr(this._refs[this._id], {
      enableTime: enableTime,
      time_24hr: true,
      dateFormat: 'Y-m-d' + (enableTime ? ' H:i:S' : ''),
      disableMobile: true,
      // enableSeconds: true,
      onClose: (rangeValues) => {
        let emitVal = rangeValues;
        if(!needTime) emitVal = rangeValues.map(val => DateFormat(val, this.dateFormater));
        if(mode == 'single' && Array.isArray(emitVal)) emitVal = rangeValues[0];
        this.changeDate(emitVal);
        // if(clickToClose) this.datepicker.close();
      },
      locale: lang,
      // wrap: true,
      mode,
      // allowInput: true,
      defaultDate: this.value
    });
  }
  componentWillUnmount() {
    if(this.datepicker) this.datepicker.destroy();
  }
  changeDate(val) {
    const { onChange } = this.props;
    const id = this._id;
    this.value = DateFormat(Date.parse(this._refs[id].value), this.dateFormater);
    this._refs[id].blur && this._refs[id].blur();
    Call(onChange, val);
  }
  render() {
    return (
      <div className="flatpickr">
        <input
          type="text"
          className="form-control input-sm"
          id={this._id}
          ref={e => this._refs[this._id] = e}
          onChange={e => this.changeDate()}/>
        <Icon type="date" data-toggle
          onClick={e => {
            (this.datepicker ? this.datepicker.toggle : function(){})();
          }}/>
      </div>
    );
  }
}
