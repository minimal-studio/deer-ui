import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

const SubContent = ({displayElem, children}) => {
  return (
    <div className="hide-container">
      <span className="display-elem">{displayElem}</span>
      <div className="hide-content">
        <span className="caret"></span>
        {children}
      </div>
    </div>
  )
}
SubContent.propTypes = {
  displayElem: PropTypes.any
}

export default SubContent;