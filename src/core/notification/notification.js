import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { EventEmitter, Call } from 'basic-helper';
import { Icon } from '../icon';
import positionFilter from '../position-filter';
import { UkeComponent, UkePureComponent } from '../uke-utils';

const TRANSFORM_TIMER = 300;

export default class Notification extends UkePureComponent {
  static propTypes = {
    handleClick: PropTypes.func,
  };
  // static defaultProps = {
  //   position: 'top,right',
  // };
  constructor(props) {
    super(props);
    this.timers = {};
    this.IDIncrement = 0;
    this.state = {
      systemTips: {},
      position: 'top,right'
    };
    EventEmitter.on('NOTIFY', this.receiveNotify);
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
   *    actionText: string,
   *    navigateConfig: {
   *      type: 'MANAGER',
   *      activeMenu: {
   *        code: 'ZHMX'
   *      }
   *    },
   *  }
   */
  componentWillUnmount() {
    EventEmitter.rm('NOTIFY', this.receiveNotify);
  }
  notifyConfigFilter(notifyConfig) {
    ++this.IDIncrement;
    const { id } = notifyConfig;
    const _id = id ? id : this.IDIncrement + '';
    notifyConfig.id = _id;
    return notifyConfig;
  }
  receiveNotify = (notifyConfig, _position) => {
    notifyConfig = this.notifyConfigFilter(notifyConfig);
    const { id } = notifyConfig;
    this.setState(({systemTips, position}) => {
      return {
        systemTips: {
          ...systemTips,
          [id]: notifyConfig
        },
        position: _position || position
      };
    });
    this.startTargetTimer(notifyConfig);
  }
  clickTip(clickTarget, msgID) {
    const { handleClick } = this.props;
    const { navigateConfig, onClickTip } = clickTarget;

    this.closeTip(msgID);

    Call(handleClick, navigateConfig);
    Call(onClickTip, clickTarget);
  }
  closeTip(msgID) {
    this.setState(({systemTips}) => {
      let nextState = Object.assign({}, systemTips);
      delete nextState[msgID];
      return {
        systemTips: nextState
      };
    });
  }
  clearTargetTimer(msgID) {
    if(this.timers[msgID]) clearTimeout(this.timers[msgID]);
  }
  startTargetTimer(msgObj) {
    if(this.timers[msgObj.id]) this.clearTargetTimer(msgObj.id);
    this.setTipHideTimer(msgObj);
  }
  setTipHideTimer(msgObj) {
    const { id, lifecycle = 7 } = msgObj;
    if(!id || lifecycle < 0) return;
    this.timers[id] = setTimeout(() => {
      this.closeTip(id);
    }, lifecycle * 1000);
  }
  render() {
    const { handleClick } = this.props;
    const { position, systemTips } = this.state;
    const hasMsg = Object.keys(systemTips).length > 0;
    const gm = this.gm;

    const container = (
      <div className={`notify-group ${positionFilter(position)} ${hasMsg ? 'has-msg' : 'no-msg'}`}>
        <div className="msg-panel scroll-content">
          <TransitionGroup component={null}>
            {
              Object.keys(systemTips).map(msgID => {
                const item = systemTips[msgID];
                const { type = 'normal', title, text, onClickTip, actionText = gm('点击查看详情') } = item;
                return (
                  <CSSTransition
                    key={msgID}
                    timeout={TRANSFORM_TIMER}
                    classNames="notify">
                    <div
                      className={`notify-item ${type}`}
                      onMouseEnter={e => this.clearTargetTimer(msgID)}
                      onMouseLeave={e => this.startTargetTimer(item)}>
                      <div className="title">{title ? title : gm('新消息')}</div>
                      <div className="text">{text || ''}</div>
                      {
                        (onClickTip || handleClick) ? (
                          <div className="action"
                            onClick={e => this.clickTip(item, msgID)}>
                            <span className="flex" />
                            <span className="action-btn">{actionText}</span>
                          </div>
                        ) : null
                      }
                      <div className="close-btn" onClick={e => this.closeTip(msgID)}>
                        <Icon n="close"/>
                      </div>
                    </div>
                  </CSSTransition>
                );
              })
            }
          </TransitionGroup>
        </div>
      </div>
    );

    return container;
  }
}
