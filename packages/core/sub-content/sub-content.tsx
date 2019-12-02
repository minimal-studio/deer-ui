import React from 'react';

export interface SubContentProps extends React.HTMLProps<HTMLDivElement> {
  /** 显示的元素 */
  displayElem?: any;
  /** subContent 的位置 */
  position?: 'right' | 'left';
  /** 隐藏的元素，当鼠标移动到显示的元素时出现 */
  children?: any;
}

const SubContent: React.SFC<SubContentProps> = ({
  displayElem, children, position = 'left', ...other
}) => (
  <div className={`__hide-container ${position}`} {...other}>
    <span className="display-elem">{displayElem}</span>
    <div className="hide-content">
      <span className="caret" />
      {children}
    </div>
  </div>
);

export default SubContent;
