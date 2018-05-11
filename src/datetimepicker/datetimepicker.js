import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class DatetimePicker extends PureComponent {
  constructor(props) {
    super(props);
    const {value, defaultValue, needTime = true} = this.props;

    this.DATETIME_FORMAT = 'YYYY-MM-DD' + (needTime ? ' hh:mm:ss' : '');

    let defaultVal = value || defaultValue;
    this.value = +(defaultVal) ? $GH.DateFormat(defaultVal, this.DATETIME_FORMAT) : defaultVal;
    this.datepicker = null;
    this.state = {
      datetime: this.value
    };
  }
  componentDidMount() {
    setTimeout(this.initPicker.bind(this), 50);
  }
  initPicker() {
    const {Flatpickr} = window;
    if(!Flatpickr) return;
    let self = this;
    const {id, mode = 'single', needTime = false, clickToClose = true} = this.props;

    this.datepicker = new Flatpickr(this.refs[id], {
      enableTime: needTime,
      time_24hr: true,
      dateFormat: 'Y-m-d' + (needTime ? ' H:i:S' : ''),
      disableMobile: true,
      enableSeconds: true,
      onChange: (val) => {
        this.changeDate();
        if(clickToClose) this.datepicker.close();
      },
      // locale: "zh",
      // wrap: true,
      mode: 'single',
      // allowInput: true,
      defaultDate: this.value
    })
  }
  componentWillUnmount() {
    if(!!this.datepicker) this.datepicker.destroy();
  }
  changeDate() {
    const {id, onChange} = this.props;
    this.value = $GH.DateFormat(Date.parse(this.refs[id].value), this.DATETIME_FORMAT);
    this.setState({
      datetime: this.value
    }, () => {
      this.refs[id].blur && this.refs[id].blur()
    });
   $GH.CallFunc(onChange)(this.value);
  }

  render() {
    const {datetime} = this.state;
    const {id, value = datetime} = this.props;

    return (
      <div className="flatpickr">
        <input
          type="text"
          className="form-control input-sm"
          id={id}
          ref={id}
          value={value}
          onChange={e => this.changeDate()}/>
        <span className={$UK.getIcon('date', 'icon')} data-toggle onClick={this.datepicker ? this.datepicker.toggle : function(){}}></span>
      </div>
    )
  }
}
DatetimePicker.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  defaultValue: PropTypes.any,
  needTime: PropTypes.bool,
  clickToClose: PropTypes.bool,
  mode: PropTypes.string,
  value: PropTypes.any
};
