/* eslint-disable max-classes-per-file */

import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';

import Popover from './popover';
import setDOMById, { destoryDOM } from '../set-dom';

export interface PopoverHelperState {
  relativeElem: HTMLElement;
  open: boolean;
  children: any;
}

export class PopoverWrapper extends Component<{}, PopoverHelperState> {
  constructor(props) {
    super(props);
    this.state = {
      relativeElem: document.body,
      open: false,
      children: null
    };
  }

  closePopover() {
    console.warn('closePopover 要被废弃了，请使用 close');
    this.close();
  }

  close() {
    this.setState({
      open: false
    });
  }

  show(elem: HTMLElement, isShow: boolean, children: any, props: {}) {
    const _isShow = typeof isShow !== 'undefined' ? isShow : !this.state.open;
    this.setState(prevState => ({
      ...props,
      relativeElem: elem || prevState.relativeElem,
      open: _isShow,
      children: children || prevState.children
    }));
  }

  render() {
    return (
      <Popover
        {...this.props}
        {...this.state}
        onClose={e => this.close()} />
    );
  }
}

export interface PopoverConstructorOptions {
  /** 是否设置 css position: fixed */
  fixed?: boolean;
  /** id */
  id?: string;
}

export interface PopShowParams {
  elem?: HTMLElement | EventTarget;
  children?: any;
  open?: boolean;
  props?: {};
}

interface PopSetParams extends PopShowParams {
  open: boolean;
}

export class PopoverEntity {
  id

  idPrefix = 'pop_'

  prevProps

  lifeTimer

  popoverEntity

  prevOptions = {}

  constructor(options: PopoverConstructorOptions = {}) {
    const { id = 'topPopover', fixed = false } = options;
    this.id = this.idPrefix + id;
    this.prevProps = { fixed };

    this.initDOM({});
  }

  savePopWrapper = (e: PopoverWrapper) => {
    if (!e) return;
    this.popoverEntity = e;
  }

  initDOM(props) {
    const topPopoverDOM = setDOMById(this.id);

    const popoverWrapper = (
      <PopoverWrapper
        {...props}
        ref={this.savePopWrapper}/>
    );
    ReactDOM.render(
      popoverWrapper,
      topPopoverDOM,
    );
  }

  show(options: PopShowParams) {
    const setConfig = Object.assign({}, options, {
      open: true
    });
    this.set(setConfig);
  }

  set(options: PopSetParams) {
    const _options = Object.assign({}, this.prevOptions, options);
    const {
      elem, children, open, props = this.prevProps
    } = _options;
    this.prevProps = props;
    this.prevOptions = _options;

    this.popoverEntity.show(elem, open, children, props);
  }

  close() {
    const nextState = {
      open: false
    };
    this.set(nextState);
  }

  destroy = () => {
    this.close();
    destoryDOM(this.id);
  }

  delayClose(timer = 5000) {
    if (this.lifeTimer) clearTimeout(this.lifeTimer);
    this.lifeTimer = setTimeout(() => {
      this.close();
    }, timer);
  }
}
