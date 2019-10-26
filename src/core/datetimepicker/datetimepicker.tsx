/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';

import { Call, DateFormat, UUID } from 'basic-helper';

import { DateBasic, DateBasicProps } from '../date-basic';
import { Icon } from '../icon';
import { PopoverEntity } from '../popover/popover-entity';
import { LoadScript } from '../utils';
import Mandarin from './zh';

let flatpickrCDNUrl = 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.3/dist/flatpickr.min.js';
let isLoadingScript = false;

const loadJSFormCDN = () => {
  return new Promise((resolve) => {
    if (window.flatpickr) {
      // 如果已经加载成功，直接 resolve
      return resolve();
    }
    if (!isLoadingScript) {
      // 如果没有加载，则加载
      isLoadingScript = true;
      LoadScript({
        src: flatpickrCDNUrl
      })
        .then((res) => {
          resolve();
        });
    } else {
      // 如果有在加载中，则等待加载完成在 resolve
      const checkIsLoad = () => {
        if (!window.flatpickr) {
          setTimeout(() => {
            checkIsLoad();
          }, 50);
        } else {
          resolve();
        }
      };
      checkIsLoad();
    }
  });
};

export interface DatetimePickerProps extends DateBasicProps {
  onChange: (changeVal) => void;
  /** 默认的时分秒的值 */
  defaultTimes?: string[];
  /** 日期控件类型 */
  mode?: "single" | "multiple" | "range" | "time";
  /** 是否允许用户输入 */
  allowInput?: boolean;
  /** 语言 */
  lang?: string;
  /** didMount */
  didMount?: () => void;
  /** 默认值 */
  defaultValue?: string[];
  /** 受控控件的值 */
  value?: string[];
}

interface DefaultProps {
  needTime: boolean;
  toUTC: boolean;
  allowInput: boolean;
  outputAsString: boolean;
  mode: string;
  lang: string;
  defaultTimes: string[];
}

/**
 * 基于 Flatpickr 的时间控件，样式可以根据喜好选择
 *
 * @export
 * @class DatetimePicker
 * @extends {DateBasic}
 */
export default class DatetimePicker extends DateBasic<DatetimePickerProps> {
  static setCDNUrl = (url) => {
    flatpickrCDNUrl = url;
  }

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

  datepicker;

  isControl = false;

  value;

  popTipEntity: PopoverEntity

  _id: string = UUID();

  constructor(props) {
    super(props);
    const { value, defaultValue } = this.props;

    this.isControl = props.hasOwnProperty('value');

    const defaultVal = value || defaultValue;
    this.value = defaultVal;

    this.popTipEntity = new PopoverEntity({
      id: this._id,
    });
  }

  componentDidMount() {
    loadJSFormCDN()
      .then(() => {
        this.initPicker();
      });
    Call(this.props.didMount, this.value);
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.datepicker.setDate(this.props.value, false);
    }
  }

  componentWillUnmount() {
    if (this.datepicker) this.datepicker.destroy();
    this.popTipEntity.destroy();
    this._id = '';
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

  getInputValAsync = () => new Promise<Date[] | null>((resolve) => {
    setTimeout(() => {
      resolve(this.getDateRangeFromInput());
    }, 50);
  })

  getDateRangeFromInput = () => {
    const { defaultTimes, needTime, mode } = this.props as DefaultProps;
    const isRange = mode === 'range';
    // const expectLen = isRange ? 2 : 1;
    const { rangeSeparator } = this.datepicker.l10n;
    const inputElem = this._refs[this._id];
    const inputVal = inputElem.value;
    /** 如果没有任何值，则没有下一步 */
    if (!inputVal) return null;

    const valueRange = inputVal.split(rangeSeparator).filter(i => !!i);
    let valueRangeLen = valueRange.length;
    if (isRange && needTime && valueRangeLen === 1) {
      /**
       * 只选了一天的特殊处理, 给需要时间的添加后缀
       * 把后面的日期加上，
       * 并且改变输入框显示的值 */
      valueRange[1] = DateFormat(valueRange[0], 'YYYY-MM-DD') + (needTime ? ` ${defaultTimes[1]}` : '');
      this.datepicker.setDate(valueRange, false);
      valueRangeLen = valueRange.length;
    }
    // if(valueRange !== expectLen) return null;
    const dateRange = (() => {
      const resDataRange: Date[] = [];
      let isValid = true;
      for (let i = 0; i < valueRangeLen; i++) {
        const targetDate = new Date(valueRange[i]);
        const isValidDate = !isNaN(targetDate.getTime());
        if (isValidDate) {
          resDataRange.push(targetDate);
        } else {
          isValid = false;
        }
      }
      this.handleInputError(inputElem, !isValid);
      return resDataRange;
    })();
    return dateRange;
  }

  handleChange = async (rangeValues, dateStr, instance) => {
    const {
      mode,
    } = this.props;

    /** 用定时器确保值的准确性 */
    const dateRange = await this.getInputValAsync();
    if (!dateRange) return;

    if (mode === 'single' && Array.isArray(dateRange)) {
      this.changeDate(dateRange[0]);
    } else if (mode === 'range') {
      this.changeDate(dateRange);
    }
  }

  initPicker = () => {
    if (!window.flatpickr) return console.error(`加载 flatpickr 失败`);
    window.flatpickr.l10ns.zh = Mandarin;
    const {
      mode, needTime, lang, allowInput,
      // enableTime,
      defaultTimes, onChange, ...others
    } = this.props;

    const flatpickrOptions = {
      ...others,
      /** 自带的时分秒选择不符合实际要求 */
      enableTime: false,
      time_24hr: true,
      dateFormat: `Y-m-d${needTime ? ' H:i:S' : ''}`,
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
    };

    this.datepicker = window.flatpickr(this._refs[this._id], flatpickrOptions);
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
      <div className="flatpickr input-group">
        <span className="input-addon"
          onClick={(e) => {
            if (this.datepicker) this.datepicker.toggle();
          }}>
          <Icon n="date"/>
        </span>
        <input
          type="text"
          className="form-control input-sm"
          id={this._id}
          ref={(e) => { this._refs[this._id] = e; }}/>
      </div>
    );
  }
}
