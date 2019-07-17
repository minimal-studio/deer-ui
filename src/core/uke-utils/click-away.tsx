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
    if(event.defaultPrevented || !this.node || !this.__mounted) return;
    if(!this.node.contains(event.target)) {
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