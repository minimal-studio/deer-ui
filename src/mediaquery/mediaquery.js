import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class Mediaquery extends PureComponent {
  constructor(props) {
    super(props);
  }
  render () {
    const {query, children} = this.props;
    let container = (<div></div>);

    if(query) {
      let mq = window.matchMedia(query);
      if(mq.matches) {
        container = (
          <div>
            {children}
          </div>
        );
      }
    }
    return container;
  }
}

Mediaquery.propTypes = {
  query: PropTypes.string.isRequired
};
