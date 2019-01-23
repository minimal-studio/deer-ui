import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IsFunc, CallFunc } from 'basic-helper';

import Tab from './tab';
import { ToolTip } from '../tooltip';

/**
 * 提供多种不同 Tab 切换方式与模版
 *
 * @export
 * @class Tabs
 * @extends {PureComponent}
 */
export default class Tabs extends Component {
  /**
   * Tab 的引用
   *
   * @static
   * @memberof Tabs
   * @public
   */
  static Tab = Tab;
  static propTypes = {
    /** tab 内容与 tab 标签是否在同一行 */
    inRow: PropTypes.bool,
    /** tab 内容与 tab 标签是否共存 */
    withContent: PropTypes.bool,
    /** tab 可否关闭 */
    closeabled: PropTypes.bool,
    /** 关闭组件的提示 */
    closeTip: PropTypes.any,
    /** 是否启用 step 分步模式 */
    stepMode: PropTypes.bool,
    /** children */
    children: PropTypes.any,
    /** tab 内容的高度 */
    height: PropTypes.string,
    /** 当前激活的 idx，如果设置了，则为受控组件 */
    activeTabIdx: PropTypes.number,
    /** 初始化是的默认 tab 位置 */
    defaultTab: PropTypes.number,
    /** className */
    className: PropTypes.string,
    /** tab 改变时的回调 */
    onChangeTab: PropTypes.func,
    /** tab 关闭时的回调 */
    onClose: PropTypes.func
  };
  static defaultProps = {
    inRow: false,
    withContent: false,
    closeabled: false,
  }
  constructor(props) {
    super(props);
    this.state = {
      activeTabIdx: props.activeTabIdx || props.defaultTab || 0
    };

    this.isControlled = props.hasOwnProperty('activeTabIdx');
  }
  getActiveIdx() {
    return this.isControlled ? this.props.activeTabIdx : this.state.activeTabIdx;
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
    if(activeTabIdx === tabIdx) return;
    this.setState({
      activeTabIdx: tabIdx
    });
  }
  onTapTab(tapIdx) {
    if(!this.isControlled) this._onChangeTab(tapIdx);
    const { onChangeTab } = this.props;
    CallFunc(onChangeTab)(tapIdx);
    // if(IsFunc(onChangeTab)) onChangeTab(tapIdx);
  }
  getTabContents() {
    const {
      children, height, 
      inRow, withContent, closeabled, closeTip,
      onClose
    } = this.props;
    const activeTabIdx = this.getActiveIdx();

    let tabs = [];
    let tabContents = [];

    React.Children.map(children, (tabChild, idx) => {
      if(!tabChild || typeof tabChild.type !== 'function') return;
      const isActive = (idx === activeTabIdx);
      const tabKey = tabChild.key;
      let { contentClass = '', labelClass = '', atRight, label } = tabChild.props;
      let _labelClass = 'tab ' + labelClass + (isActive ? ' active' : '');
      _labelClass += atRight ? ' right' : '';

      const _tabContent = withContent || (!withContent && isActive) ? (
        <div
          className={"tab-content " + (contentClass) + (isActive ? '' : ' hide')}
          key={tabKey || "tab-con-" + idx}
          style={height ? {height} : {}}>
          {
            tabChild.props.children
          }
        </div>
      ) : null;

      if(!inRow || withContent) tabContents.push(_tabContent);

      const _con = inRow ? _tabContent : null;

      const _tab = (
        <div key={tabKey || label}
          className={_labelClass}
          draggable>
          <span onClick={e => this.onTapTab(idx)}>
            {tabChild}
          </span>
          {
            closeabled && (
              <ToolTip className="close-btn" title={closeTip}
                clickToClose
                onClick={e => onClose(idx)}>
                <span>x</span>
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
      className = 'tabs-container',
      inRow, withContent,
    } = this.props;
    const { tabs, tabContents } = this.getTabContents();

    return (
      <div className={className + (inRow ? ' in-row' : '' + (withContent ? ' common-mode' : ''))}>
        <div className="tab-group"
          droppable="true"
          onDragEnd={e => {
            console.log(e)
          }}>
          {tabs}
        </div>
        {inRow ? null : tabContents}
      </div>
    );
  }
}
