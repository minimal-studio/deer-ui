import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Icon, PureIcon } from '../icon';

const menuDividGroup = ['-', 'hr'];

const MenuItem = ({ isActive, text, icon, s, pureIcon, ...other }) => {
  const I = pureIcon ? <PureIcon n={pureIcon} /> : icon && <Icon n={icon} s={s} />;
  return (
    <div
      className={"menu-item" + (isActive ? ' active' : '')}
      {...other}>
      {I}
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
            <hr key={idx} />
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
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        text: PropTypes.any,
        id: PropTypes.string,
        icon: PropTypes.string,
        pureIcon: PropTypes.string,
        action: PropTypes.func,
      }),
      PropTypes.oneOf([
        'hr', '-'
      ]),
    ])
  )
};

export default Menus;

export {
  MenuItem
};