import React from 'react';
import ReactDOM from 'react-dom';

import { HasValue, UUID } from 'basic-helper';

import Notification, { NotifyConfig, NotificationProps } from './notification';
import setDOMById from '../set-dom';

export interface NotifyParams extends NotifyConfig {
  /** 广播 Notify 的配置 */
  config?: NotifyConfig;
  /** 广播通知的位置 */
  position?: string;
  /** 点击通知项时的回调 */
  handleClick?: NotificationProps['handleClick'];
}

export type NotifyID = number | string;

const notifyDOMId = 'NOTIFICATION_CONTAINER';

let notificationEntity;
const setNotification = () => {
  return new Promise<Notification>((resolve) => {
    if (notificationEntity) {
      resolve(notificationEntity);
    } else {
      const notifyDOM = setDOMById(notifyDOMId);
      ReactDOM.render(
        <Notification
          ref={(e) => {
            notificationEntity = e;
            resolve(notificationEntity);
          }}/>,
        notifyDOM
      );
    }
  });
};

/**
 * 将返回 config 的 id，用于消除该通知
 * @param {object} options
 */
export default function Notify(options: NotifyParams): NotifyID {
  const {
    position, config, id = UUID(), handleClick, ...otherConfig
  } = options;
  setNotification().then((notify) => {
    notify.receiveNotify(
      Object.assign({
        id
      }, config, otherConfig), position
    );
  });
  // const {
  //   position, config, id = UUID(), handleClick, ...otherConfig
  // } = options;

  // notificationEntity.receiveNotify(
  //   Object.assign({
  //     id
  //   }, config, otherConfig), position
  // );

  return id;
}
/**
 * 用于消除 Notify ，传入 notifyID
 */
export function CancelNotify(id: NotifyID) {
  if (!HasValue(id)) return console.warn('must to pass {id}!');
  return notificationEntity.closeTip(id);
}
