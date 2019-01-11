import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon } from '../../core/icon';

const Tree = (({ level, treeData, parentNode, activeLevel, selectedItems, itemFilter, onCheck, onToggle }) => {
  return (
    <div className="node-item">
      <div>
        {
          treeData.map(item => {
            const { title, id, child } = itemFilter(item);
            const hasChild = Array.isArray(child) && child.length > 0;
            const levelId = id;
            let isLevelActive = activeLevel[levelId];
            if(typeof isLevelActive == 'undefined') isLevelActive = true;
            return (
              <div key={id}
                className={"list-item" + (isLevelActive ? ' active' : '') + (!hasChild ? ' no-child' : '')}>
                <span className={"func-btn" + (!hasChild ? ' disabled' : '')}
                  onClick={e => {
                    hasChild && onToggle(levelId, !isLevelActive);
                  }}>
                  <Icon
                    n={hasChild ? !isLevelActive ? 'plus' : 'minus' : 'circle'}
                    s={hasChild ? 's' : "r"} />
                </span>
                <span>
                  <input className="check-item" type="checkbox"
                    onChange={(e) => {
                      onCheck(item, parentNode);
                    }}
                    checked={!!selectedItems[id]} />
                  <span>
                    {title}
                  </span>
                </span>
                <div className="children">
                  {
                    hasChild && (
                      <Tree
                        treeData={child}
                        parentNode={item}
                        selectedItems={selectedItems} 
                        activeLevel={activeLevel} 
                        onToggle={onToggle} 
                        itemFilter={itemFilter} 
                        onCheck={onCheck} 
                        level={level + 1}/>
                    )
                  }
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
});

export default class TreeList extends Component {
  static propTypes = {
    /** 树结构数据 */
    treeData: PropTypes.arrayOf(
      PropTypes.shape({
        child: PropTypes.array,
        title: PropTypes.string.isRequired,
        value: PropTypes.any,
        id: PropTypes.any,
      })
    ),
    /** 用于匹配对应字段 */
    fieldMapper: PropTypes.shape({
      child: PropTypes.string,
      title: PropTypes.string,
      value: PropTypes.string,
      id: PropTypes.string,
    })
  }
  static defaultProps = {
    fieldMapper: {
      child: 'child',
      title: 'title',
      value: 'value',
      id: 'id',
    }
  }
  state = {
    activeLevel: {},
    selectedItems: {}
  };
  itemFilter = (item) => {
    const { fieldMapper } = this.props;
    const { child, value, title, id } = fieldMapper;
    return {
      ...item,
      child: item[child],
      value: item[value],
      title: item[title],
      id: item[id],
    };
  }
  getChildIDs = (targetNode, value) => {
    let res = {};
    const recuresive = (item) => {
      if(item) {
        for (let i = 0; i < item.length; i++) {
          const _item = item[i];
          const { child, id } = this.itemFilter(_item);
          res[id] = value;
          if(Array.isArray(child)) recuresive(child);
        }
      }
    };
    recuresive(targetNode);
    return res;
  }
  onCheck = (targetNode, parentNode) => {
    const { child, id } = this.itemFilter(targetNode);
    parentNode = this.itemFilter(parentNode);
    const parentChildren = parentNode.child || [];
    const parentChildrenLen = parentChildren.length;
    this.setState(({ selectedItems }) => {
      let nextState = {...selectedItems};
      nextState[id] = !nextState[id];

      /** 检查父节点的所有 child 是否都选中了 */
      let activeChildCount = 0;
      for (let i = 0; i < parentChildrenLen; i++) {
        const childItem = this.itemFilter(parentChildren[i]);
        if(nextState[childItem.id]) activeChildCount ++;
      }
      if(activeChildCount === parentChildrenLen) nextState[parentNode.id] = true;
      
      let IDs = this.getChildIDs(child, nextState[id]);
      Object.assign(nextState, IDs);
      return {
        selectedItems: nextState
      };
    });
  }
  onToggle = (levelId, nextActiveState) => {
    this.setState(({ activeLevel }) => {
      const nextState = {...activeLevel};
      nextState[levelId] = nextActiveState;
      return {
        activeLevel: nextState
      };
    });
  }
  render() {
    const { treeData } = this.props;
    const { selectedItems, activeLevel } = this.state;
    return (
      <div className="uke-treelist">
        <Tree
          treeData={treeData}
          activeLevel={activeLevel}
          itemFilter={this.itemFilter}
          onToggle={this.onToggle}
          onCheck={this.onCheck}
          level={0}
          selectedItems={selectedItems} />
      </div>
    );
  }
}