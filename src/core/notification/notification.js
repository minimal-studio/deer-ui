import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {EventEmitter, IsFunc, CallFunc} from 'basic-helper';

const TRANSFORM_TIMER = 300;

export default class Notification extends PureComponent {
  constructor(props) {
    super(props);
    this.timers = {};
    this.state = {
      systemTips: {}
    }
    EventEmitter.subscribe('NOTIFY', this.receiveNotify);
  }
  /**
   * receiveNotify 参数说明
   * notifyConfig = {
   *    text: '',
   *    id: '',
   *    title: '',
   *    type: [success error normal warn black white] default 'desc'
   *    lifecycle: 7 sec,
   *    onClickTip: func,
   *    navigateConfig: {
   *      type: 'POP_MANAGER',
   *      activeMenu: {
   *        code: 'ZHMX'
   *      }
   *    },
   *  }
   */
  receiveNotify = (notifyConfig) => {
    const {id} = notifyConfig;
    this.setState({
      systemTips: Object.assign({}, this.state.systemTips, {
        [id]: notifyConfig
      })
    });
    this.startTargetTimer(notifyConfig);
  }
  componentWillUnmount() {
    EventEmitter.unsubscribe('NOTIFY', this.receiveNotify);
  }
  clickTip(clickTarget, msgID) {
    const {handleClick} = this.props;
    const {navigateConfig, onClickTip} = clickTarget;

    this.closeTip(msgID);

    CallFunc(handleClick)(navigateConfig);
    CallFunc(onClickTip)(clickTarget);
  }
  closeTip(msgID) {
    let nextState = Object.assign({}, this.state.systemTips);
    delete nextState[msgID];
    this.setState({
      systemTips: nextState
    })
  }
  clearTargetTimer(msgID) {
    if(!!this.timers[msgID]) clearTimeout(this.timers[msgID]);
  }
  startTargetTimer(msgObj) {
    if(!!this.timers[msgObj.id]) this.clearTargetTimer(msgObj.id);
    this.setTipHideTimer(msgObj);
  }
  setTipHideTimer(msgObj) {
    const self = this;
    const {id, lifecycle = 7} = msgObj;
    if(!id || lifecycle < 0) return;
    this.timers[id] = setTimeout(() => {
      self.closeTip(id);
    }, lifecycle * 1000);
  }
  render() {
    const {position = 'top-right'} = this.props;
    const {systemTips} = this.state;
    let hasMsg = Object.keys(systemTips).length > 0;

    let container = (
      <div className={`notify-group ${position}`}>
        <div className="msg-panel scroll-content">
          <TransitionGroup>
            {
              Object.keys(systemTips).map((msgID, idx) => {
                const item = systemTips[msgID];
                const {type = 'normal', title, text} = item;
                return (
                  <CSSTransition
                    key={msgID}
                    timeout={TRANSFORM_TIMER}
                    classNames="notify">
                    <div
                      className={`notify-item ${type}`}
                      onMouseEnter={e => this.clearTargetTimer(msgID)}
                      onMouseLeave={e => this.startTargetTimer(item)}>
                      <div className="title">{title ? title : '新消息'}</div>
                      <div className="text">{text || ''}</div>
                      <div className="action"
                        onClick={e => this.clickTip(item, msgID)}>点击查看详情</div>
                      <div className="close-btn" onClick={e => this.closeTip(msgID)}>x</div>
                    </div>
                  </CSSTransition>
                )
              })
            }
          </TransitionGroup>
        </div>
      </div>
    );

    return (
      <div
        id="systemTipsContainer"
        className={hasMsg ? 'has-msg' : 'no-msg'}>
        {container}
      </div>
    )
  }
}

Notification.propTypes = {
  handleClick: PropTypes.func
};
