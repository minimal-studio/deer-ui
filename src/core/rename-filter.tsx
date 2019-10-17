import React from 'react';

/**
 * 帮助组件修改名字的辅助函数
 *
 * @param {component} NewComponent 新的 component
 * @param {string} oldComponentName 旧的 component 的显示名字
 * @param {string} newComponentName 新的 component 的显示名字
 */
const Rename = (NewComponent, oldComponentName: string, newComponentName: string) => {
  return (props) => {
    console.warn(`${oldComponentName} 要废弃了，请使用 ${newComponentName} 代替`);
    return (
      <NewComponent {...props}/>
    );
  };
};

export default Rename;
