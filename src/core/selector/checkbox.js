import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import Radio from './radio';

const defaultProps = {
  isMultiple: true,
  checkAllBtn: false,
  n: 'check'
};

const Checkbox = (props) => {
  return (
    <Radio {...props} />
  );
};

Checkbox.defaultProps = defaultProps;

export default Checkbox;
