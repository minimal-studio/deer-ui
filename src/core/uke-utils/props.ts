import PropTypes from 'prop-types';

const ColorProps = PropTypes.oneOf([
  'theme', 'red', 'orange', 'yellow', 'gold', 'blue', 'green', 'light-p',
  'primary', 'default', 'white', 'important', 'warn', 'black',
  'grey', 'wine'
]);

export {
  ColorProps
};