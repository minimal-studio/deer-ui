import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class SelectorBasic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: props.defaultValue || ''
    }
    this.isControl = props.hasOwnProperty('value');

    this.value = props.defaultValue;
  }
  changeValue(nextValue, idx) {
    const {onChange} = this.props;
    if(!this.isControl) {
      this.setState({
        selectedValue: nextValue
      });
    }
    this.value = nextValue;
    $GH.CallFunc(onChange)(this.value, idx);
  }
}
SelectorBasic.propTypes = {
  values: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  checkAllBtn: PropTypes.bool,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  didMountChange: PropTypes.bool,
  itemWidth: PropTypes.any,
}
