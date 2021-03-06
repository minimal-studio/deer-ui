import React from 'react';

/**
 * 帮助组件修改名字的辅助函数
 *
 * @param {component} NewComponent 新的 component
 * @param {string} oldComponentName 旧的 component 的显示名字
 * @param {string} newComponentName 新的 component 的显示名字
 */
const ComponentRename = (NewComponent, oldComponentName: string, newComponentName: string) => {
  return (props) => {
    console.warn(`请将组件 ${oldComponentName} 改为 ${newComponentName}`);
    return (
      <NewComponent {...props}/>
    );
  };
};

const ApiRename = (oldApiName: string, newApiName: string) => {
  console.log(`请将 ${oldApiName} 更名为 ${newApiName}`);
};

export {
  ApiRename,
  ComponentRename
};

export default ComponentRename;
