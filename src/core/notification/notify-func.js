import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';

import {HasValue} from 'basic-helper';

import Notification from './notification';
import setDOMById from '../set-dom';

let notifyDOMId = 'NOTIFICATION_CONTAINER';
let notificationEntity = null;

/**
 * 将返回 config 的 id，用于消除该通知
 * @param {object} options
 */
export default function Notify(options) {
  const {position, config, handleClick} = options;
  if(!HasValue(config.id)) return console.warn('must to pass {id} within config!');

  notificationEntity.receiveNotify(config);

  return config.id;
}
/**
 * 用于消除 Notify ，传入 notifyID
 */
export function CancelNotify(id) {
  if(!HasValue(id)) return console.warn('must to pass {id}!');
  return notificationEntity.closeTip(id);
}

let notifyDOM = setDOMById(notifyDOMId);
ReactDOM.render(
  <Notification
    ref={no => {
      if(no) notificationEntity = no;
    }}/>,
  notifyDOM
);
