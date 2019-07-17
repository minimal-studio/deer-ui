import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Radio from './radio';

const defaultProps = {
  isMultiple: true,
  checkAllBtn: false,
  n: 'check'
};

const Checkbox = forwardRef((props, ref) => {
  return (
    <Radio {...props} ref={ref} />
  );
});

Checkbox.defaultProps = defaultProps;

export default Checkbox;
