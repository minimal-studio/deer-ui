import React from 'react';
import PropTypes from "prop-types";
import { RemoveArrayItem } from 'basic-helper';

import SelectorBasic from './selector';
import Checkbox from './checkbox';
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
    defaultValue: PropTypes.object,
  }
  static defaultProps = {
    isMultiple: true,
    defaultValue: {},
    fieldMapper: {
      title: 'title',
      values: 'values',
    },
  }
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: props.defaultValue || {}
    };
  }
  // getValue = () => {
  //   return this.state.selectedValue;
  // }
  numberValFilter(numberValues, groupKey) {
    const { groupData } = this.props;
    if(!groupData[groupKey].isNum) return numberValues;
    let res = [];
    for (let i = 0; i < numberValues.length; i++) {
      const item = numberValues[i];
      res[i] = +item;
    }
    return res;
  }
  changeGroup(groupKey, isNextGroupActive, groupValues) {
    this.setState(({ selectedValue }) => {
      let nextValues = {...selectedValue};
      if(isNextGroupActive) {
        nextValues[groupKey] = this.numberValFilter([...groupValues], groupKey);
      } else {
        nextValues[groupKey] = [];
      }
      this.emitChange(nextValues);
      return {
        selectedValue: nextValues
      };
    });
  }
  changeValue(groupKey, value) {
    const { groupData } = this.props;
    this.setState(({ selectedValue }) => {
      let nextValues = {...selectedValue};
      let operatorGroup = nextValues[groupKey] ? [...nextValues[groupKey]] : [];
      if(operatorGroup.indexOf(value) != -1) {
        operatorGroup = RemoveArrayItem(operatorGroup, value);
      } else {
        operatorGroup.push(value);
      }
      nextValues[groupKey] = this.numberValFilter(operatorGroup, groupKey);
      this.emitChange(nextValues);
      return {
        selectedValue: nextValues
      };
    });
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
    const groupDataArr = Object.keys(groupData);

    return (
      <DropdownWrapper>
        {
          (helper) => {
            const selectedValue = this.getValue();
            return (
              <div className="multiple-selector p10" style={{width: 400}}>
                {
                  groupDataArr.map((groupKey, idx) => {
                    const currItem = groupData[groupKey];
                    const { title, values, isNum } = this.itemFilter(currItem);
                    const subValues = values;
                    const subValuesGroup = Object.keys(subValues);
                    const valueActive = selectedValue[groupKey];
                    const isActiveGroup = valueActive && valueActive.length === subValuesGroup.length;
                    const isLastGroup = idx === groupDataArr.length - 1;

                    return (
                      <div key={groupKey} 
                        className={"item-group" + (isActiveGroup ? ' active' : '')}>
                        <Checkbox
                          values={{
                            1: title,
                          }}
                          value={isActiveGroup}
                          isMultiple={false}
                          onChange={() => this.changeGroup(groupKey, !isActiveGroup, subValuesGroup)} />
                        <Checkbox
                          onChange={(val, options) => {
                            const { targetVal } = options;
                            this.changeValue(groupKey, targetVal);
                          }}
                          isNum={isNum}
                          value={valueActive}
                          values={subValues} />
                        {!isLastGroup && <hr />}
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