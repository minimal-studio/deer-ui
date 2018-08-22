import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {CallFunc, DateFormat, GetDefaultDateInfo} from 'basic-helper';

import {SubContent} from '../sub-content';

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

export default class DatepickerHelper extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    dateHelperInfo: PropTypes.array,
    needTime: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this.state = {
      activeIdx: null,
    };
    this.value = {};

    const {needTime = true} = props;

    var basicFormat = 'YYYY-MM-DD';
    // var timeFormat = 'hh:ss:mm';
    var timeDefaultStr = needTime ? [' 00:00:00', ' 23:59:59'] : [];
    // var format = basicFormat + (needTime ? (' ' + timeFormat) : '');

    this.defaultDateHelperInfo = [
      {
        filter() {
          return [];
        },
        t: '清空'
      },
      {
        filter() {
          return GetDefaultDateInfo(0, 0, undefined, timeDefaultStr);
        },
        t: '今天'
      }, {
        filter() {
          return GetDefaultDateInfo(1, -1, undefined, timeDefaultStr);
        },
        t: '昨天'
      }, {
        filter() {
          return getHalfMouthDate('up', basicFormat, timeDefaultStr);
        },
        t: '前半月'
      }, {
        filter() {
          return getHalfMouthDate('down', basicFormat, timeDefaultStr);
        },
        t: '后半月'
      }
    ];
  }
  generateDate(itemConfig, idx) {
    const {start, end} = itemConfig;
    const {activeIdx} = this.state;
    const {onClick} = this.props;

    let dateInfo = itemConfig.filter();
    // Object.keys(dateInfo).forEach(item => dateInfo[item] = dateInfo[item]);

    this.value = dateInfo;

   CallFunc(onClick)(dateInfo);
    this.setState({
      activeIdx: idx
    });
  }
  render() {
    const {activeIdx} = this.state;
    const {dateHelperInfo} = this.props;
    const _dateHelperInfo = !!dateHelperInfo && dateHelperInfo.length > 0 ? dateHelperInfo : this.defaultDateHelperInfo;

    return (
      <div className="date-helper-group">
        <SubContent displayElem={'快捷'}>
          <div className="date-helper">
            {
              _dateHelperInfo.map((item, idx) => {
                let text = item.t;
                return (
                  <span className={(idx == activeIdx ? 'active ' : '') + "date-helper-btn"}
                    onClick={e => this.generateDate(item, idx)} key={idx}>
                    {text}
                  </span>
                )
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
    )
  }
}
