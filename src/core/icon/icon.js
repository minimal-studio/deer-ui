import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { getIcon } from '../config';

const Icon = (props) => {
  const { n, s, useIconConfig, type, classNames, className, ...other } = props;
  return (
    <i
      {...other}
      className={getIcon(n || type, s, ['icon', (className ? className : ''), ...classNames], useIconConfig)} />
  );
};
Icon.propTypes = {
  /** 是否使用默认的 icon 配置 */
  useIconConfig: PropTypes.bool,
  /** icon name */
  n: PropTypes.string,
  /** icon style, 具体查看 https://fontawesome.com/ 的描述 */
  s: PropTypes.oneOf([
    's',
    'r',
    'l',
    'b',
  ]),
  /** icon name */
  type: PropTypes.string,
  /** multiple class names */
  classNames: PropTypes.arrayOf(PropTypes.string),
};
Icon.defaultProps = {
  n: 'none',
  s: 's',
  useIconConfig: true,
  classNames: [],
};

const PureIcon = (props) => {
  return (
    <Icon {...props} useIconConfig={false} />
  );
};

export {
  PureIcon
};

export default Icon;
