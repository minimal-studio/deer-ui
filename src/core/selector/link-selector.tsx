/* eslint-disable consistent-return */
import React from 'react';
import { CallFunc, Call } from 'basic-helper';
import DropdownWrapper from './dropdown-wrapper';
import { Icon } from '../icon';

import { UkeComponent } from '../utils/uke-component';

export interface LinkDataStruct {
  /** ID */
  id: string;
  /** title */
  title: string;
  /** value */
  code: any;
  /** 用于存储子内容 */
  child?: LinkDataStruct[];
}

export interface LinkSelectorProps {
  /** 总数据，可以通过 child 无限递归 */
  data: LinkDataStruct[];
  /** onChange */
  onChange: (changeVal: {}) => void;
  /** data 的具体 key 的 mapper */
  mappers?: {
    child: string;
    code: string;
    title: string;
    icon?: string;
  };
}

interface State {
  selectedIndexMap: number[];
  selectedItems: any[];
}

export default class LinkSelector extends UkeComponent<LinkSelectorProps, State> {
  static defaultProps = {
    mappers: {
      child: 'child',
      code: 'code',
      title: 'title',
      icon: 'icon',
    }
  }

  extendsDOM: any[] = []

  activeItems: any[] = []

  dropWrapper

  constructor(props) {
    super(props);
    this.state = {
      /** 递归结构选中的索引 */
      selectedIndexMap: [
        // 0, 1, 0
      ],
      selectedItems: []
    };
  }

  // componentDidUpdate() {
  //   this.dropWrapper && this.dropWrapper.updateNodeRef();
  // }
  itemMapFilter = (item) => {
    const { mappers } = this.props;
    if (mappers) {
      const {
        child, code, title, icon = ''
      } = mappers;
      return {
        ...item,
        child: item[child],
        code: item[code],
        title: item[title],
        icon: item[icon],
      };
    }
  }

  getMenuLinkerDOM = (options) => {
    const {
      key, onClick, menuText, icon
    } = options;
    return (
      <div
        key={key}
        className="menu"
        onClick={e => Call(onClick, key)}>
        {
          !icon ? (
            <span className="menu-tip">-</span>
          ) : (
            <Icon n={icon} classNames={['mr10']}/>
          )
        }
        {this.$T(menuText)}
      </div>
    );
  };

  selectItem = (foldIdx, activeIdx) => {
    this.setState(({ selectedIndexMap }) => {
      const { data } = this.props;
      const nextIndexMap = [...selectedIndexMap];
      const nextActiveGroup: any[] = [];
      nextIndexMap.splice(foldIdx + 1);
      nextIndexMap[foldIdx] = activeIdx;

      const recursive = (currDataGroup, level) => {
        const idx = nextIndexMap[level];
        const currData = currDataGroup[idx];
        if (!currData) return;
        const item = this.itemMapFilter(currData);
        const { child } = item;
        nextActiveGroup.push(item);
        if (child && level < nextIndexMap.length) recursive(child, level + 1);
      };
      recursive(data, 0);

      return {
        selectedIndexMap: nextIndexMap,
        selectedItems: nextActiveGroup
      };
    });
  }

  getAllSet = (initDataList) => {
    this.extendsDOM = [];
    this.activeItems = [];
    if (!initDataList || !Array.isArray(initDataList)) return;
    const { selectedIndexMap } = this.state;
    const recursive = (currSelectedIdx, currDataList) => {
      const currDOMSets: any[] = [];
      const nextSelectedIdx = currSelectedIdx + 1;
      const activeItemIdx = selectedIndexMap[currSelectedIdx];
      currDataList.forEach((item, currDataIdx) => {
        if (!item) return;
        const isActive = activeItemIdx === currDataIdx;
        const _item = this.itemMapFilter(item);
        const {
          child, title, code, icon
        } = _item;
        const hasChildren = child && child.length > 0;

        if (isActive) this.activeItems.push(_item);
        if (hasChildren && isActive) {
          const childDOM = recursive.call(this, nextSelectedIdx, currDataList[activeItemIdx].child);
          this.extendsDOM.unshift(childDOM);
        }
        const dom = (
          <div key={currDataIdx} className={`folder${isActive ? ' active' : ''}`}>
            <div
              className="fold-title"
              onClick={e => this.selectItem(currSelectedIdx, currDataIdx)}>
              {title}
              {
                hasChildren && (
                  <Icon n="angle-right" />
                )
              }
            </div>
          </div>
        );
        currDOMSets.push(dom);
      });
      return currDOMSets;
    };
    return recursive.call(this, 0, initDataList);
  }

  getSelectedTitle = () => {
    const { selectedItems } = this.state;
    if (selectedItems.length > 0) {
      return (
        <div>
          {
            selectedItems.map((item, idx) => {
              const { code, title } = item;
              const isLastest = idx === selectedItems.length - 1;
              return (
                <span key={code + title}>
                  {title}{!isLastest && ' > '}
                </span>
              );
            })
          }
        </div>
      );
    }
    return this.$T_UKE('请选择');
  }

  saveDropWrapper = (e) => {
    this.dropWrapper = e;
  }

  render() {
    const { data, ...propsForDropWrapper } = this.props;
    const selectedTitle = this.getSelectedTitle();

    return (
      <DropdownWrapper
        ref={this.saveDropWrapper}
        {...propsForDropWrapper}
        menuTitle={selectedTitle}
        overlay={helper => (
          <div className="__link-selector" style={{ width: 400 }}>
            <div className="items">
              <div className="wrapper">
                {
                  this.getAllSet(data)
                }
              </div>
              {
                [...this.extendsDOM].map((item, idx) => (
                  <div className="wrapper" key={idx}>
                    {item}
                  </div>
                ))
              }
            </div>
          </div>
        )} />
    );
  }
}
