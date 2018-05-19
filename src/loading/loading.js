import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

function LoadingDOMSnip() {
  return (
    <div>
      <div className="loader1">
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
      </div>
      <div className="mask"></div>
    </div>
  )
}

function LoadingProgress() {
  return (
    <div className="progressbar">
      <div className="progress item-1 blue"></div>
      <div className="progress item-2 blue"></div>
    </div>
  )
}

function LoadingDOMPlaceholder() {
  return (
    <div className='loading-content'>
      <div className='line'></div>
      <div className='line'></div>
      <div className='line'></div>
      <div className='line'></div>
      <div className='line'></div>
      <div className='line'></div>
      <div className='line'></div>
      <div className='line'></div>
      <div className='line'></div>
      <div className='line'></div>
    </div>
  )
}
class LoadingDOMProgress extends PureComponent {
  render() {
    return (
      <div className='text-input__loading'>
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
          this.transitionWrap('loaded', children),
          this.transitionWrap(
            'loading',
            <div className="loading-container">
              {loadingDOMFilterRes}
            </div>
          )
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
        <TransitionGroup>
          {container}
        </TransitionGroup>
      </div>
    );

    // if(!loading && inrow) {
    //   let cli = inrow ? children : null;
    //   if(inrow) {
    //     container = [this.transitionWrap('loaded', children)];
    //     container.push(
    //       this.transitionWrap(
    //         'loading',
    //         <div className="loading-container">
    //           {loadingDOMFilterRes}
    //         </div>
    //       )
    //     );
    //   } else {
    //     container = this.transitionWrap(
    //       'loading',
    //       <div className="loading-container">
    //         {cli}
    //         {loadingDOMFilterRes}
    //       </div>
    //     );
    //   }
    // } else if() {
    //   container = this.transitionWrap('loaded', children);
    // }
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
  loadingDOM: PropTypes.any,
  inrow: PropTypes.bool,
}
