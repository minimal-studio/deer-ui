/* eslint-disable no-nested-ternary */
/* eslint-disable no-prototype-builtins */
import React, { Component } from "react";
import { Call } from "basic-helper";
import { Icon } from '../../core/icon';

interface TreeProps {
  level;
  treeData;
  parentNode?;
  activeLevel;
  selectedItems;
  itemFilter;
  onCheck;
  onToggle;
}

const Tree: React.SFC<TreeProps> = (props) => {
  const {
    level, treeData, parentNode, activeLevel,
    selectedItems, itemFilter, onCheck, onToggle
  } = props;
  return (
    <div className="node-item">
      <div>
        {
          treeData.map((item) => {
            const { title, id, child } = itemFilter(item);
            const hasChild = Array.isArray(child) && child.length > 0;
            const levelId = id;
            let isLevelActive = activeLevel[levelId];
            if (typeof isLevelActive == 'undefined') isLevelActive = true;
            return (
              <div key={id}
                className={`list-item${isLevelActive ? ' active' : ''}${!hasChild ? ' no-child' : ''}`}>
                <span className={`func-btn${!hasChild ? ' disabled' : ''}`}
                  onClick={(e) => {
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
};

interface DataItem {
  child?: DataItem[];
  active?: any;
  title: string;
  value: any;
  id: string;
}

interface TreeListProps {
  /** 树结构数据 */
  treeData: DataItem[];
  onChange: (val) => void;
  /** 用于匹配对应字段 */
  fieldMapper?: {
    child: string;
    title: string;
    active: string;
    value: any;
    id: string;
  };
  defaultValue?: {};
}

export default class TreeList extends Component<TreeListProps, {
  activeLevel: {};
  selectedItems: any;
}> {
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

  selectedItems

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
    const res = {};
    const recuresive = (item) => {
      if (item) {
        for (let i = 0; i < item.length; i++) {
          const _item = item[i];
          const { child, active } = this.itemFilter(_item);
          if (active) {
            this.onCheck(_item);
          } else if (Array.isArray(child)) recuresive(child);
        }
      }
    };
    recuresive(this.props.treeData);
    return res;
  }

  itemFilter = (item) => {
    const { fieldMapper } = this.props;
    if (!item || !fieldMapper) return null;
    const {
      child, value, title, id, active
    } = fieldMapper;
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
    const res = {};
    const recuresive = (item) => {
      if (item) {
        for (let i = 0; i < item.length; i++) {
          const _item = item[i];
          const { child, id, value } = this.itemFilter(_item);
          res[id] = value;
          if (Array.isArray(child)) recuresive(child);
        }
      }
    };
    recuresive(targetNode);
    return res;
  }

  onCheck = (targetNode, parentNode?) => {
    const { onChange } = this.props;
    const { child, id, value } = this.itemFilter(targetNode);
    this.setState(({ selectedItems }) => {
      const nextState = { ...selectedItems };
      const IDs = this.getChildIDs(child);
      const isNextNeedCheck = !nextState.hasOwnProperty(id);
      if (!isNextNeedCheck) {
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
      if (parentNode) {
        const nextParentNode = this.itemFilter(parentNode);
        const parentChildren = nextParentNode.child || [];
        const parentChildrenLen = parentChildren.length;
        let activeChildCount = 0;
        for (let i = 0; i < parentChildrenLen; i++) {
          const childItem = this.itemFilter(parentChildren[i]);
          if (nextState.hasOwnProperty(childItem.id)) activeChildCount++;
        }
        if (activeChildCount === parentChildrenLen) {
          nextState[nextParentNode.id] = nextParentNode.value;
        } else {
          delete nextState[nextParentNode.id];
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
      const nextState = { ...activeLevel };
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
      <div className="__treelist">
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
