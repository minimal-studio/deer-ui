import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { CallFunc, Call } from 'basic-helper';
import {
  Tabs, Tab, Loading, TipPanel, Icon,
  ShowGlobalModal, CloseGlobalModal
} from '..';

import { UkeComponent } from '../uke-basic';

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
    };
    this.extendsDOM = [];
    this.activeItems = [];
  }
  componentDidMount() {
  }
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
      let nextState = [...selectedIndexMap];
      nextState.splice(foldIdx + 1);
      nextState[foldIdx] = activeIdx;
      return {
        selectedIndexMap: nextState
      };
    });
  }
  getAllSet = (initDataList) => {
    this.extendsDOM = [];
    this.activeItems = [];
    if (!initDataList || !Array.isArray(initDataList)) return;
    const { gm } = this;
    const { selectedIndexMap } = this.state;
    let foldIdx = 0;
    let result = [];
    const recursive = (currSelectedIdx, currDataList) => {
      let currDOMSets = [];
      const nextSelectedIdx = currSelectedIdx + 1;
      const activeItemIdx = selectedIndexMap[currSelectedIdx];
      currDataList.forEach((item, currDataIdx) => {
        if(!item) return;
        const isActive = activeItemIdx === currDataIdx;
        let _item = this.itemMapFilter(item);
        let { child, title, code, icon } = _item;
        let key = code + title;
        let hasChildren = child && child.length > 0;

        let currFoldIdx = foldIdx;

        ++foldIdx;
        let dom = null;
        if(isActive) this.activeItems.push(_item);
        if (hasChildren && isActive) {
          let childDOM = recursive.call(this, nextSelectedIdx, currDataList[activeItemIdx].child);
          this.extendsDOM.unshift(childDOM);
        }
        dom = (
          <div key={foldIdx} className="folder">
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
  render() {
    const { data, selectedIndexMap } = this.props;
    console.log(this.extendsDOM);

    return (
      <div className="uke-link-selector">
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
        <div className="selected-items">
          {
            this.activeItems.map(item => {
              const { code, title } = item;
              return (
                <span key={code + title}>
                  {title}{' > '}
                </span>
              );
            })
          }
        </div>
      </div>
    );
  }
}
