import React, { Component } from "react";
import PropTypes from "prop-types";
import { Call } from "basic-helper";
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
                    checked={selectedItems.hasOwnProperty(id)} />
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
        active: PropTypes.any,
        id: PropTypes.any,
      })
    ),
    /** 用于匹配对应字段 */
    fieldMapper: PropTypes.shape({
      child: PropTypes.string,
      title: PropTypes.string,
      active: PropTypes.string,
      value: PropTypes.any,
      id: PropTypes.string,
    }),
    defaultValue: PropTypes.shape({}),
    onChange: PropTypes.func
  }
  static defaultProps = {
    fieldMapper: {
      child: 'child',
      title: 'title',
      active: 'active',
      value: 'value',
      id: 'id',
    },
    defaultValue: {}
  }
  constructor(props) {
    super(props);

    this.state = {
      activeLevel: {},
      selectedItems: props.defaultValue
    };
  }
  componentDidMount() {
    this.getDefaultActiveItems();
  }
  getDefaultActiveItems = () => {
    let res = {};
    const recuresive = (item) => {
      if(item) {
        for (let i = 0; i < item.length; i++) {
          const _item = item[i];
          const { child, active } = this.itemFilter(_item);
          if(active) {
            this.onCheck(_item);
          } else if(Array.isArray(child)) recuresive(child);
        }
      }
    };
    recuresive(this.props.treeData);
    return res;
  }
  itemFilter = (item) => {
    if(!item) return;
    const { fieldMapper } = this.props;
    const { child, value, title, id, active } = fieldMapper;
    return {
      ...item,
      child: item[child],
      value: item[value],
      active: item[active],
      title: item[title],
      id: item[id],
    };
  }
  getChildIDs = (targetNode) => {
    let res = {};
    const recuresive = (item) => {
      if(item) {
        for (let i = 0; i < item.length; i++) {
          const _item = item[i];
          const { child, id, value } = this.itemFilter(_item);
          res[id] = value;
          if(Array.isArray(child)) recuresive(child);
        }
      }
    };
    recuresive(targetNode);
    return res;
  }
  onCheck = (targetNode, parentNode) => {
    const { onChange } = this.props;
    const { child, id, value } = this.itemFilter(targetNode);
    this.setState(({ selectedItems }) => {
      let nextState = {...selectedItems};
      let IDs = this.getChildIDs(child);
      const isNextNeedCheck = !nextState.hasOwnProperty(id);
      if(!isNextNeedCheck) {
        delete nextState[id];
        for (const key in IDs) {
          if (IDs.hasOwnProperty(key)) {
            delete nextState[key];
            delete IDs[key];
          }
        }
      } else {
        nextState[id] = value;
      }

      /** 检查父节点的所有 child 是否都选中了 */
      if(parentNode) {
        parentNode = this.itemFilter(parentNode);
        const parentChildren = parentNode.child || [];
        const parentChildrenLen = parentChildren.length;
        let activeChildCount = 0;
        for (let i = 0; i < parentChildrenLen; i++) {
          const childItem = this.itemFilter(parentChildren[i]);
          if(nextState.hasOwnProperty(childItem.id)) activeChildCount ++;
        }
        if(activeChildCount === parentChildrenLen) {
          nextState[parentNode.id] = parentNode.value;
        } else {
          delete nextState[parentNode.id];
        }
      }
      
      Object.assign(nextState, IDs);
      Call(onChange, nextState);
      this.selectedItems = nextState;
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