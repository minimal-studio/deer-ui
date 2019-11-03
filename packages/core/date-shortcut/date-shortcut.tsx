import React from 'react';
import { Call, DateFormat } from '@mini-code/base-func';
import { DateRange, ToUTC } from '@mini-code/base-func/datetime-helper';
import { $T_IN } from '@dear-ui/utils';

import { DropdownWrapper } from '../dropdown-wrapper';
import { DateBasic, DateBasicProps } from '../date-basic';

export interface DateShortcutProps extends DateBasicProps {
  /** 点击快捷方式的回调 */
  onClick?: (res) => void;
  /** onChange */
  onChange: DateBasicProps['onChange'];
  /** 默认的时分秒的值 */
  defaultTimes?: string[];
  /** 自定义的时间快捷选项 */
  dateHelperInfo?: {
    t: string;
    filter: (args) => string[];
  }[];
  /** subContent 的位置 */
  position: 'right' | 'left';
  /** DateShortcut 的 style */
  style: {};
}

function getHalfMouthDate(type, format, timeDefaultStr) {
  const today = new Date();
  const currYear = today.getFullYear();
  const currMonth = today.getMonth();
  const dayInMouth = new Date(currYear, currMonth + 1, 0);
  const lastDay = dayInMouth.getDate();
  const [s = '', e = ''] = timeDefaultStr;

  const upStartDate = DateFormat(new Date(currYear, currMonth, 1), format) + s;
  const upEndDate = DateFormat(new Date(currYear, currMonth, 15), format) + e;
  const downStartDate = DateFormat(new Date(currYear, currMonth, 16), format) + s;
  const downEndDate = DateFormat(new Date(currYear, currMonth, lastDay), format) + e;

  let result: string[] = [];
  switch (type) {
    case 'up':
      result = [ToUTC(upStartDate), ToUTC(upEndDate)];
      break;
    case 'down':
      result = [ToUTC(downStartDate), ToUTC(downEndDate)];
      break;
  }

  return result;
}

/**
 * 独立的快捷时间选择器
 *
 * @export
 * @class DateShortcut
 * @extends {DateBasic}
 */
export class DateShortcut extends DateBasic<DateShortcutProps, {
  activeIdx: number;
}> {
  static defaultProps = {
    needTime: true,
    toUTC: true,
    position: 'left',
    outputAsString: false,
    defaultTimes: ['00:00:00', '23:59:59'],
  };

  defaultDateHelperInfo

  value = {}

  constructor(props) {
    super(props);
    this.state = {
      activeIdx: -1,
    };

    const { needTime } = props;

    const basicFormat = 'YYYY-MM-DD';
    // const timeFormat = 'hh:ss:mm';
    const timeDefaultStr = needTime ? [' 00:00:00', ' 23:59:59'] : [];
    // const format = basicFormat + (needTime ? (' ' + timeFormat) : '');
    const dateRangeOptions = { extendFormat: timeDefaultStr };

    this.defaultDateHelperInfo = [];
  }

  generateDate(itemConfig, idx) {
    const { onClick } = this.props;

    const dateInfo = itemConfig.filter();
    const emitRes = this.emitChangeValue(dateInfo);
    this.value = emitRes;

    Call(onClick, emitRes);

    this.setState({
      activeIdx: idx
    });
  }

  render() {
    const { activeIdx } = this.state;
    const { dateHelperInfo, style, position } = this.props;
    const _dateHelperInfo = !!dateHelperInfo && dateHelperInfo.length > 0
      ? dateHelperInfo : this.defaultDateHelperInfo;

    return (
      <DropdownWrapper
        outside
        trigger="hover"
        position={position}
        overlay={({ hide }) => (
          <div className="date-shortcut" style={style}>
            <div className="wrapper">
              {
                _dateHelperInfo.map((item, idx) => {
                  const text = item.t;
                  return (
                    <span className={`action-btn${idx === activeIdx ? ' active' : ''}`}
                      onClick={(e) => {
                        hide();
                        this.generateDate(item, idx);
                      }} key={text}>
                      {$T_IN(text)}
                    </span>
                  );
                })
              }
            </div>
          </div>
        )}>
        {this.$T_IN('快捷')}
      </DropdownWrapper>
    );
  }
}
