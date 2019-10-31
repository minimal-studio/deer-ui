import React, { forwardRef } from 'react';

import Radio, { RadioProps } from '../radio/radio';

const defaultProps = {
  isMultiple: true,
  checkAllBtn: false,
  n: 'check'
};

export const Checkbox = forwardRef<Radio, RadioProps>((props, ref?) => (
  <Radio {...props} ref={ref} />
));

Checkbox.defaultProps = defaultProps;
