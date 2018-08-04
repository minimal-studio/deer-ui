import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Icon from '../icon';

const TRANSTION_TIME = 200;

export default class Toast extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      descQueue: {}
    }
    this.timerQueue = {};
  }
  componentWillUnmount() {
    this.__unmount = true;
    this.clearTimer();
  }
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
      timerID && clearTimeout(timerID)
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
      const tipIconMapper = {
        success: 'check',
        error: 'error'
      }
      return (
        <CSSTransition classNames="toast" timeout={TRANSTION_TIME} key={idx}>
          <span className={`desc-item ${type}`}>
            <Icon type={tipIconMapper[type]}/>
            <span className="text">{desc}</span>
            <span className="_close-btn" onClick={e => this.hideTip(tipID)}>x</span>
          </span>
        </CSSTransition>
      )
    })
    return (
      <div className="toast-container">
        <TransitionGroup component={null}>
          {descQueueDOM}
        </TransitionGroup>
      </div>
    );
  }
}
