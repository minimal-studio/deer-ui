import React, { Component } from 'react';
import { CallFunc } from 'basic-helper';
import classnames from 'classnames';
import Tab from './tab';
import { ToolTip } from '../tooltip';
import { Children } from '../utils/props';

export interface TabsProps {
  /** children */
  children: JSX.Element | JSX.Element[];
  /** tab 内容与 tab 标签是否在同一行 */
  inRow?: boolean;
  /** 是否只渲染 content */
  onlyContent?: boolean;
  /** tab 内容与 tab 标签是否共存 */
  withContent?: boolean;
  /** tab 可否关闭 */
  closeable?: boolean;
  /** 是否启用 step 分步模式 */
  stepMode?: boolean;
  /** 关闭组件的提示 */
  closeTip?: Children;
  /** tab 内容的高度 */
  height?: number | string;
  /** 当前激活的 idx，如果设置了，则为受控组件 */
  activeTabIdx?: number;
  /** 初始化是的默认 tab 位置 */
  defaultTab?: number;
  /** className */
  className?: string;
  /** tabs container 的 tabsClassName */
  tabsClassName?: string;
  /** tab 改变时的回调 */
  onChangeTab?: (idx?: number) => void;
  /** tab 关闭时的回调 */
  onClose?: (closedTabIdx) => void;
}

interface State {
  activeTabIdx: number;
}

/**
 * 提供多种不同 Tab 切换方式与模版
 *
 * @export
 * @class Tabs
 * @extends {PureComponent}
 */
export default class Tabs extends Component<TabsProps, State> {
  /**
   * Tab 的引用
   *
   * @static
   * @memberof Tabs
   * @public
   */
  static Tab = Tab;

  static defaultProps = {
    inRow: false,
    withContent: false,
    onlyContent: false,
    closeable: false,
  }

  isControl

  constructor(props) {
    super(props);
    this.state = {
      activeTabIdx: props.activeTabIdx || props.defaultTab || 0
    };

    this.isControl = props.hasOwnProperty('activeTabIdx');
  }

  getActiveIdx() {
    return this.isControl ? this.props.activeTabIdx : this.state.activeTabIdx;
  }

  // componentDidMount() {
  //   this.setDefaultTabIdx(this.props);
  // }
  // setDefaultTabIdx(nextProps) {
  //   const {activeTabIdx = 0} = nextProps;
  //   this.setState({
  //     activeTabIdx: activeTabIdx
  //   });
  // }
  _onChangeTab(tabIdx) {
    const activeTabIdx = this.getActiveIdx();
    if (activeTabIdx === tabIdx) return;
    this.setState({
      activeTabIdx: tabIdx
    });
  }

  onTapTab(tapIdx) {
    if (!this.isControl) this._onChangeTab(tapIdx);
    const { onChangeTab } = this.props;
    CallFunc(onChangeTab)(tapIdx);
    // if(IsFunc(onChangeTab)) onChangeTab(tapIdx);
  }

  getTabContents() {
    const {
      children, height,
      inRow, withContent, closeable, closeTip,
      onClose
    } = this.props;
    const activeTabIdx = this.getActiveIdx();

    const tabs: any[] = [];
    const tabContents: any[] = [];

    React.Children.map(children, (tabChild: JSX.Element, idx) => {
      if (!tabChild || typeof tabChild.type !== 'function') return;
      const isActive = (idx === activeTabIdx);
      const tabKey = tabChild.key;
      const {
        contentClass = '', labelClass = '', atRight, label
      } = tabChild.props;
      let _labelClass = `tab ${labelClass}${isActive ? ' active' : ''}`;
      _labelClass += atRight ? ' right' : '';

      const _tabContent = withContent || (!withContent && isActive) ? (
        <div
          className={`tab-content ${contentClass}${isActive ? '' : ' hide'}`}
          key={tabKey || `tab-con-${idx}`}
          style={height ? { height } : {}}>
          {
            tabChild.props.children
          }
        </div>
      ) : null;

      if (!inRow || withContent) tabContents.push(_tabContent);

      const _con = inRow ? _tabContent : null;

      const _tab = (
        <div key={tabKey || label}
          className={_labelClass}
          draggable>
          <span onClick={e => this.onTapTab(idx)}>
            {tabChild}
          </span>
          {
            closeable && (
              <ToolTip
                className="_close-btn"
                title={closeTip}
                clickToClose
                onClick={e => onClose && onClose(idx)}>
                x
              </ToolTip>
            )
          }
          {/* <span className="close-btn" onClick={e => onClose(idx)}>x</span> */}
          {_con}
        </div>
      );
      tabs.push(_tab);
    });

    return {
      tabs, tabContents
    };
  }

  render() {
    const {
      tabsClassName = 'tabs-container',
      className,
      inRow, withContent, onlyContent
    } = this.props;

    const { tabs, tabContents } = this.getTabContents();
    const classes = classnames(
      tabsClassName,
      className,
      inRow && 'in-row',
      withContent && 'common-mode'
    );

    return (
      <div className={classes}>
        {
          !onlyContent && (
            <div className="tab-group">
              {tabs}
            </div>
          )
        }
        {inRow ? null : tabContents}
      </div>
    );
  }
}
