import React from 'react';

import { Color } from '../uke-utils/props';

export interface TipProps {
  /** 大小 */
  scale: number;
  /** 是否需要动画 */
  animate: boolean;
  /** color */
  color: Color;
}

const Tip: React.SFC<TipProps> = ({
  scale = 10, color = 'theme', children, animate = true
}) => {
  const tipStyle = {
    height: scale,
    width: scale
  };
  return (
    <div className="uke-tip-item" style={tipStyle}>
      <span className={`tip ${color}`} />
      {
        animate && (
          <span className={`tip animate ${color}`} />
        )
      }
      <span className="c">{children}</span>
    </div>
  );
};

export default Tip;
