import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import {CallFunc, DateFormat} from 'basic-helper';
import Flatpickr from './flatpickr';
import './zh';

import Icon from '../icon';

export default class DatetimePicker extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    defaultValue: PropTypes.any,
    needTime: PropTypes.bool,
    clickToClose: PropTypes.bool,
    mode: PropTypes.string,
    value: PropTypes.any
  };
  static defaultProps = {
    needTime: true,
    mode: 'single',
    lang: 'zh',
  };
  constructor(props) {
    super(props);
    const {value, defaultValue, needTime} = this.props;

    this.dateFormater = 'YYYY-MM-DD' + (needTime ? ' hh:mm:ss' : '');

    let defaultVal = value || defaultValue;
    this.value = defaultVal;
    this.datepicker = null;
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
    const {id, mode, needTime, clickToClose = true, lang} = this.props;

    this.datepicker = new Flatpickr(this.refs[id], {
      enableTime: needTime,
      time_24hr: true,
      dateFormat: 'Y-m-d' + (needTime ? ' H:i:S' : ''),
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
    if(!!this.datepicker) this.datepicker.destroy();
  }
  changeDate(val) {
    const {id, onChange} = this.props;
    this.value = DateFormat(Date.parse(this.refs[id].value), this.dateFormater);
    this.refs[id].blur && this.refs[id].blur()
    CallFunc(onChange)(val);
  }
  render() {
    const {id} = this.props;

    return (
      <div className="flatpickr">
        <input
          type="text"
          className="form-control input-sm"
          id={id}
          ref={id}
          onChange={e => this.changeDate()}/>
        <Icon type="date" data-toggle onClick={this.datepicker ? this.datepicker.toggle : function(){}}/>
      </div>
    )
  }
}
