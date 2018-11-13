import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Random} from 'basic-helper';

export default class RandomDisplayNember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numb: 0,
    };
    this.timer = null;
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isStart !== nextProps.isStart || this.state.numb !== nextState.numb;
  }
  // TODO: 检查这个的影响
  // componentWillReceiveProps(nextProps) {
  //   this.toggleRandom(nextProps.isStart);
  // }
  componentDidMount() {
    this.toggleRandom(this.props.isStart);
  }
  toggleRandom(isStart) {
    if(isStart && !!this.timer) return;
    if(!isStart && !!this.timer) {
      clearInterval(this.timer);
      return this.timer = null;
    }
    if(isStart && !this.timer) {
      const self = this;
      this.timer = setInterval(() => {
        self.setState({
          numb: Random([0, 9])
        });
      }, 50);
    }
  }
  componentWillUnmount() {
    if(this.timer) clearInterval(this.timer);
  }
  render() {
    const {numb} = this.state;
    return (
      <span>{numb}</span>
    );
  }
}
RandomDisplayNember.propTypes = {
  isStart: PropTypes.bool,
};
