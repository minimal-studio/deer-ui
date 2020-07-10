import React from 'react';

interface ListItemProps {
  className: string;
}

export const ListItem: React.FC<ListItemProps> = (props) => {
  const { children, className = '', ...other } = props;
  return (
    <div {...other} className={`list-item ${className || ''}`}>
      {
        children
      }
    </div>
  );
};
