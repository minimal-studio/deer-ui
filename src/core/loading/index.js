import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// import LoadingDOMSnip from './snip';
import LoadingProgress from './progress';
import LoadingDOMPlaceholder from './placeholder';

export default class Loading extends Component {
  transitionWrap(key, children) {
    return (
      <CSSTransition
        classNames="loading"
        timeout={200}
        key={key}>
        <div>
          {children}
        </div>
      </CSSTransition>
    )
  }
  render() {
    const {loading = false, children, inrow = false, loadingDOM} = this.props;

    let loadingDOMFilterRes;

    switch (true) {
      case !!loadingDOM: // custom mode
        loadingDOMFilterRes = loadingDOM;
        break;
      case inrow: // progress
        loadingDOMFilterRes = <LoadingProgress/>
        break;
      default: // placeholder
        loadingDOMFilterRes = <LoadingDOMPlaceholder/>
    }

    let container;

    switch (true) {
      // solution 1, render chidlren with progress
      case loading && inrow:
        container = [
          this.transitionWrap(
            'loading',
            <div className="loading-container">
            {loadingDOMFilterRes}
          </div>
          ),
          this.transitionWrap('loaded', children)
        ]
        break;
      // solution 2, when inrow and no children or not inrow, just render placeholder
      case loading && !inrow:
        container = this.transitionWrap(
          'loading',
          <div className="loading-container">
            {loadingDOMFilterRes}
          </div>
        )
        break;
      // solution 3, just render children
      case !loading:
        container = this.transitionWrap('loaded', children);
        break;
      default:
    }
    return (
      <div className={"loading-control " + (loading ? 'loading' : 'planning')}>
        <TransitionGroup
          component={null}>
          {container}
        </TransitionGroup>
      </div>
    );
  }
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadingDOM: PropTypes.any,
  inrow: PropTypes.bool,
}
