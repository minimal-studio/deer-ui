import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {ToFixed} from 'basic-helper';

import InputVerify from '../form-control/input-verify';

export default class Ranger extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.number,
    basicUnit: PropTypes.number,
    disabled: PropTypes.bool,
    precent: PropTypes.bool,
    withInput: PropTypes.bool,
    range: PropTypes.array
  };
  constructor(props) {
    super(props);

    this.isControl = props.hasOwnProperty('value');

    let defaultValue = props.defaultValue || 0;
    let {range = [0, 1]} = props;
    let [min, max] = range;
    let isRevert = min > max;
    if(isRevert) [max, min] = [min, max];
    this.isRevert = isRevert;

    this.max = max;
    this.min = min;

    let defaultPosition = this.valToPercent(defaultValue);
    this.originalOffsetPercent = defaultPosition;
    this.offsetPercent = defaultPosition;

    this.state = {
      stateValue: defaultValue,
      draping: false
    }
    this.value = defaultValue;
    this.drapElemInfo = {
      dragOriginX: 0,
      elemOrigonX: 0
    }
  }
  shouldUpdateComponent(nextState, nextProps) {
    const isChange = this.isControl ? JSON.stringify(this.props) !== JSON.stringify(nextProps) : JSON.stringify(this.state) !== JSON.stringify(nextState);
    return isChange;
  }
  componentDidMount() {
    const self = this;
    setTimeout(() => {
      self.initData();
    }, 50);
  }
  initData() {
    const {min, max} = this;
    this.drapElemInfo.dragElem = this.handle;
    this.rangerBodyWidth = this.rangerContainer.offsetWidth;
    this.preUnitPixel = this.rangerBodyWidth / (max - min);
  }
  handleMouseDown(event) {
    event.stopPropagation();
    this.drapElemInfo = {
      ...this.drapElemInfo,
      dragOriginX: event.clientX
    };
    this.setState({
      draping: true
    });
    this.mouseMoving();
  }
  mouseMoving() {
    let self = this;
    this.setEvent = this.movingHandle.bind(self);
    this.dragEvent = this.dragEnd.bind(self);
    document.addEventListener('mousemove', this.setEvent, false);
    document.addEventListener('mouseup', this.dragEvent, false);
  }
  mouseMoved() {
    let self = this;
    document.removeEventListener('mousemove', this.setEvent, false);
    document.removeEventListener('mouseup', this.dragEvent, false);
  }
  dragEnd(event) {
    if (!this.state.draping) return;

    const endX = this.drapElemInfo.dragOriginX + this.offsetPercent;

    this.drapElemInfo = {
      ...this.drapElemInfo,
      dragOriginX: endX
    };
    this.mouseMoved();
    this.setEndPosition(this.offsetPercent);
    this.setState({
      draping: false
    });
  }
  percentToVal(percent) {
    if(percent - 1 < -1) return;
    const {basicUnit = 1} = this.props;
    const {min, max} = this;
    let _val = Math.floor(percent * (max - min) / 100 + min, 0) || 0;
    if(_val % basicUnit !== 0) _val += 1;
    return _val;
  }
  valToPercent(val) {
    if(val - 1 < -1) return;
    const {min, max} = this;
    let _precent = +(ToFixed((val - min) * 100 / (max - min), 0)) || 0;
    return _precent;
  }
  setEndPosition(offsetPercent) {
    this.originalOffsetPercent = offsetPercent;
    // this.setState({
    //   originalOffsetPercent: offsetPercent
    // });
  }
  changeValue(val, emitChangeEvent = true) {
    if(val - 1 < -1) return;

    const {disabled, basicUnit = 1, onChange} = this.props;
    if(disabled) return;
    const {min, max} = this;

    if(val < min) val = min;
    if(val > max) val = max;

    if(!this.isControl) {
      this.setState({
        stateValue: val,
        // offsetPercent: this.valToPercent(val) || 0
      });
    }
    this.offsetPercent = this.valToPercent(val) || 0;

    this.value = val;
    if(emitChangeEvent) onChange(val);
  }
  movingHandle(event) {
    if (!this.state.draping) return;

    const {dragOriginX, dragElem} = this.drapElemInfo;

    const moveOffset = this.isRevert ? dragOriginX - event.clientX : event.clientX - dragOriginX;

    let currOffsetPer = Math.round(moveOffset / this.rangerBodyWidth * 100 + this.originalOffsetPercent);

    if(currOffsetPer < 0) currOffsetPer = 0;
    if(currOffsetPer > 100) currOffsetPer = 100;

    this.changeValue(this.percentToVal(currOffsetPer));
  }
  plusAndLess(mark) {
    const {basicUnit = 1} = this.props;
    const stateValue = this.valueFilter();

    let each = basicUnit;
    if(mark == '-') each = -each;
    if(this.isRevert) each = -each;
    let _val = stateValue + each;

    this.changeValue(_val, true);
    this.setEndPosition(this.valToPercent(_val));
  }
  valueFilter() {
    return this.isControl ? this.props.value || 0 : this.state.stateValue || 0;
  }
  render() {
    const stateValue = this.valueFilter();
    const {disabled, precent = false, range, withInput = true, basicUnit} = this.props;
    const {draping} = this.state;

    var handleW = 20;
    var handleStyle = {
      marginLeft: - handleW / 2,
      left: `${this.offsetPercent}%`
    };
    if(this.isRevert) {
      handleStyle = {
        marginRight: - handleW / 2,
        right: `${this.offsetPercent}%`
      }
    }

    let _value = precent ? (stateValue / 10).toFixed(1) : stateValue.toFixed(0);

    return (
      <div className={`uke-ranger ${disabled ? 'disabled' : ''} ${draping ? 'draping' : ''} ${withInput ? 'with-input' : ''}`}>
        <div className="disabled-mask"></div>
        <div className="ranger"
          onMouseDown={e => this.handleMouseDown(e)}>
          {/* <span className="less handle-btn"
            onClick={e => this.plusAndLess('-')}>-</span> */}
          <div className="all-process"
            ref={c => {
              if(c) this.rangerContainer = c;
            }}>
            <div className="active-process" style={{
              width: this.offsetPercent + '%'
            }}></div>
            <div className="handle"
              ref={h => {
                if(h) this.handle = h;
              }}
              style={handleStyle}>
              <div className="hide-value" ref="valueCon">
                <span className="text">{_value}{precent ? '%' : ''}</span>
                <span className="caret"></span>
              </div>
            </div>
          </div>
          {/* <span className="plus handle-btn" onClick={e => this.plusAndLess('+')}> + </span> */}
        </div>
        {
          withInput ? (
            <InputVerify 
              value={+stateValue}
              inputable={false}
              precent={precent}
              numRange={[0, range[1]]}
              unit={basicUnit}
              onChange={val => this.changeValue(val)}/>
          ) : null
        }
      </div>
    )
  }
}
