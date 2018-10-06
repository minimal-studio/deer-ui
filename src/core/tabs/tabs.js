import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IsFunc } from 'basic-helper';

export default class Tabs extends PureComponent {
  static propTypes = {
    inRow: PropTypes.bool,
    withContent: PropTypes.bool,
    closeabled: PropTypes.bool,
    stepMode: PropTypes.bool,
    children: PropTypes.any,
    height: PropTypes.string,
    activeTabIdx: PropTypes.number,
    defaultTab: PropTypes.number,
    className: PropTypes.string,
    onChangeTab: PropTypes.func,
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
    const { onChangeTab } = this.props;
    if(IsFunc(onChangeTab)) onChangeTab(tapIdx);
  }
  getTabContents() {
    const {
      children, height, 
      inRow, withContent, closeabled,
      onClose
    } = this.props;
    const { activeTabIdx } = this.state;

    let tabs = [];
    let tabContents = [];

    React.Children.map(children, (tabChild, idx) => {
      if(!tabChild || typeof tabChild.type !== 'function') return;
      const isActive = (idx === activeTabIdx);
      let { contentClass, labelClass = '' } = tabChild.props;
      let _labelClass = 'tab ' + labelClass + (isActive ? ' active' : '');
      _labelClass += tabChild.props.atRight ? ' right' : '';


      const _tabContent = withContent || (!withContent && isActive) ? (
        <div
          className={"tab-content " + (contentClass) + (isActive ? '' : ' hide')}
          key={tabChild.key || "tab-con-" + idx}
          style={height ? {height} : {}}>
          {tabChild.props.children || null}
        </div>
      ) : undefined;

      if(!inRow || withContent) tabContents.push(_tabContent);

      const _con = inRow ? _tabContent : null;

      const _tab = (
        <div key={"tab-" + idx} className={_labelClass}>
          <span onClick={e => this.onTapTab(idx)}>
            {tabChild}
          </span>
          {
            closeabled ? (
              <span className="close-btn" onClick={e => onClose(idx)}>x</span>
            ) : null
          }
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
    const {tabs, tabContents} = this.getTabContents();

    return (
      <div className={className + (inRow ? ' in-row' : '' + (withContent ? ' common-mode' : ''))}>
        <div className="tab-group">
          {tabs}
        </div>
        {inRow ? null : tabContents}
      </div>
    );
  }
}
