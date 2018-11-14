import React from 'react';
import PropTypes from 'prop-types';
import { Call, DateFormat } from 'basic-helper';

import { UkePureComponent } from '../uke-basic';

export default class DateBaisc extends UkePureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    /** 是否需要时分秒 */
    needTime: PropTypes.bool,
    /** 默认的时分秒的值 */
    defaultTimes: PropTypes.arrayOf(PropTypes.string),
    /** 是否输出字符串格式，默认为原生 Date 对象 */
    outputAsString: PropTypes.bool,
  };
  emitChangeValue(val) {
    /** 统一处理过滤所有的 value 格式 */
    const { needTime, outputAsString, defaultTimes, onChange } = this.props;

    let emitVal = Array.isArray(val) ? val : [val];
    
    emitVal = emitVal.map((_val, idx) => {
      let res = DateFormat(_val, this.dateFormat) + (needTime ? ' ' + defaultTimes[idx] : '');
      return outputAsString ? res : new Date(res);
    });

    Call(onChange, emitVal);

    return emitVal;
  }
}