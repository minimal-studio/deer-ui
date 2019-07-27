import React, { Component, PureComponent } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { IsFunc } from 'basic-helper';

// import LoadingDOMSnip from './snip';
import LoadingProgress from './progress';
import LoadingDOMPlaceholder from './placeholder';
import { Children, FuncChildren } from '../utils/props';

export interface LoadingProps {
  /** animation timeout */
  timeout?: number;
  /** loading 状态 */
  loading: boolean;
  /** animation className */
  animationClass?: string;
  /** 子内容，从 2.10.5 版本开始支持 function children */
  children?: FuncChildren | Children;
  /** 可以替换默认的 loading 模版 */
  loadingDOM?: any;
  /** 内容是否与 loading 模版共存 */
  inrow?: boolean;
}

const childrenFuncFilter = children => (IsFunc(children) ? children() : children);

export default class Loading extends Component<LoadingProps> {
  static defaultProps = {
    inrow: false,
    timeout: 200,
    animationClass: 'loading',
  };

  transitionWrap(key, children) {
    const { timeout } = this.props;
    return (
      <CSSTransition
        classNames="loading"
        timeout={timeout}
        key={key}>
        {/* {children} */}
        <div>
          {children}
        </div>
      </CSSTransition>
    );
  }

  render() {
    const {
      loading, children, inrow, loadingDOM
    } = this.props;

    let loadingDOMFilterRes;

    switch (true) {
      case !!loadingDOM: // custom mode
        loadingDOMFilterRes = loadingDOM;
        break;
      case inrow: // progress
        loadingDOMFilterRes = <LoadingProgress />;
        break;
      default: // placeholder
        loadingDOMFilterRes = <LoadingDOMPlaceholder />;
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
          this.transitionWrap('loaded', childrenFuncFilter(children))
        ];
        break;
      // solution 2, when inrow and no children or not inrow, just render placeholder
      case loading && !inrow:
        container = this.transitionWrap(
          'loading',
          <div className="loading-container">
            {loadingDOMFilterRes}
          </div>
        );
        break;
      // solution 3, just render children
      case !loading:
        container = this.transitionWrap('loaded', childrenFuncFilter(children));
        break;
      default:
    }
    return (
      <div className={`loading-control ${loading ? 'loading' : 'planning'}`}>
        <TransitionGroup
          component={null}>
          {container}
        </TransitionGroup>
      </div>
    );
  }
}
