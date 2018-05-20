import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class RadioHelper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: props.defaultValue || ''
    }
    this.isControl = props.hasOwnProperty('value');

    this.value = props.defaultValue;
  }
  shouldUpdateComponent(nextState, nextProps) {
    const isChange = this.isControl ? JSON.stringify(this.props) !== JSON.stringify(nextProps) : JSON.stringify(this.state) !== JSON.stringify(nextState);
    return isChange;
  }
  selectAll() {
    let nextValue = [];
    const values = this.getValueArray();
    values.forEach(val => nextValue.push(val.value));
    if(this.isSelectedAll(nextValue)) nextValue = [];
    this.changeValue(nextValue);
  }
  isSelectedAll(selectItems) {
    return (this.valueFilter() || []).length == selectItems.length;
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
  selectItem(value, idx) {
    const {isMultiple} = this.props;
    const selectedValue = this.valueFilter();

    let nextValue;

    if(isMultiple) {
      nextValue = [...(selectedValue || [])];
      if(nextValue.indexOf(value) == -1) {
        nextValue.push(value);
      } else {
        nextValue = $GH.RemoveArrayItem(nextValue, value);
      }
    } else {
      nextValue = value;
    }
    this.changeValue(nextValue, idx);
  }
  getValueArray() {
    const {values} = this.props;
    return Array.isArray(values) ? values : this.wrapObjValToArr(values);
  }
  wrapObjValToArr(values) {
    return Object.keys(values).map(valKey => ({
      text: values[valKey],
      value: valKey
    }))
  }
  valueFilter() {
    return this.isControl ? this.props.value : this.state.stateValue;
  }
  componentDidMount() {
    const {defaultValue, isMultiple = false, didMountChange = true} = this.props;
    const values = this.getValueArray();
    if(!didMountChange || isMultiple) return;
    let _defVal = values[0] ? values[0].value : '';
    this.selectItem(defaultValue === 0 ? 0 : defaultValue || _defVal, 0);
  }
  render() {
    const {itemWidth = 100, isMultiple, checkAllBtn = true} = this.props;
    const values = this.getValueArray();
    // const {selectedValue} = this.state;
    const selectedValue = this.valueFilter();

    const selectAllBtn = isMultiple && checkAllBtn ? (
      <span
        className="btn warn flat selectAllBtn"
        onClick={e => this.selectAll()}>全选</span>
    ) : null;

    const container = values.map((item, idx) => {
      let {text, value, img} = item;
      let isActive = isMultiple ? (selectedValue || []).indexOf(value) > -1 : selectedValue === value;

      let imgCon = img ? (
        <img src={img}/>
      ) : null;

      return (
        <div
          className={"block-radio text-center" + (isActive ? ' active' : '')}
          style={{width: itemWidth}}
          key={idx} onClick={e => this.selectItem(value, idx)}>
          {imgCon}
          <div className="pu5">{text}</div>
          <div className="caret"></div>
        </div>
      )
    });
    return (
      <div className="radio-container">
        <div className="radio-group layout">
          {selectAllBtn}
          {container}
        </div>
      </div>
    );
  }
}
RadioHelper.propTypes = {
  values: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  checkAllBtn: PropTypes.bool,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  didMountChange: PropTypes.bool,
  itemWidth: PropTypes.any,
}
