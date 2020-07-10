import React from 'react';

interface ListProps {
  className: string;
}

export const List: React.FC<ListProps> = (props) => {
  const { children, className = '', ...other } = props;
  return (
    <div {...other} className={`__list-container ${className || ''}`}>
      {
        React.Children.map(children, (Child, idx) => Child)
      }
    </div>
  );
};
