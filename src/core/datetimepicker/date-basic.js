import React from 'react';
import PropTypes from 'prop-types';
import { Call, DateFormat } from 'basic-helper';
import { ToUTC } from 'basic-helper/datetime-helper';

import { UkePureComponent } from '../uke-utils';

export default class DateBaisc extends UkePureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    /** 是否需要时分秒 */
    needTime: PropTypes.bool,
    /** 是否转换成标准 UTC 时间 */
    toUTC: PropTypes.bool,
    /** 默认的时分秒的值 */
    defaultTimes: PropTypes.arrayOf(PropTypes.string),
    /** 是否输出字符串格式，默认为原生 Date 对象 */
    outputAsString: PropTypes.bool,
  };
  emitChangeValue(val) {
    /** 统一处理过滤所有的 value 格式 */
    const {
      needTime, enableTime, outputAsString, defaultTimes,
      toUTC = true, onChange
    } = this.props;

    /** 确保只有一个值的时候的时分秒为 23:59:59 */
    let emitVal = Array.isArray(val) ? val : [null, val];
    let resVal = [];
    emitVal.forEach((_val, idx) => {
      if(!_val) return;
      let resDate;
      if(enableTime) {
        resDate = DateFormat(_val, `${this.dateFormat} ${this.timeFormat}`);
      } else {
        resDate = DateFormat(_val, this.dateFormat) + (needTime ? ' ' + defaultTimes[idx] : '');
      }
      if(!outputAsString) {
        if(toUTC) {
          resDate = ToUTC(resDate);
        }
      }
      resVal.push(resDate);
    });
    resVal = resVal.length === 1 ? resVal[0] : resVal;

    Call(onChange, resVal);

    return resVal;
  }
}