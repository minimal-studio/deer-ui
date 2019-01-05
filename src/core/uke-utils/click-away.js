/* eslint-disable react/no-find-dom-node */

import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import { UUID } from 'basic-helper';

// let Nodes = {};
// const handleClick = (e) => {
//   console.log(Nodes)
//   console.dir(e.target)
// };
// document.addEventListener('click', handleClick);

export default class ClickAway extends Component {
  static propTypes = {
    /** 点击 children 以外的区域时触发的回调 */
    onClickAway: PropTypes.func.isRequired,
    /** children */
    children: PropTypes.any.isRequired,
  }
  __mounted = false;
  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    this.__mounted = true;
    // TODO: 使用事件委托机制
    // const ID = UUID();
    // this.node.ID = ID;
    // Nodes[ID] = {
    //   node: this.node,
    //   click: this.handleClick
    // };
    document.addEventListener('click', this.handleClick);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
    this.__mounted = false;
  }
  handleClick = (event) => {
    if(event.defaultPrevented || !this.node || !this.__mounted) return;
    if(!this.node.contains(event.target)) {
      this.props.onClickAway(event);
    }
  }
  render() {
    const { children } = this.props;
    return children;
  }
}