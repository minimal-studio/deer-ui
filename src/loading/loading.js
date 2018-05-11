import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class LoadingDOM extends PureComponent {
  render() {
    return (
      <div className="loader1">
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
      </div>
    )
  }
}

export default class Loading extends Component {
  transitionWrap(key, children) {
    return (
      <CSSTransition
        classNames="loading"
        timeout={200}
        key={key}>
        <div style={{height: '100%'}}>
          {children}
        </div>
      </CSSTransition>
    )
  }
  render() {
    const {loading = false, children, inrow = false} = this.props;

    const childrenWrap = this.transitionWrap('loaded', children);
    let container = inrow ? [childrenWrap] : childrenWrap;

    if(loading) {
      let cli = inrow ? children : null;
      if(inrow) {
        container.push(
          this.transitionWrap(
            'loading',
            <div className="loading-container">
              <LoadingDOM/>
              <div className="mask"></div>
            </div>
          )
        );
      } else {
        container = this.transitionWrap(
          'loading',
          <div className="loading-container">
            {cli}
            <LoadingDOM/>
          </div>
        );
      }
    }
    return (
      <div className={"loading-control " + (loading ? 'loading' : 'planning')}>
        <TransitionGroup>
          {container}
        </TransitionGroup>
      </div>
    );
  }
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  inrow: PropTypes.bool,
}
