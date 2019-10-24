import React from 'react';

interface ListProps {
  className: string;
}

const List: React.SFC<ListProps> = (props) => {
  const { children, className = '', ...other } = props;
  return (
    <div {...other} className={`__list-container ${className || ''}`}>
      {
        React.Children.map(children, (Child, idx) => Child)
      }
    </div>
  );
};

export default List;
