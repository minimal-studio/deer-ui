import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { getIcon } from '../config';

const Icon = (props) => {
  const {type, classNames = [], ...other} = props;
  return (
    <i
      {...other}
      className={getIcon(type, ['icon', ...classNames])} />
  );
};
Icon.propTypes = {
  /** icon name */
  type: PropTypes.string.isRequired,
  /** multiple class names */
  classNames: PropTypes.arrayOf(PropTypes.string),
};

export default Icon;
