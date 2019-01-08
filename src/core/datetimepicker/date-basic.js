import React from 'react';
import PropTypes from 'prop-types';
import { Call, DateFormat } from 'basic-helper';

import { UkePureComponent } from '../uke-utils';

export default class DateBaisc extends UkePureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    /** 是否需要时分秒 */
    needTime: PropTypes.bool,
    /** 是否 toISOString */
    toISOString: PropTypes.bool,
    /** 是否添加时区的 */
    addTimeOffset: PropTypes.bool,
    /** 默认的时分秒的值 */
    defaultTimes: PropTypes.arrayOf(PropTypes.string),
    /** 是否输出字符串格式，默认为原生 Date 对象 */
    outputAsString: PropTypes.bool,
  };
  timeZoneOffset = new Date().getTimezoneOffset();
  emitChangeValue(val) {
    /** 统一处理过滤所有的 value 格式 */
    const {
      needTime, enableTime, outputAsString, defaultTimes,
      toISOString = true, addTimeOffset = true, onChange
    } = this.props;


    /** 确保只有一个值的时候的时分秒为 23:59:59 */
    let emitVal = Array.isArray(val) ? val : [null, val];
    let resVal = [];
    if(enableTime) {
      resVal = emitVal;
    } else {
    
      emitVal.forEach((_val, idx) => {
        if(!_val) return;
        let res = DateFormat(_val, this.dateFormat) + (needTime ? ' ' + defaultTimes[idx] : '');
        if(!outputAsString) {
          res = new Date(res);
          if(toISOString) {
            if(addTimeOffset) {
              res.setHours(res.getHours() + Math.abs(this.timeZoneOffset / 60));
            }
            res = (new Date(res)).toISOString();
          }
        }
        resVal.push(res);
      });
  
      resVal = resVal.length === 1 ? resVal[0] : resVal;
    }

    Call(onChange, resVal);

    return resVal;
  }
}