import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../icon';

const menuDividGroup = ['-', 'hr'];

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
          if(menuDividGroup.indexOf(item) !== -1) return (
            <hr />
          );
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
  /** Menus 数据，可以为对象，如果为 '-' 或 'hr'，则渲染分隔线 */
  data: PropTypes.oneOf([
    PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.any,
      id: PropTypes.string,
      action: PropTypes.func,
    })),
    PropTypes.oneOf(menuDividGroup)
  ])
};

export default Menus;

export {
  MenuItem
};