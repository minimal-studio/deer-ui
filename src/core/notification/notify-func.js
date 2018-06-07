import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';

import {EventEmitter} from 'basic-helper';
import Notification from './notification';
import setDOMById from '../set-dom';

let notifyDOMId = 'NOTIFICATION_CONTAINER';
let notificationEntity = null;

export default function Notify(options) {
  const {position, config, handleClick} = options;

  notificationEntity.receiveNotify(config);
}

let notifyDOM = setDOMById(notifyDOMId);
ReactDOM.render(
  <Notification
    ref={no => {
      if(no) notificationEntity = no;
    }}/>,
  notifyDOM
)
