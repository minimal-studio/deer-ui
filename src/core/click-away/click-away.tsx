/* eslint-disable react/no-find-dom-node */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { UUID } from 'basic-helper';

export interface ClickAwayProps {
  /** 点击 children 以外的区域时触发的回调 */
  onClickAway: (event) => void;
  /** children */
  children: any;
}

export default class ClickAway extends Component<ClickAwayProps> {
  __mounted = false;

  node

  componentDidMount() {
    // this.node = ReactDOM.findDOMNode(this);
    this.updateNodeRef();
    this.__mounted = true;
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
    this.__mounted = false;
  }

  handleClick = (event) => {
    if (event.defaultPrevented || !this.node || !this.__mounted) return;
    if (!this.node.contains(event.target)) {
      this.props.onClickAway(event);
    }
  }

  updateNodeRef = () => {
    this.node = ReactDOM.findDOMNode(this);
  }

  render() {
    const { children } = this.props;
    return children;
  }
}
