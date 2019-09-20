import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { EventEmitter, Call, HasValue } from 'basic-helper';
import { Icon } from '../icon';
import positionFilter from '../position-filter';
import { UkePureComponent } from '../utils/uke-component';
import { tipIcons } from '../utils/icon-mapper';

export interface NotificationProps {
  handleClick?: (params: {}) => void;
}
interface State {
  notifyItems: {};
  position: string;
}
export interface NotifyConfig {
  /** 通知的标题 */
  title?: string;
  /** id */
  id?: string;
  /** 通知的内容 */
  text?: any;
  /** id */
  type?: 'success' | 'error' | 'normal' | 'warn' | 'black' | 'white';
  /** 通知持续时间，如果 < 0, 则一直存在，除非用户主动关闭 */
  timer?: number;
  /** 点击此次通知的回调 */
  onClickTip?: (notifyConfig: NotifyConfig) => void;
  /** 操作按钮显示的文字 */
  actionText?: string;
}

const TRANSFORM_TIMER = 300;
const defaultTimeToClose = 7;

export const NotifyEvent = 'NOTIFY';

export default class Notification extends UkePureComponent<NotificationProps, State> {
  timers: {[key: string]: any} = {};

  IDIncrement = 0;

  constructor(props) {
    super(props);

    this.state = {
      notifyItems: {},
      position: 'top,right'
    };
    EventEmitter.on(NotifyEvent, this.receiveNotify);
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
    EventEmitter.rm(NotifyEvent, this.receiveNotify);
  }

  notifyConfigFilter(notifyConfig: NotifyConfig) {
    ++this.IDIncrement;
    const nextConfig = Object.assign({}, notifyConfig);
    if (!nextConfig.id) {
      nextConfig.id = `${this.IDIncrement}`;
    }
    return nextConfig;
  }

  receiveNotify = (notifyConfig: NotifyConfig, _position) => {
    const nextNotifyConfig = this.notifyConfigFilter(notifyConfig);
    const { id } = nextNotifyConfig;
    if (!id) return 0;
    this.setState(({ notifyItems, position }) => ({
      notifyItems: {
        ...notifyItems,
        [id.toString()]: nextNotifyConfig
      },
      position: _position || position
    }));
    this.startTargetTimer(nextNotifyConfig);
    return id;
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
      const nextState = Object.assign({}, notifyItems);
      delete nextState[msgID];
      return {
        notifyItems: nextState
      };
    });
  }

  clearAllNotify = () => {
    Object.keys(this.timers).forEach(timerID => clearTimeout(+timerID));
    this.setState({
      notifyItems: {}
    });
  }

  clearTargetTimer(msgID) {
    if (this.timers[msgID]) clearTimeout(this.timers[msgID]);
  }

  startTargetTimer(msgObj) {
    if (this.timers[msgObj.id]) this.clearTargetTimer(msgObj.id);
    this.setTipHideTimer(msgObj);
  }

  setTipHideTimer(msgObj) {
    const { id, timer = defaultTimeToClose, lifecycle = defaultTimeToClose } = msgObj;
    let _timer;
    if (HasValue(lifecycle)) _timer = lifecycle;
    if (HasValue(timer)) _timer = timer;
    if (!id || _timer <= 0) return;

    this.timers[id.toString()] = setTimeout(() => {
      this.closeTip(id);
    }, _timer * 1000);
  }

  render() {
    const { handleClick } = this.props;
    const { position, notifyItems } = this.state;
    const notifyItemsKeys = Object.keys(notifyItems);
    const notifyItemsKeysLen = notifyItemsKeys.length;
    const hasMsg = notifyItemsKeysLen > 0;
    const needClearAllBtn = notifyItemsKeysLen > 3;
    const { $T_UKE } = this;

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
              notifyItemsKeys.map((msgID) => {
                const item = notifyItems[msgID];
                const {
                  type = 'normal', title, text, onClickTip, actionText = $T_UKE('点击查看详情')
                } = item;
                return (
                  <CSSTransition
                    key={msgID}
                    timeout={TRANSFORM_TIMER}
                    classNames="notify">
                    <div
                      className={`notify-item ${type}`}
                      ref={(e) => {
                        if (e) {
                          e.style.height = `${e.offsetHeight}px`;
                        }
                      }}
                      onMouseEnter={e => this.clearTargetTimer(msgID)}
                      onMouseLeave={e => this.startTargetTimer(item)}>
                      {
                        tipIcons[type] && (
                          <div className="notify-type-tip">
                            <Icon n={tipIcons[type]} />
                          </div>
                        )
                      }
                      <div className="content">
                        <div className="title">{title || $T_UKE('新消息')}</div>
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
