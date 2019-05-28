import React from 'react';
import PropTypes from "prop-types";
import { RemoveArrayItem } from 'basic-helper';

import SelectorBasic from './selector';
import Checkbox from './checkbox';
import DropdownWrapper from './dropdown-wrapper';

export default class DropdownGroup extends SelectorBasic {
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
    /** style */
    style: PropTypes.object,
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

    const { defaultValue } = props;
    let selectedCount = this.calculateCount(defaultValue);

    this.state = {
      selectedValue: defaultValue || {},
      selectedCount
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
  calculateCount(group) {
    let selectedCount = 0;
    if(!group) return selectedCount;
    for (const key in group) {
      if (group.hasOwnProperty(key)) {
        const item = group[key];
        if(Array.isArray(item)) selectedCount += item.length;
      }
    }
    return selectedCount;
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
        selectedValue: nextValues,
        selectedCount: this.calculateCount(nextValues)
      };
    });
  }
  changeValue = (groupKey, value) => {
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
        selectedValue: nextValues,
        selectedCount: this.calculateCount(nextValues)
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
  getTitle = () => {
    return `${this.state.selectedCount}${this.gm('项已选')}`;
  }
  handleChange() {}
  render() {
    const { groupData, style, ...other } = this.props;
    const groupDataArr = Object.keys(groupData);

    return (
      <DropdownWrapper {...other} overlay={(helper) => {
        const selectedValue = this.getValue();
        return (
          <div className="dropdown-group p10" style={style}>
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
      }}>
        {
          this.getTitle()
        }
      </DropdownWrapper>
    );
  }
}