import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';

import Notification from './notification';
import setDOMById from '../set-dom';

let notifyDOMId = 'NOTIFICATION_CONTAINER';

export default function Notify(options) {
  const {position, config, handleClick} = options;
  let notifyDOM = setDOMById(notifyDOMId);

  ReactDOM.render(
    <Notification handleClick={handleClick}/>,
    notifyDOM
  )
}
