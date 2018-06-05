import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {IsFunc} from 'basic-helper';

export default class Tabs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIdx: props.activeTabIdx || 0
    };

    this.isControlled = props.hasOwnProperty('activeTabIdx');
  }
  // componentDidMount() {
  //   this.setDefaultTabIdx(this.props);
  // }
  componentWillReceiveProps(nextProps) {
    if(this.isControlled && (this.props.activeTabIdx !== nextProps.activeTabIdx)) {
      this._onChangeTab(nextProps.activeTabIdx);
    }
  }
  // setDefaultTabIdx(nextProps) {
  //   const {activeTabIdx = 0} = nextProps;
  //   this.setState({
  //     activeTabIdx: activeTabIdx
  //   });
  // }
  _onChangeTab(tabIdx) {
    if(this.state.activeTabIdx === tabIdx) return;
    this.setState({
      activeTabIdx: tabIdx
    });
  }
  onTapTab(tapIdx) {
    if(!this.isControlled) this._onChangeTab(tapIdx);
    const {onChangeTab} = this.props;
    if(IsFunc(onChangeTab)) onChangeTab(tapIdx);
  }
  render() {
    const {children, height, className = 'tabs-container', inRow = false, withContent = false} = this.props;
    const {activeTabIdx} = this.state;

    const self = this;
    let tabs = [];
    let tabContents = [];
    React.Children.map(children, (child, idx) => {
      if(!child || typeof child.type !== 'function') return;
      const isActive = (idx === activeTabIdx);
      let contentClass = isActive ? 'tab active' : 'tab';
      contentClass += child.props.atRight ? ' right' : '';

      const _tabContent = withContent || (!withContent && isActive) ? (
        <div className={"tab-content" + (isActive ? '' : ' hide')} key={"tab-con-" + idx}
          style={height ? {height: height} : {}}>
          {React.cloneElement(child.props.children, {})}
        </div>
      ) : undefined;
      if(!inRow || withContent) tabContents.push(_tabContent);

      const _con = inRow ? _tabContent : '';

      const _tabs = (
        <div key={"tab-" + idx} className={contentClass}>
          {React.cloneElement(child, {
            idx,
            onTap: tapIdx => self.onTapTab(tapIdx)
          })}
          {_con}
        </div>
      );
      tabs.push(_tabs);
    });

    return (
      <div className={className + (inRow ? ' in-row' : '')}>
        <div className="tab-group">
          {tabs}
        </div>
        {tabContents}
      </div>
    )
  }
}
Tabs.propTypes = {
  inRow: PropTypes.bool,
  withContent: PropTypes.bool,
  height: PropTypes.string,
  activeTabIdx: PropTypes.number,
  className: PropTypes.string,
  onChangeTab: PropTypes.func
};
