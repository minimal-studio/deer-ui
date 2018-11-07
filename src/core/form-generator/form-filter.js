import React, { Component } from 'react';
import { Call, CallFunc, IsFunc, HasValue } from 'basic-helper';

import { DatetimePicker, DateShortcut } from '../datetimepicker';
import { Radio, DropdownMenu } from '../selector';
import { Input } from '../form-control';
import { Ranger } from '../range-selector';
import { Captcha } from '../captcha';
import InputSelector from '../form-control/input-selector';

/**
 * 表单生成器
 * 统一的聚合表单
 */
export default class FormFilterHelper extends Component {
  _refs = {};
  constructor(props) {
    super(props);
    this.value = {};
    this.requiredRefMapper = {}; // 用于检测是否通过表单强制要求验证的mapper

    this.initValues();
  }
  gm = window.$UKE.getKeyMap;
  initValues() {
    const {conditionConfig, formOptions} = this.props;
    this.setDefaultValues(formOptions || conditionConfig);
  }
  resetValues() {
    this.initValues();
  }
  componentWillReceiveProps(nextProps) {
    this.resetRequireRefMapper(nextProps);
  }
  resetRequireRefMapper(nextProps = this.props) {
    this.requiredRefMapper = {};
    const { conditionConfig, formOptions } = nextProps;
    const configArr = formOptions || conditionConfig || [];
    configArr.forEach(config => this.setRequiredRefMapper(config));
  }
  componentWillUnmount() {
    this.value = {};
    this.requiredRefMapper = {};
  }
  setRequiredRefMapper(config) {
    if(!config) return;
    const { required, title = '', ref, refs, refu } = this.wrapConditionTitle(config);
    if(!required) return;
    switch (true) {
    case ref:
      this._requiredMapperSetter(ref, title);
      break;
    case refs:
      for (const _ref of refs) {
        this._requiredMapperSetter(_ref, title);
      }
      break;
    case refu:
      for (const _ref in refs) {
        this._requiredMapperSetter(_ref, title);
      }
      break;
    }
  }
  _requiredMapperSetter = (ref, title) => {
    this.requiredRefMapper = Object.assign({}, this.requiredRefMapper, {
      [ref]: title
    });
  }
  setDefaultValues(options = []) {
    options.forEach(config => {
      if(!config) return;
      this.setDefaultValue(config);
      this.setRequiredRefMapper(config);
    });
  }
  setDefaultValue(config) {
    const {
      defaultValue, ref, refs, range, refu, refuDefaultIdx = 0
    } = config;
    if(ref) this.value[ref] = defaultValue;
    if(Array.isArray(refu)) this.value[refu[refuDefaultIdx]] = defaultValue;

    if(Array.isArray(refs)) {
      refs.forEach((_ref, idx) => {
        this.value[_ref] = range ? range[idx] : '';
      });
    }
  }
  checkForm() {
    let { requiredRefMapper } = this;
    let isPass = Object.keys(requiredRefMapper).length == 0;
    let desc = '';
    let ref = '';
    let requiredRefs = Object.keys(requiredRefMapper);
    for(let i = 0; i < requiredRefs.length; i++) {
      let itemRef = requiredRefs[i];
      let currVal = this.value[itemRef];
      if(!HasValue(currVal)) {
        isPass = false;
        desc = requiredRefMapper[itemRef];
        ref = itemRef;
        this.focusRef(ref);
        break;
      }
      isPass = true;
    }
    let checkRes = {
      isPass,
      desc,
      ref
    };
    CallFunc(this.showDesc)(checkRes);
    return checkRes;
  }
  wrapConditionTitle(config) {
    config.title = config.title || this.gm(config.ref) || config.ref || '';
    return config;
  }
  focusRef(ref) {
    const targetDOM = this._refs[ref];
    if(!!targetDOM && !!targetDOM.focus) targetDOM.focus();
  }
  changeValue(value, ref, update = true) {
    if(this.value[ref] === value) return;
    this.value[ref] = value;
    if(update) this.forceUpdate();
    Call(this.props.onChange, this.value, ref);
  }
  changeValues(valRefMapper, update = true) {
    const refs = Object.keys(valRefMapper);
    const self = this;
    /**
     * valRefMapper
     * {
     *   ref: val
     * }
     */
    refs.forEach(ref => {
      const val = valRefMapper[ref];
      self.changeValue(val, ref, update);
    });
  }
  refreshCaptcha(ref) {
    console.log(ref)
    this._refs[ref].refreshCaptcha();
  }
  zeroFilter(target, compare) {
    return target === 0 ? 0 : (target || compare);
  }
  getValue(ref, other) {
    let targetVal = this.value[ref];
    return HasValue(targetVal) ? targetVal : other;
  }
  onInputChange = ({val, disabled, inputType = 'string', ref}) => {
    if (disabled) return;
    let __val = val;
    // let __val = elem.value;
    switch (inputType) {
    case 'dotnumber':
      let _tmpVal = +__val;
      __val = _tmpVal === 0 ? (__val == '0.' ? '0.' : undefined) : (_tmpVal ? (/\.\d{3,}/.test(__val) ? _tmpVal.toFixed(2) : __val): undefined);
      break;
    case 'number':
      __val = +((+__val === 0 ? (__val === '' ? '' : 0) : (+__val || '')) + '').replace(/\..+/, '');
      break;
    case 'string':
      __val = __val + '';
      break;
    }
    // if(inputType == 'dotnumber') {
    //   let _tmpVal = +__val;
    //   __val = _tmpVal === 0 ? (__val == '0.' ? '0.' : undefined) : (_tmpVal ? (/\.\d{3,}/.test(__val) ? _tmpVal.toFixed(2) : __val): undefined);
    // }
    // if(inputType == 'number') __val = ((+__val === 0 ? (__val === '' ? '' : 0) : (+__val || ''))+'').replace(/\..+/, '');
    // if(inputType == 'string') __val = __val + '';
    this.changeValue(__val, ref);
  }
  getCustomForm = (config) => {
    const { ref, getCustomFormControl } = config;
    let customeComponent = IsFunc(getCustomFormControl) ? getCustomFormControl() : null;

    return customeComponent.component ? (
      <customeComponent.component
        {...config}
        {...customeComponent.props}
        onChange={val => this.changeValue(val, ref)}/>
    ) : null;
  }
  getCaptcha = (config) => {
    const { ref } = config;
    let captchaKeyRef = 'CaptchaKey';
    let captchaForUsernameRef = 'CaptchaForUsername';
    return (
      <Captcha
        {...config}
        value={this.getValue(ref)}
        ref={e => this._refs['CaptchaCode'] = e}
        onChange={captchaConfig => {
          this.changeValue(captchaConfig.value, ref);
          if(captchaConfig.isPass) {
            this.changeValue(captchaConfig.key, captchaKeyRef);
            this.changeValue(captchaConfig.forUsername, captchaForUsernameRef);
          }
        }}/>
    );
  }
  getSelectNative = (config) => {
    let { values, ref } = config;
    return (
      <select 
        className="form-control"
        value={this.getValue(ref)} onChange={e => {
          this.changeValue(e.target.value, ref);
        }}>
        {
          Object.keys(values).map((val, idx) => {
            return (
              <option 
                key={val}
                value={val}>
                {values[val]}
              </option>
            );
          })
        }
      </select>
    );
  }
  getSelect = (config) => {
    const { ref } = config;
    return (
      <DropdownMenu
        {...config}
        value={this.getValue(ref)}
        onChange={val => {
          this.changeValue(val, ref);
        }}/>
    );
  }
  getInputSelector = (config) => {
    let { inputProps = {}, refu, ref } = config;
    return (
      <InputSelector 
        {...config}
        values={refu}
        inputProps={inputProps}
        value={this.zeroFilter(this.getValue(ref), '')}
        onChange={(val, activeRef) => {
          Object.keys(refu).map((itemRef) => {
            if(activeRef != itemRef) delete this.value[itemRef];
          });
          this.onInputChange({val, ref: activeRef});
        }}/>
    );
  }
  getInputRange = (config) => {
    const { refs, formClass } = config;
    let [refS, refE] = refs;
    return (
      <div className="input-range">
        <Input
          ref={e => this._refs[refS] = e}
          className={formClass}
          value={this.zeroFilter(this.getValue(refS), '')}
          placeholder={this.gm("起")}
          onChange={(val) => this.onInputChange({val, ref: refS})}/>
        <span> - </span>
        <Input
          ref={e => this._refs[refE] = e}
          className={formClass}
          value={this.zeroFilter(this.getValue(refE), '')}
          placeholder={this.gm("止")}
          onChange={(val) => this.onInputChange({val, ref: refE})}/>
      </div>
    );
  }
  getInput = (config) => {
    const { ref, className, type } = config;
    let formClass = 'form-control ' + (className || '');
    return (
      <Input
        {...config}
        ref={e => this._refs[ref] = e}
        className={formClass}
        value={this.zeroFilter(this.getValue(ref), '')}
        type={/input|text/.test(type) ? 'text' : (/password|pw/.test(type) ? 'password' : 'text')}
        placeholder={config.placeholder || config.title}
        onBlur={e => {
          let __val = e.target.value.trim();
          this.changeValue(__val, ref);
          Call(config.onBlur, __val);
        }}
        onChange={(val, elem) => this.onInputChange({
          val, ref, inputType: config.inputType
        })}/>
    );
  }
  getTextArea = (config) => {
    const { ref } = config;
    return (
      <textarea
        defaultValue={this.getValue(ref)}
        className="form-control"
        id={ref}
        onBlur={e => this.changeValue(e.target.value, ref)} />
    );
  }
  getRange = (config) => {
    const { ref } = config;
    return (
      <Ranger
        {...config}
        value={this.getValue(ref)}
        onChange={val => this.changeValue(val, ref)}/>
    );
  }
  getText = (config) => {
    const { ref, highlight, value, text } = config;
    return (
      <span className={highlight ? 'highlight' : ''}>
        {this.getValue(ref, value || text)}
      </span>
    );
  }
  getRadio = (config) => {
    const { ref } = config;
    return (
      <Radio
        {...config}
        value={this.zeroFilter(this.value[ref])}
        onChange={val => {
          this.changeValue(val, ref);
        }}/>
    );
  }
  getButton = (config) => {
    const { ref, className, text, onClick } = config;
    return (
      <span
        className={'btn flat ' + className}
        onClick={e => Call(onClick, e, ref)}>
        {text}
      </span>
    );
  }
  getDatetime = (config) => {
    let { ref, needTime = true } = config;
    return (
      <DatetimePicker
        {...config}
        needTime={needTime}
        id={ref}
        value={this.getValue(ref)}
        onChange={val => {
          this.changeValue(val, ref);
        }}/>
    );
  }
  getDatetimeRange = (config) => {
    let { ref, range, refs } = config;
    let [refS, refE] = refs;
    let datetimeRangeRef = refS[0] + 'datetimeRangeRef';

    const changeDateValues = (vals) => {
      this.changeValues({
        [refS]: vals[0],
        [refE]: vals[1],
        [datetimeRangeRef]: vals
      });
    };

    return (
      <div className="datepicker-ranger-content">
        <span className="title">{this.gm('范围')}</span>
        <DatetimePicker
          mode="range"
          {...config}
          ref={e => this._refs[datetimeRangeRef] = e}
          id={datetimeRangeRef}
          value={this.value[datetimeRangeRef] || range}
          onChange={(val) => changeDateValues(val)}/>
        {
          !config.noHelper ? (
            <DateShortcut
              {...config}
              value={this.getValue(ref)}
              onClick={val => changeDateValues(val)}/>
          ) : null
        }
      </div>
    );
  }
  typeMapper = {
    'customForm': this.getCustomForm,
    'captcha': this.getCaptcha,
    'select-n': this.getSelectNative,
    'select': this.getSelect,
    'input-selector': this.getInputSelector,
    'input-range': this.getInputRange,
    'input': this.getInput,
    'password': this.getInput,
    'textarea': this.getTextArea,
    'ranger': this.getRange,
    'text': this.getText,
    'radio': this.getRadio,
    'button': this.getButton,
    'datetime': this.getDatetime,
    'datetimeRange': this.getDatetimeRange,
  }
  greneratFormDOM(config) {
    const { type } = config;
    const generator = this.typeMapper[type];

    return generator && generator(config);
  }
}
