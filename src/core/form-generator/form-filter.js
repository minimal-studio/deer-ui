import React, {Component, PureComponent} from 'react';
import {CallFunc, IsFunc, HasValue} from 'basic-helper';

import {DatetimePicker, DatepickerHelper} from '../datetimepicker';
import {Radio, DropdownMenu} from '../selector';
import {Input} from '../form-control';
import Ranger from '../range-selector';
import Captcha from '../captcha';

/**
 * 表单生成器
 * 统一的聚合表单
 */
export default class FormFilterHelper extends Component {
  constructor(props) {
    super(props);
    this.value = {};
    this.requiredRefMapper = {}; // 用于检测是否通过表单强制要求验证的mapper

    this.initValues();
  }
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
    const {conditionConfig, formOptions} = nextProps;
    const configArr = formOptions || conditionConfig || [];
    configArr.forEach(config => this.setRequiredRefMapper(config));
  }
  componentWillUnmount() {
    this.value = {};
    this.requiredRefMapper = {};
  }
  setRequiredRefMapper(config) {
    const {required, title = '', ref} = this.wrapConditionTitle(config);
    if(!required) return;
    this.requiredRefMapper = Object.assign({}, this.requiredRefMapper, {
      [ref]: title
    });
  }
  setDefaultValues(options = []) {
    options.forEach(config => {
      this.setDefaultValue(config);
      this.setRequiredRefMapper(config);
    });
  }
  setDefaultValue(config) {
    const {
      defaultValue, ref, refs, range
    } = config;
    if(!!ref) this.value[ref] = defaultValue;

    if(Array.isArray(refs)) {
      refs.forEach((_ref, idx) => this.value[_ref] = range[idx]);
    }
  }
  checkForm() {
    let {requiredRefMapper} = this;
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
    CallFunc(this.showDesc(checkRes));
    return checkRes;
  }
  wrapConditionTitle(config) {
    config.title = config.title || $UKE.getKeyMap(config.ref) || config.ref || '';
    return config;
  }
  focusRef(ref) {
    const targetDOM = this.refs[ref];
    if(!!targetDOM && !!targetDOM.focus) targetDOM.focus();
  }
  changeValue(value, ref, update = true) {
    if(this.value[ref] === value) return;
    this.value[ref] = value;
    if(update) this.forceUpdate();
    CallFunc(this.props.onChange)(this.value, ref);
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
      self.changeValue(val, ref);
    });
  }
  refreshCaptcha(ref) {
    this.refs[ref].refreshCaptcha();
  }
  zeroFilter(target, compare) {
    return target === 0 ? 0 : (target || compare);
  }
  getValue(ref, other) {
    let targetVal = this.value[ref];
    return HasValue(targetVal) ? targetVal : other;
  }
  greneratFormDOM(config) {
    const {
      ref, type, className, getCustomFormControl
    } = config;
    switch (type) {
      case 'customForm':
        let customeComponent = IsFunc(getCustomFormControl) ? getCustomFormControl() : null;
        return customeComponent.component ? (
          <customeComponent.component
            {...config}
            {...customeComponent.props}
            onChange={val => this.changeValue(val, ref)}/>
        ) : null;
      case 'captcha':
        let captchaKeyRef = 'CaptchaKey';
        let captchaForUsernameRef = 'CaptchaForUsername';
        return (
          <Captcha
            {...config}
            value={this.getValue(ref)}
            onChange={captchaConfig => {
              this.changeValue(captchaConfig.value, ref);
              if(captchaConfig.isPass) {
                this.changeValue(captchaConfig.key, captchaKeyRef);
                this.changeValue(captchaConfig.forUsername, captchaForUsernameRef);
              }
            }}/>
        );
      case 'select-n':
        var {values} = config;
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
                    value={val}>{values[val]}</option>
                )
              })
            }
          </select>
        )
      case 'select':
        return (
          <DropdownMenu
            {...config}
            value={this.getValue(ref)}
            onChange={val => {
              this.changeValue(val, ref)
            }}
          />
        )
      case 'input':
      case 'password':
        var formClass = 'form-control ' + (className || '');
        return (
          <Input
            icon={config.icon}
            inputBtnConfig={config.inputBtnConfig}
            ref={config.ref}
            className={formClass}
            required={config.required}
            value={this.zeroFilter(this.getValue(ref), '')}
            type={config.type == 'input' ? 'text' : 'password'}
            placeholder={config.placeholder || config.title}
            readOnly={config.readOnly}
            onBlur={e => {
              let __val = e.target.value.trim()
              this.changeValue(__val, ref);
              CallFunc(config.onBlur)(__val);
            }}
            onChange={(__val, elem) => {
              if (config.disabled) return;
              // let __val = elem.value;
              let {inputType = 'string'} = config;
              if(inputType == 'dotnumber') {
                let _tmpVal = +__val
                __val = _tmpVal === 0 ? (__val == '0.' ? '0.' : undefined) : (_tmpVal ? (/\.\d{3,}/.test(__val) ? _tmpVal.toFixed(2) : __val): undefined)
              };
              if(inputType == 'number') __val = ((+__val === 0 ? (__val === '' ? '' : 0) : (+__val || ''))+'').replace(/\..+/, '');
              if(inputType == 'string') __val = __val + '';
              this.changeValue(__val, ref);
            }}/>
        )
      case 'textarea':
        return (
          <textarea
            defaultValue={this.getValue(ref)}
            className="form-control"
            id={ref}
            onBlur={e => this.changeValue(e.target.value, ref)}></textarea>
        )
      case 'ranger':
        return (
          <Ranger
            {...config}
            value={this.getValue(ref)}
            onChange={val => this.changeValue(val, ref)}/>
        )
      case 'text':
        return (
          <span className={config.highlight ? 'highlight' : ''}>{this.getValue(ref, config.value || config.text)}</span>
        )
      case 'radio':
        return (
          <Radio
            {...config}
            value={this.zeroFilter(this.value[ref])}
            onChange={val => {
              this.changeValue(val, ref);
            }}
          />
        );
      case 'button':
        return (
          <span
            className={'btn flat ' + config.className}
            onClick={e => config.onClick(e, ref)}
          >{config.text}</span>
        );
      case 'datetime':
        var {needTime = true, title} = config;
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
      case 'datetimeRange':
        var {needTime = true, refs, range, clickToClose} = config;
        var datetimeRangeRef = 'datetimeRangeRef';
        let [refS, refE] = refs;
        let [rangeS, rangeE] = range;

        const changeDateValues = (vals) => {
          this.changeValues({
            [refS]: vals[0],
            [refE]: vals[1],
            [datetimeRangeRef]: vals
          });
        }

        let datePickerHelper = !config.noHelper ? (
          <DatepickerHelper
            {...config}
            value={this.getValue(ref)}
            onClick={val => changeDateValues(val)
          }/>
        ) : null;

        return (
          <div className="datepicker-ranger-content">
            <span className="title">起始范围</span>
            <DatetimePicker
              mode="range"
              ref={datetimeRangeRef}
              id={datetimeRangeRef}
              value={this.value[datetimeRangeRef] || range}
              onChange={(val) => changeDateValues(val)}/>
            {datePickerHelper}
          </div>
        );
    }
  }
}
