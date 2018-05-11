import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class CheckboxHelper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: [],
      allOptions: [],
      allChecked: false
    }
  }
  selectItem(value) {
    if(value == 'all') return this.selectAllItems();

    const {onChange} = this.props;
    let {selectedValues, allOptions} = this.state;
    let isAllSelected = false;
    const isRepeated = selectedValues.indexOf(value) > -1;
    if (isRepeated) {
      selectedValues = selectedValues.filter(v => {
        if (v != value) return v;
      });
    } else {
      selectedValues = selectedValues.concat(value);
      if (allOptions.length && allOptions.length === selectedValues.length) {
        isAllSelected = true;
      }
    }
    this.setState({
      selectedValues: selectedValues,
      allChecked: isAllSelected
    });
    // this.value = selectedValues;
    // const resultStr = selectedValues.join(',');
    //$GH.CallFunc(onChange)(resultStr);
    this.outputHandler(selectedValues, onChange);
  }
  selectAllItems() {
    const {onChange} = this.props;
    const {allChecked, allOptions} = this.state;
    let nextSelectedValues = [];
    if (!allChecked) {
      nextSelectedValues = allOptions;
    }
    this.setState({
      allChecked: !allChecked,
      selectedValues: nextSelectedValues
    });
    this.outputHandler(nextSelectedValues, onChange);
  }
  outputHandler(result, cb) {
    this.value = result;
    const resultStr = result.join(',');
   $GH.CallFunc(cb)(resultStr);
  }
  getAllOptions(values) {
    const _values = values || this.props.values;

    let allOptions = [];
    _values.forEach(v => {
      const {value = ''} = v;
      allOptions = allOptions.concat(value);
    });
    this.setState({allOptions});
  }
  componentDidMount() {
    const {defaultValue = '', onChange} = this.props;
    let _defVal = defaultValue.length ? defaultValue.split(',') : [];
    this.setState({selectedValues: _defVal});
    this.getAllOptions();
    this.outputHandler(_defVal, onChange);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.values && this.props.values !== nextProps.values) {
      this.getAllOptions(nextProps.values);
    }
  }
  render() {
    const {values, needAllCheck = false} = this.props;
    const {selectedValues = [], allChecked} = this.state;

    const container = (
      <div className="checkbox-group">
        <div className={"select-all checkbox-item" + (needAllCheck ? '' : ' hide')} onClick={e => this.selectAllItems()}>
          <input type="checkbox" checked={allChecked}/>{!allChecked ? '选择全部' : '取消全选'}
        </div>
        {
          values.map((item, idx) => {
            let {text, value} = item;
            let isSelected = selectedValues.indexOf(value) > -1;
            return (
              <div key={idx} className="checkbox-item" onClick={e => this.selectItem(value)}>
                <input type="checkbox" checked={isSelected}/> {text}
              </div>
            )
          })
        }
      </div>
    );

    return container;
  }
}
CheckboxHelper.propTypes = {
  // values: [
  //   {
  //     text: '',
  //     value: '',
  //   }
  // ]
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  needAllCheck: PropTypes.bool,
  defaultValue: PropTypes.any
}
