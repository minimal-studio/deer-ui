import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Icon } from '../icon';

const TRANSTION_TIME = 200;

/**
 * 简易的提示组件
 *
 * @export
 * @class Toast
 * @extends {PureComponent}
 */
export default class Toast extends PureComponent {
  state = {
    descQueue: {}
  };
  timerQueue = {};
  componentWillUnmount() {
    this.__unmount = true;
    this.clearTimer();
  }
  /**
   * 用于打开一个 toast
   *
   * @param {*} desc
   * @param {string} [type='desc']
   * @memberof Toast
   * @public
   */
  show(desc, type = 'desc') {
    const self = this;
    const {descQueue} = this.state;
    const currDescId = Date.now();

    let nextQueue = Object.assign({}, descQueue, {
      [currDescId]: {
        type: type,
        desc: desc
      }
    });

    this.setState({
      descQueue: nextQueue
    });

    let currTimer = setTimeout(() => {
      if(!self.__unmount) self.hideTip(currDescId);
    }, 5000);

    this.timerQueue[currTimer] = true;
  }
  clearTimer() {
    Object.keys(this.timerQueue).forEach(timerID => {
      timerID && clearTimeout(timerID);
    });
  }
  hideTip(tipID) {
    var nextQueue = Object.assign({}, this.state.descQueue);
    if(!nextQueue[tipID]) return;
    delete nextQueue[tipID];
    this.setState({
      descQueue: nextQueue
    });
  }
  clearTip() {
    this.clearTimer();
    this.setState({descQueue: {}});
  }
  render() {
    const {descQueue} = this.state;

    const descQueueDOM = Object.keys(descQueue).map((tipID, idx) => {
      const {type = 'success', desc} = descQueue[tipID];
      return (
        <CSSTransition classNames="toast" timeout={TRANSTION_TIME} key={idx}>
          <span className={`desc-item ${type}`}>
            <Icon n={type}/>
            <span className="text">{desc}</span>
            <span className="_close-btn" onClick={e => this.hideTip(tipID)}>x</span>
          </span>
        </CSSTransition>
      );
    });
    return (
      <div className="toast-container">
        <TransitionGroup component={null}>
          {descQueueDOM}
        </TransitionGroup>
      </div>
    );
  }
}
