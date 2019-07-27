import React from 'react';

interface ListItemProps {
  className: string;
}

const ListItem: React.SFC<ListItemProps> = (props) => {
  const { children, className = '', ...other } = props;
  return (
    <div {...other} className={`list-item ${className || ''}`}>
      {
        children
      }
    </div>
  );
};

export default ListItem;
