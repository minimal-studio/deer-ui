import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { EventEmitter, Call } from 'basic-helper';
import { Icon } from '../icon';
import positionFilter from '../position-filter';
import { UkeComponent, UkePureComponent } from '../uke-utils';
import { tipIcons } from '../uke-utils/icon-mapper';

const TRANSFORM_TIMER = 300;
const defaultTimeToClose = 7;

export default class Notification extends UkePureComponent {
  static propTypes = {
    handleClick: PropTypes.func,
    iconMapper: PropTypes.shape({})
  };
  static defaultProps = {
    // iconMapper: 'top,right',
  };
  timers = {};
  IDIncrement = 0;
  constructor(props) {
    super(props);
    
    this.state = {
      notifyItems: {},
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
    this.setState(({ notifyItems, position }) => {
      return {
        notifyItems: {
          ...notifyItems,
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
    this.setState(({ notifyItems }) => {
      let nextState = Object.assign({}, notifyItems);
      delete nextState[msgID];
      return {
        notifyItems: nextState
      };
    });
  }
  clearAllNotify = () => {
    Object.keys(this.timers).forEach(timerID => clearTimeout(timerID));
    this.setState({
      notifyItems: {}
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
    const { id, timer = defaultTimeToClose, lifecycle = defaultTimeToClose } = msgObj;
    const _timer = timer || lifecycle;
    if(!id || _timer <= 0) return;
    this.timers[id] = setTimeout(() => {
      this.closeTip(id);
    }, lifecycle * 1000);
  }
  render() {
    const { handleClick } = this.props;
    const { position, notifyItems } = this.state;
    const notifyItemsKeys = Object.keys(notifyItems);
    const notifyItemsKeysLen = notifyItemsKeys.length;
    const hasMsg = notifyItemsKeysLen > 0;
    const needClearAllBtn = hasMsg;
    const gm = this.gm;

    const container = (
      <div className={`notify-group ${positionFilter(position)} ${hasMsg ? 'has-msg' : 'no-msg'}`}>
        <div className="msg-panel scroll-content">
          {
            needClearAllBtn && (
              <div className="notify-item" onClick={this.clearAllNotify}>
                清除所有通知
              </div>
            )
          }
          <TransitionGroup component={null}>
            {
              notifyItemsKeys.map(msgID => {
                const item = notifyItems[msgID];
                const { type = 'normal', title, text, onClickTip, actionText = gm('点击查看详情') } = item;
                return (
                  <CSSTransition
                    key={msgID}
                    timeout={TRANSFORM_TIMER}
                    classNames="notify">
                    <div
                      className={`notify-item ${type}`}
                      ref={e => {
                        if(e) {
                          e.style.height = e.offsetHeight + 'px';
                          console.log(e)
                        }
                      }}
                      onMouseEnter={e => this.clearTargetTimer(msgID)}
                      onMouseLeave={e => this.startTargetTimer(item)}>
                      <div className="notify-type-tip">
                        {
                          tipIcons[type] && (
                            <Icon n={tipIcons[type]} />
                          )
                        }
                      </div>
                      <div className="content flex">
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
                        <div className="_close-btn" onClick={e => this.closeTip(msgID)}>
                          <Icon n="close"/>
                        </div>
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
