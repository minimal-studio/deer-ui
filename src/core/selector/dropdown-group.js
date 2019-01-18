import React from 'react';
import PropTypes from "prop-types";
import { RemoveArrayItem } from 'basic-helper';

import SelectorBasic from './selector';
import Radio from './radio';
import DropdownWrapper from './dropdown-wrapper';

export default class MultipleSelector extends SelectorBasic {
  static propTypes = {
    /** group data */
    groupData: PropTypes.shape({
      title: PropTypes.string,
      values: PropTypes.object
    }),
    /** 用于匹配对应字段 */
    fieldMapper: PropTypes.shape({
      title: PropTypes.string,
      values: PropTypes.string,
    }),
    /** defaultValue */
    defaultValue: PropTypes.arrayOf(PropTypes.any)
  }
  static defaultProps = {
    isMultiple: true,
    defaultValue: [],
    fieldMapper: {
      title: 'title',
      values: 'values',
    },
  }
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: props.defaultValue || []
    };
  }
  checkIsSelectedInGroup(groupVal) {
    const selectedValue = this.getValue();
    let isPass = true;
    groupVal.forEach(val => {
      if(selectedValue.indexOf(val) == -1) isPass = false;
    });
    return isPass;
  }
  changeGroup(vals) {
    const selectedValue = this.getValue();
    let nextValues = [...selectedValue];
    vals.forEach(val => {
      if(nextValues.indexOf(val) == -1) {
        nextValues.push(val);
      } else {
        nextValues = RemoveArrayItem(nextValues, val);
      }
    });
    this.changeEvent(nextValues);
  }
  /**
   * 获取组中 values 和 value 的交集
   * @param {array} groupValues 目标 values
   */
  getGroupActiveVal(groupValues) {
    const selectedValue = this.getValue();
    let valueActive = [];
    for (const item of selectedValue) {
      if(groupValues.indexOf(item) !== -1) {
        valueActive.push(item);
      }
    }
    return valueActive;
  }
  /**
   * 获取组中 values 和 value 的差集
   * @param {array} groupValues 目标 values
   */
  getGroupPlanVal(groupValues) {
    const selectedValue = this.getValue();
    let valuePlan = [];
    for (const item of groupValues) {
      if(selectedValue.indexOf(item) === -1) {
        valuePlan.push(item);
      }
    }
    return valuePlan;
  }
  itemFilter = (item) => {
    if(!item) return;
    const { fieldMapper } = this.props;
    const { title, values } = fieldMapper;
    return {
      ...item,
      title: item[title],
      values: item[values],
    };
  }
  handleChange() {}
  render() {
    const { groupData } = this.props;

    return (
      <DropdownWrapper>
        {
          (helper) => {
            return (
              <div className="multiple-selector p10" style={{width: 400}}>
                {
                  Object.keys(groupData).map((valueKey, idx) => {
                    const currItem = groupData[valueKey];
                    const { title, values } = this.itemFilter(currItem);
                    const subValues = values;
                    const subValuesGroup = Object.keys(subValues);
                    const isActiveGroup = this.checkIsSelectedInGroup(subValuesGroup);
                    const valueActive = this.getGroupActiveVal(subValuesGroup);

                    return (
                      <div key={valueKey} 
                        className={"item-group" + (isActiveGroup ? ' active' : '')}>
                        <div className="title _btn"
                          onClick={e => {
                            this.changeGroup(subValuesGroup);
                          }}>
                          {title}
                        </div>
                        <Radio
                          isMultiple
                          onChange={(val, options) => {
                            let _val = val;
                            if(val.length == 0) {
                              _val = valueActive;
                            } else if(val.length == subValuesGroup.length) {
                              _val = this.getGroupPlanVal(subValuesGroup);
                            }
                            if(options) {
                              const { removeItem, addVal, preVal } = options;
                              // if(preVal.length > 0) _val = preVal;
                              if(removeItem) _val = removeItem;
                              if(addVal) _val = addVal;
                            }
                            this.changeGroup(_val);
                          }}
                          value={valueActive}
                          values={subValues} />
                      </div>
                    );
                  })
                }
              </div>
            );
          }
        }
      </DropdownWrapper>
    );
  }
}