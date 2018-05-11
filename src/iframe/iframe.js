import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class Iframe extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const {iframeLink} = this.props;
    const container = (
      <div className="iframe-container">
        <a href={iframeLink} target="_brank" className="btn-link">新标签打开</a>
        <iframe src={iframeLink} frameBorder="0"></iframe>
      </div>
    );
    return container;
  }
}
Iframe.propTypes = {
  iframeLink: PropTypes.string
};
