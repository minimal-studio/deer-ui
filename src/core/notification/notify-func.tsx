import React from 'react';
import ReactDOM from 'react-dom';

import { HasValue } from 'basic-helper';

import Notification, { NotifyConfig } from './notification';
import setDOMById from '../set-dom';

export interface NotifyParams {
  /** 广播 Notify 的配置 */
  config: NotifyConfig;
  /** 广播通知的位置 */
  position?: string;
  /** 点击通知项时的回调 */
  handleClick?: Function;
}

const notifyDOMId = 'NOTIFICATION_CONTAINER';

let notificationEntity;

/**
 * 将返回 config 的 id，用于消除该通知
 * @param {object} options
 */
export default function Notify(options: NotifyParams) {
  const { position, config, handleClick } = options;

  const configID = notificationEntity.receiveNotify(config, position);

  return configID;
}
/**
 * 用于消除 Notify ，传入 notifyID
 */
export function CancelNotify(id) {
  if (!HasValue(id)) return console.warn('must to pass {id}!');
  return notificationEntity.closeTip(id);
}

const notifyDOM = setDOMById(notifyDOMId);
ReactDOM.render(
  <Notification
    ref={(no) => {
      if (no) notificationEntity = no;
    }}/>,
  notifyDOM
);
