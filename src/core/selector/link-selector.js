import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { CallFunc, Call } from 'basic-helper';
import DropdownWrapper from './dropdown-wrapper';
import {
  Icon,
} from '..';

import { UkeComponent } from '../uke-utils';

export default class LinkSelector extends UkeComponent {
  static propTypes = {
    /** data 的具体 key 的 mapper */
    mappers: PropTypes.shape({
      child: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
    }),
    /** 总数据，可以通过 child 无限递归 */
    data: PropTypes.arrayOf(
      PropTypes.shape({})
    ).isRequired,
    onChange: PropTypes.func
  };
  static defaultProps = {
    mappers: {
      child: 'child',
      code: 'code',
      title: 'title',
      icon: 'icon',
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      /** 递归结构选中的索引 */
      selectedIndexMap: [
        // 0, 1, 0
      ],
      selectedItems: []
    };
    this.extendsDOM = [];
    this.activeItems = [];
  }
  // componentDidUpdate() {
  //   this.dropWrapper && this.dropWrapper.updateNodeRef();
  // }
  itemMapFilter = (item) => {
    const { mappers } = this.props;
    const { child, code, title, icon } = mappers;
    return {
      ...item,
      child: item[child],
      code: item[code],
      title: item[title],
      icon: item[icon],
    };
  }
  getMenuLinkerDOM = (options) => {
    const { code, key, to, onClick, menuText, icon } = options;
    const { gm } = this;
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
        {gm(menuText)}
      </div>
    );
  };
  selectItem = (foldIdx, activeIdx) => {
    this.setState(({ selectedIndexMap }) => {
      const { data } = this.props;
      let nextIndexMap = [...selectedIndexMap];
      let nextActiveGroup = [];
      nextIndexMap.splice(foldIdx + 1);
      nextIndexMap[foldIdx] = activeIdx;

      const recursive = (currDataGroup, level) => {
        const idx = nextIndexMap[level];
        const currData = currDataGroup[idx];
        if(!currData) return;
        let item = this.itemMapFilter(currData);
        let { child } = item;
        nextActiveGroup.push(item);
        if(child && level < nextIndexMap.length) recursive(child, level + 1);
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
      let currDOMSets = [];
      const nextSelectedIdx = currSelectedIdx + 1;
      const activeItemIdx = selectedIndexMap[currSelectedIdx];
      currDataList.forEach((item, currDataIdx) => {
        if(!item) return;
        const isActive = activeItemIdx === currDataIdx;
        let _item = this.itemMapFilter(item);
        let { child, title, code, icon } = _item;
        let hasChildren = child && child.length > 0;

        let dom = null;
        if(isActive) this.activeItems.push(_item);
        if (hasChildren && isActive) {
          let childDOM = recursive.call(this, nextSelectedIdx, currDataList[activeItemIdx].child);
          this.extendsDOM.unshift(childDOM);
        }
        dom = (
          <div key={currDataIdx} className={"folder" + (isActive ? ' active' : '')}>
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
    let res = this.gm('请选择');
    const { selectedItems } = this.state;
    console.log(selectedItems);
    if(selectedItems.length > 0) {
      res = (
        <div>
          {
            selectedItems.map((item, idx) => {
              const { code, title } = item;
              const isLastest = idx == selectedItems.length - 1;
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
    return res;
  }
  saveDropWrapper = e => {
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
        overlay={(helper) => {
          return (
            <div className="uke-link-selector" style={{width: 400}}>
              <div className="items">
                <div className="wrapper">
                  {
                    this.getAllSet(data)
                  }
                </div>
                {
                  [...this.extendsDOM].map((item, idx) => {
                    return (
                      <div className="wrapper" key={idx}>
                        {item}
                      </div>
                    );
                  })
                }
              </div>
            </div>
          );
        }} />
    );
  }
}
