import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, DateFormat, GetDefaultDateInfo } from 'basic-helper';

import { SubContent } from '../sub-content';
import { UkeComponent, UkePureComponent } from '../uke-basic';

function getHalfMouthDate(type, format, timeDefaultStr) {
  var today = new Date();
  var currYear = today.getFullYear().toString();
  var currMonth = today.getMonth();
  var dayInMouth = new Date(currYear, currMonth + 1, 0);
  var lastDay = dayInMouth.getDate();
  var [s = '', e = ''] = timeDefaultStr;

  var upStartDate = DateFormat(new Date(currYear, currMonth, 1), format) + s;
  var upEndDate = DateFormat(new Date(currYear, currMonth, 15), format) + e;
  var downStartDate = DateFormat(new Date(currYear, currMonth, 16), format) + s;
  var downEndDate = DateFormat(new Date(currYear, currMonth, lastDay), format) + e;

  let result = [];
  switch (type) {
  case 'up':
    result = [upStartDate, upEndDate];
    break;
  case 'down':
    result = [downStartDate, downEndDate];
    break;
  }

  return result;
}

/**
 * 独立的快捷时间选择器
 *
 * @export
 * @class DateShortcut
 * @extends {PureComponent}
 */
export default class DateShortcut extends UkePureComponent {
  static propTypes = {
    /** 点击快捷方式的回调 */
    onClick: PropTypes.func.isRequired,
    /** 自定义的时间快捷选项 */
    dateHelperInfo: PropTypes.arrayOf(
      PropTypes.shape({
        /** 快捷的名字 */
        t: PropTypes.string,
        /** 
         * 获取返回值的函数，期望返回已格式化的日期数组
         * 
         * @returns {array[]} 例如 ['2018-10-10 10:00:00', '2018-10-11 10:00:00']
         */
        filter: PropTypes.func
      })
    ),
    style: PropTypes.object,
    /** 是否返回时间 */
    needTime: PropTypes.bool
  };
  static defaultProps = {
    needTime: true,
  };
  constructor(props) {
    super(props);
    this.state = {
      activeIdx: null,
    };
    this.value = {};

    const { needTime } = props;

    const basicFormat = 'YYYY-MM-DD';
    // const timeFormat = 'hh:ss:mm';
    const timeDefaultStr = needTime ? [' 00:00:00', ' 23:59:59'] : [];
    // const format = basicFormat + (needTime ? (' ' + timeFormat) : '');
    const gm = this.gm;

    this.defaultDateHelperInfo = [
      {
        filter() {
          return [];
        },
        t: gm('清空')
      },
      {
        filter() {
          return GetDefaultDateInfo(0, 0, undefined, timeDefaultStr);
        },
        t: gm('今天')
      }, {
        filter() {
          return GetDefaultDateInfo(1, -1, undefined, timeDefaultStr);
        },
        t: gm('昨天')
      }, {
        filter() {
          return getHalfMouthDate('up', basicFormat, timeDefaultStr);
        },
        t: gm('前半月')
      }, {
        filter() {
          return getHalfMouthDate('down', basicFormat, timeDefaultStr);
        },
        t: gm('后半月')
      }
    ];
  }
  generateDate(itemConfig, idx) {
    const {onClick} = this.props;

    const dateInfo = itemConfig.filter();
    this.value = dateInfo;

    Call(onClick, dateInfo);
    this.setState({
      activeIdx: idx
    });
  }
  render() {
    const {activeIdx} = this.state;
    const { dateHelperInfo, style } = this.props;
    const _dateHelperInfo = !!dateHelperInfo && dateHelperInfo.length > 0 ? dateHelperInfo : this.defaultDateHelperInfo;
    const gm = this.gm;

    return (
      <div className="date-helper-group" style={style}>
        <SubContent displayElem={gm('快捷')}>
          <div className="date-helper">
            {
              _dateHelperInfo.map((item, idx) => {
                const text = item.t;
                return (
                  <span className={(idx == activeIdx ? 'active ' : '') + "date-helper-btn"}
                    onClick={e => this.generateDate(item, idx)} key={text}>
                    {text}
                  </span>
                );
              })
            }
          </div>
        </SubContent>
        {/* <div className="hide-container">
          <span>快捷</span>
          <div className="hide-content">
            
          </div>
        </div> */}
      </div>
    );
  }
}
