import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import getIcon from './get-icon';

const Icon = ({type, classNames = [], ...other}) => {
  return (
    <i {...other} className={getIcon(type, ['icon', ...classNames])}></i>
  )
}
Icon.propTypes = {
  type: PropTypes.string.isRequired,
  classNames: PropTypes.array,
}

export default Icon;
