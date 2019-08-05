import React from 'react';
import { Call, DateFormat } from 'basic-helper';
import { ToUTC } from 'basic-helper/datetime-helper';

import { UkePureComponent } from '../utils/uke-component';

export interface DateBasicProps {
  onChange?: (nextValue) => void;
  /** 是否需要时分秒 */
  needTime?: boolean;
  /** 是否转换成标准 UTC 时间 */
  toUTC?: boolean;
  /** 默认的时分秒的值 */
  defaultTimes?: string[];
  /** 是否输出字符串格式，默认为原生 Date 对象 */
  outputAsString?: boolean;
}

export class DateBasic<
  P extends DateBasicProps, S = {}, SS = {}
> extends UkePureComponent<P, S, SS> {
  dateFormat = 'YYYY-MM-DD';

  timeFormat = 'hh:mm:ss';

  emitChangeValue = (val) => {
    /** 统一处理过滤所有的 value 格式 */
    const {
      needTime, outputAsString,
      toUTC = true, onChange
    } = this.props;

    /** 确保只有一个值的时候的时分秒为 23:59:59 */
    const emitVal = Array.isArray(val) ? val : [null, val];
    const resVal: string[] = [];
    emitVal.forEach((_val, idx) => {
      if (!_val) return;
      let resDate = DateFormat(
        _val,
        needTime ? `${this.dateFormat} ${this.timeFormat}` : this.dateFormat
      );
      if (!outputAsString) {
        if (toUTC) {
          resDate = ToUTC(resDate);
        }
      }
      resVal.push(resDate);
    });

    const emitResVal = resVal.length === 1 ? resVal[0] : resVal;

    Call(onChange, emitResVal);

    return emitResVal;
  }
}
