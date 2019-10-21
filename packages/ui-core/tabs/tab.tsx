import React from 'react';
import { Call } from 'basic-helper';
import { Icon } from '../icon';

export interface TabProps {
  /** tab 的显示名 */
  label: string;
  /** tab 的 icon */
  icon?: string;
  /** tab 的 className */
  labelClass?: string;
  /** content 的 className */
  contentClass?: string;
  /** 第几个 idx，Tabs 会传入 */
  idx?: number;
  /** 改变激活的 tab 位置时的回调 */
  onChange?: (changeEvent) => void;
  /** 改变激活的 tab 位置时的回调 */
  onClick?: (clickEvent) => void;
}

const Tab: React.SFC<TabProps> = ({
  label, icon, onClick, onChange, idx, labelClass = ''
}) => {
  const iconDOM = icon && (
    <Icon n={icon} classNames={['tab-icon']}/>
  );

  return (
    <div className={`tab-label ${labelClass}`} onClick={(e) => {
      Call(onClick, e);
      Call(onChange, e);
    }}>
      {iconDOM}
      <span className="text">{label}</span>
    </div>
  );
};

export default Tab;
