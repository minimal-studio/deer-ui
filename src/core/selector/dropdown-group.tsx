import React from 'react';
import { RemoveArrayItem } from 'basic-helper';

import SelectorBasic, { SelectorValuesDescription, SelectorBasicProps, SelectorBasicState } from './selector';
import Checkbox from './checkbox';
import DropdownWrapper, { DropdownWrapperProps } from './dropdown-wrapper';

export interface DropdownGroupProps extends SelectorBasicProps, DropdownWrapperProps {
  /** group data */
  groupData: {
    [groupID: string]: {
      /** 该 Group 的标题 */
      title: string;
      /** 是否输出 number 类型的值 */
      isNum?: boolean;
      values: SelectorValuesDescription;
    };
  };
  /** 用于匹配对应字段 */
  fieldMapper?: {
    title: string;
    values: string;
  };
  /** style of DropdownGroup */
  style?: React.CSSProperties;
}

interface State extends SelectorBasicState {
  selectedCount: number;
  selectedValue: any;
}

interface DefaultProps {
  isMultiple: boolean;
  defaultValue: {};
  fieldMapper: {
    title: string;
    values: string;
  };
}

export default class DropdownGroup extends SelectorBasic<DropdownGroupProps, State> {
  static defaultProps: DefaultProps = {
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
    const selectedCount = this.calculateCount(defaultValue);

    this.state = {
      ...this.state,
      selectedValue: defaultValue || {},
      selectedCount
    };
  }

  // getValue = () => {
  //   return this.state.selectedValue;
  // }
  numberValFilter(numberValues, groupKey) {
    const { groupData } = this.props;
    if (!groupData[groupKey].isNum) return numberValues;
    const res: number[] = [];
    for (let i = 0; i < numberValues.length; i++) {
      const item = numberValues[i];
      res[i] = +item;
    }
    return res;
  }

  calculateCount = (group) => {
    let selectedCount = 0;
    if (!group) return selectedCount;
    for (const key in group) {
      if (group.hasOwnProperty(key)) {
        const item = group[key];
        if (Array.isArray(item)) selectedCount += item.length;
      }
    }
    return selectedCount;
  }

  changeGroup(groupKey, isNextGroupActive, groupValues) {
    this.setState(({ selectedValue }) => {
      const nextValues = { ...selectedValue };
      if (isNextGroupActive) {
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
      const nextValues = { ...selectedValue };
      let operatorGroup = nextValues[groupKey] ? [...nextValues[groupKey]] : [];
      if (operatorGroup.indexOf(value) !== -1) {
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
    if (!item) return item;
    const { fieldMapper } = this.props as DefaultProps;
    const { title, values } = fieldMapper;
    return {
      ...item,
      title: item[title],
      values: item[values],
    };
  }

  getTitle = (selectedCount) => {
    return `${selectedCount}${this.$T_UKE('项已选')}`;
  }

  render() {
    const {
      groupData, style, outside, ...other
    } = this.props;
    const { selectedCount } = this.state;
    const groupDataArr = Object.keys(groupData);

    return (
      <DropdownWrapper {...other} outside={outside} overlay={(helper) => {
        const selectedValue = this.getValue();
        return (
          <div className="dropdown-group p10" style={style}
            onClick={(e) => {
              /** 阻止 ClickAway 触发回调 */
              if (outside) e.preventDefault();
            }}>
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
                    className={`item-group${isActiveGroup ? ' active' : ''}`}>
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
          this.getTitle(selectedCount)
        }
      </DropdownWrapper>
    );
  }
}
