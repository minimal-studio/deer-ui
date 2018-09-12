import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { getIcon } from '../config';

const Icon = (props) => {
  const {type, classNames = [], ...other} = props;
  return (
    <i
      {...other}
      className={getIcon(type, ['icon', ...classNames])}></i>
  )
}
Icon.propTypes = {
  type: PropTypes.string.isRequired,
  classNames: PropTypes.array,
}

export default Icon;
