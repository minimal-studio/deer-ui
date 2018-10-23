import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, DateFormat, GetDefaultDateInfo } from 'basic-helper';

import { SubContent } from '../sub-content';

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
 * @class DatepickerHelper
 * @extends {PureComponent}
 */
export default class DatepickerHelper extends PureComponent {
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

    let basicFormat = 'YYYY-MM-DD';
    // let timeFormat = 'hh:ss:mm';
    let timeDefaultStr = needTime ? [' 00:00:00', ' 23:59:59'] : [];
    // let format = basicFormat + (needTime ? (' ' + timeFormat) : '');
    let gm = window.$UKE.getUkeKeyMap;

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

    let dateInfo = itemConfig.filter();
    this.value = dateInfo;

    Call(onClick, dateInfo);
    this.setState({
      activeIdx: idx
    });
  }
  render() {
    const {activeIdx} = this.state;
    const {dateHelperInfo} = this.props;
    const _dateHelperInfo = !!dateHelperInfo && dateHelperInfo.length > 0 ? dateHelperInfo : this.defaultDateHelperInfo;
    let gm = window.$UKE.getUkeKeyMap;

    return (
      <div className="date-helper-group">
        <SubContent displayElem={gm('快捷')}>
          <div className="date-helper">
            {
              _dateHelperInfo.map((item, idx) => {
                let text = item.t;
                return (
                  <span className={(idx == activeIdx ? 'active ' : '') + "date-helper-btn"}
                    onClick={e => this.generateDate(item, idx)} key={idx}>
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
