import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../icon';

const MenuItem = ({isActive, text, icon, ...other}) => {
  return (
    <div
      className={"menu-item" + (isActive ? ' active' : '')}
      {...other}>
      {icon ? <Icon n={icon}/> : null}
      {text}
    </div>
  );
};

const Menus = (props) => {
  const { data, children } = props;
  return (
    <span className="uke-menus">
      {
        data ? data.map((item, idx) => {
          const { action, id, ...other } = item;
          return (
            <MenuItem key={id || idx} onClick={action} {...other} />
          );
        }) : children
      }
    </span>
  );
};
Menus.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.any,
    id: PropTypes.string,
    action: PropTypes.func,
  }))
};

export default Menus;