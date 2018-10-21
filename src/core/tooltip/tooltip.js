import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, DebounceClass } from 'basic-helper';

import { PopoverEntity } from '../popover';
import { Icon } from '../icon';

const debounce = new DebounceClass();

const Popover = new PopoverEntity({
  id: 'iconPopover',
  fixed: true
});

const TitleDOM = ({title}) => {
  return (
    <div className="text-center p5">{title}</div>
  );
};

export default class Tooltip extends PureComponent {
  render() {
    const {title, onClick, ...other} = this.props;
    return (
      <Icon
        {...other}
        onMouseEnter={e => {
          Popover.setPopover({
            position: 'bottom',
            open: true,
            elem: e.target,
            props: {
              showCloseBtn: false,
              className: 'icon-tip',
              type: 'black'
            },
            children: <TitleDOM title={title}/>,
          });
        }}
        onMouseLeave={e => {
          Popover.setPopover({
            open: false,
          });
        }}
        onClick={e => {
          Call(onClick, e);
          debounce.exec(() => {
            Popover.setPopover({
              children: <TitleDOM title={this.props.title}/>,
            });
          }, 1);
        }}
        classNames={['relative']}/>
    );
  }
}
