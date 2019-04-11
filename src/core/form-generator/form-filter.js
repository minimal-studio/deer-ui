import React, { Component } from 'react';
import { Call, CallFunc, IsFunc, HasValue, IsObj } from 'basic-helper';

import { UkeComponent } from '../uke-utils';

import { DatetimePicker, DateShortcut } from '../datetimepicker';
import { Radio, DropdownMenu, Checkbox } from '../selector';
import { Input } from '../form-control';
import { Ranger } from '../range-selector';
import { Captcha } from '../captcha';
import { ToolTip } from '../tooltip';
import InputSelector from '../form-control/input-selector';
import Switch from '../switch-button/switch';

const wrapInputSelectorMarkForRefu = (activeRef) => {
  return `__isActive${activeRef}`;
};

/**
 * 表单生成器
 * 统一的聚合表单
 */
export default class FormFilterHelper extends UkeComponent {
  _refs = {};
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      value: {}
    };
    this.value = {};
    this.requiredRefMapper = {}; // 用于检测是否通过表单强制要求验证的mapper

    this.initValues(props);
  }
  componentWillUnmount() {
    this.value = {};
    this.requiredRefMapper = {};
  }
  componentDidUpdate(prevProps, prevState) {
    this.checkFormOptions(prevProps);
  }
  initValues(props) {
    const formOptions = this.getFormOptions(props);
    this.setDefaultValues(formOptions);
  }
  resetValues(props = this.props) {
    const formOptions = this.getFormOptions(props);
    let nextValue = {};
    for (const options of formOptions) {
      // const val = this.value[valKey];
      const { ref, refs } = options;
      if(this.value[ref]) nextValue[ref] = this.value[ref];
      if(Array.isArray(refs)) {
        const refsID = this.getRefsID(refs);
        if(this.value[refsID]) nextValue[refsID] = this.value[refsID];
        for (const itemRef of refs) {
          if(this.value[itemRef]) nextValue[itemRef] = this.value[itemRef];
        }
      }
    }
    this.value = nextValue;
    this.initValues(props);
  }
  getFormOptions(props = this.props) {
    if(!props) return [];
    return props.formOptions || props.conditionConfig;
  }
  checkFormOptions(prevProps) {
    const thisFormOptions = this.getFormOptions(this.props);
    const prevFormOptions = this.getFormOptions(prevProps);
    if(thisFormOptions != prevFormOptions) {
      this.resetValues();
      this.resetRequireRefMapper(this.props);
    }
  }
  resetRequireRefMapper(nextProps = this.props) {
    this.requiredRefMapper = {};
    const formOptions = this.getFormOptions(nextProps);
    const configArr = formOptions;
    for (let i = 0; i < configArr.length; i++) {
      const config = configArr[i];
      this.setRequiredRefMapper(config);
    }
    // configArr.forEach(config => this.setRequiredRefMapper(config));
  }
  setRequiredRefMapper(config) {
    if(!config || !config.required) return;

    const { title = '', ref, refs, refu } = this.wrapConditionTitle(config);
    switch (true) {
    case !!ref:
      this._requiredMapperSetter(ref, title);
      break;
    case !!refs:
      for (const _ref of refs) {
        this._requiredMapperSetter(_ref, title);
      }
      break;
    case !!refu:
      for (const _ref in refu) {
        if(refu.hasOwnProperty(_ref)) {
          this._requiredMapperSetter(_ref, title);
        }
      }
      break;
    }
  }
  clearValue = () => {
    this.setState(() => {
      this.value = {};
      this.requiredRefMapper = {};
      return {
        value: {}
      };
    });
  }
  _requiredMapperSetter = (ref, title) => {
    this.requiredRefMapper = Object.assign({}, this.requiredRefMapper, {
      [ref]: title
    });
  }
  setDefaultValues(options = []) {
    for (let i = 0; i < options.length; i++) {
      const config = options[i];
      if(config) {
        this.setDefaultValue(config);
        this.setRequiredRefMapper(config);
      }
    }
  }
  setDefaultValue(config) {
    const {
      defaultValue, ref, refs, range, refu, refForS, defaultValueForS,
    } = config;

    if(HasValue(defaultValue)) {
      /** 观察这个地方，可能引起的内容不更新的问题 */
      if(ref) this.value[ref] = this.value[ref] || defaultValue;
      if(refForS) this.value[refForS] = this.value[refForS] || defaultValueForS;
      if(IsObj(refu)) {
        /** 判断是否有 defaultValueForS，如果有则直接使用，否则区 refu 第一个作为默认值 */
        let targetKey;
        if(HasValue(defaultValueForS)) {
          targetKey = defaultValueForS;
        } else {
          targetKey = Object.keys(refu)[0];
        }
        this.value[targetKey] = defaultValue;
      }
    }

    if(Array.isArray(range) && Array.isArray(refs)) {
      refs.forEach((_ref, idx) => {
        this.value[_ref] = range[idx];
      });
    }
  }
  checkForm() {
    let { requiredRefMapper } = this;
    let isPass = Object.keys(requiredRefMapper).length == 0;
    let desc = '';
    let ref = '';
    const requiredRefs = Object.keys(requiredRefMapper);
    const len = requiredRefs.length;
    for(let i = 0; i < len; i++) {
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
    const { title, tips, ref } = config;
    config.title = title || this.gm(ref) || ref || '';
    if(tips) config.tipsDOM = ( 
      <ToolTip classNames={['mr5']} title={tips} n="question" s="r"/>
    );
    return config;
  }
  focusRef(ref) {
    const targetDOM = this._refs[ref];
    if(!!targetDOM && !!targetDOM.focus) targetDOM.focus();
  }
  /**
   * 改变单个值
   * @public
   * @param {any} value 目标改变的值的 value
   * @param {string} ref 改变的值的 ref
   * @param {boolean} update 是否更新视图
   */
  changeValue(value, ref, update = true) {
    if(this.value[ref] === value) return;
    this.value[ref] = value;
    if(update) this.setState({
      value: this.value
    });
    Call(this.props.onChange, this.value, ref, value);
  }
  /**
   * 改变多个值
   * @public
   * @param {object} valRefMapper 改变的值的 object
   * @param {boolean} update 是否更新视图
   */
  changeValues(valRefMapper, update = true) {
    const refs = Object.keys(valRefMapper);
    refs.forEach(ref => {
      const val = valRefMapper[ref];
      this.changeValue(val, ref, update);
    });
  }
  refreshCaptcha(ref) {
    this._refs[ref].refreshCaptcha();
  }
  zeroFilter(target, compare) {
    return target === 0 ? 0 : (target || compare);
  }
  getValue(ref, other) {
    let targetVal = this.value[ref];
    return HasValue(targetVal) ? targetVal : other;
  }
  saveRef = (ref) => {
    return elem => this._refs[ref] = elem;
  }
  loadPlugin = (Plugin, props) => {
    let P = IsFunc(Plugin) ? <Plugin /> : Plugin;

    P = React.cloneElement(P, props);

    return P;
  }
  /** 获取 refs 的 ID */
  getRefsID = (refs) => {
    return Array.isArray(refs) ? refs.join('-') : '';
  }
  /**
   * 表单插件接口
   *
   * @param {object} config 配置项
   * @memberof FormFilterHelper
   */
  getCustomForm = (config) => {
    const { ref, getCustomFormControl, ...other } = config;
    let customeComponent = IsFunc(getCustomFormControl) ? getCustomFormControl() : null;

    if(!customeComponent) return;

    const component = customeComponent.component || customeComponent;
    const cusProps = customeComponent.props || {};

    return this.loadPlugin(component, {
      ...other, ...cusProps, onChange: val => this.changeValue(val, ref),
      ref: this.saveRef(ref)
    });
  }
  getCaptcha = (config) => {
    const { ref, keyRef = 'CaptchaKey', ...other } = config;
    return (
      <Captcha
        {...other}
        value={this.getValue(ref) || ''}
        ref={this.saveRef('CaptchaCode')}
        onCaptchaLoad={captchKey => this.changeValue(captchKey, keyRef)}
        onChange={captchaConfig => {
          this.changeValue(captchaConfig.value, ref);
        }}/>
    );
  }
  getSelectNative = (config) => {
    let { values, ref } = config;
    return (
      <select 
        className="form-control"
        ref={this.saveRef(ref)}
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
    const { ref, ...other} = config;
    return (
      <DropdownMenu
        {...other}
        ref={this.saveRef(ref)}
        value={this.getValue(ref)}
        onChange={val => {
          this.changeValue(val, ref);
        }}/>
    );
  }
  getInputSelectorS = (config) => {
    const { inputProps = {}, defaultValueForS, refForS, values, required, ref, ...other } = config;
    return (
      <InputSelector 
        {...other}
        ref={this.saveRef(ref)}
        defaultSelectorIdx={defaultValueForS}
        values={values}
        inputProps={inputProps}
        value={this.zeroFilter(this.getValue(ref), '')}
        onChange={(val, activeRef) => {
          const isEmptyVal = val == '';
          this.changeValues({
            [ref]: isEmptyVal ? undefined : val,
            [refForS]: isEmptyVal ? undefined : activeRef
          });
        }}/>
    );
  }
  getInputSelector = (config) => {
    const { inputProps = {}, defaultValueForS, refu, required, ...other } = config;
    return (
      <InputSelector 
        {...other}
        ref={e => {
          for (const _ref in refu) {
            if(refu.hasOwnProperty(_ref)) {
              this.saveRef(_ref)(e);
            }
          }
        }}
        defaultSelectorIdx={defaultValueForS}
        values={refu}
        inputProps={inputProps}
        // value={this.zeroFilter(this.getValue(this[activeMark]), '')}
        onChange={(val, activeRef) => {
          if(!this.value.hasOwnProperty(activeRef)) {
            Object.keys(refu).map((itemRef) => {
              const activeMark = wrapInputSelectorMarkForRefu(activeRef);
              /** selector 改变时，需要把其余的清空，确保输出只有一个 */
              this[activeMark] = activeRef === itemRef;
              if(!this[activeMark]) {
                delete this.value[itemRef];
                delete this.requiredRefMapper[itemRef];
              } else if(required) {
                this.requiredRefMapper[activeRef] = config.title;
              }
            });
          }
          this.changeValue(val, activeRef);
        }}/>
    );
  }
  getInputRange = (config) => {
    /** 中间无用的是用于过滤 other */
    const { refs, formClass, type, title, ...other } = config;
    const [refS, refE] = refs;
    return (
      <div className="input-range">
        {this.getInput({ ref: refS, title: this.gm('起'), ...other})}
        <span> - </span>
        {this.getInput({ ref: refE, title: this.gm('止'), ...other})}
      </div>
    );
  }
  getInput = (config) => {
    const { ref, className, ...other } = config;
    let formClass = 'form-control ' + (className || '');
    return (
      <Input
        {...other}
        ref={this.saveRef(ref)}
        className={formClass}
        value={this.zeroFilter(this.getValue(ref), '')}
        onBlur={(val, e) => {
          /** 在 onBlur 中修正 value 的类型 */
          this.changeValue(val, ref);
          Call(config.onBlur, val);
        }}
        onChange={val => this.changeValue(val == '' ? undefined : val, ref)}/>
    );
  }
  getTextArea = (config) => {
    const { ref } = config;
    return (
      <textarea
        defaultValue={this.getValue(ref)}
        className="form-control"
        ref={this.saveRef(ref)}
        id={ref}
        onBlur={e => this.changeValue(e.target.value, ref)} />
    );
  }
  getRange = (config) => {
    const { ref, ...other } = config;
    return (
      <Ranger
        {...other}
        ref={this.saveRef(ref)}
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
  radioFactory = (Comp) => (config) => {
    const { ref, refs, ...other } = config;
    return (
      <Comp
        {...other}
        ref={this.saveRef(ref)}
        value={this.zeroFilter(this.value[ref])}
        onChange={val => {
          this.changeValue(val, ref);
        }}/>
    );
  }
  getRadio = this.radioFactory(Radio)
  getCheckbox = this.radioFactory(Checkbox)
  getButton = (config) => {
    const { ref, className, text, onClick } = config;
    return (
      <span
        className={'btn flat ' + className}
        ref={this.saveRef(ref)}
        onClick={e => Call(onClick, e, ref)}>
        {text}
      </span>
    );
  }
  getDatetime = (config) => {
    let { ref, needTime = true, ...other } = config;
    return (
      <DatetimePicker
        {...other}
        needTime={needTime}
        id={ref}
        value={this.getValue(ref)}
        onChange={val => {
          this.changeValue(val, ref);
        }}/>
    );
  }
  changeDateValues = (vals, refs) => {
    const [refS, refE] = refs;
    const datetimeRangeRef = this.getRefsID(refs);
    const nextValue = {
      [refS]: vals[0],
      [refE]: vals[1],
      // [datetimeRangeRef]: [...vals]
    };
    this.changeValues(nextValue);
    this[datetimeRangeRef] = vals;
  }
  getDatetimeRange = (config) => {
    const { ref, range, refs, ...other } = config;
    // let [refS, refE] = refs;
    const datetimeRangeRef = this.getRefsID(refs);

    return (
      <div className="datepicker-ranger-content">
        {/* <span className="title">{this.gm('范围')}</span> */}
        <DatetimePicker
          mode="range"
          {...other}
          // ref={e => this._refs[datetimeRangeRef] = e}
          ref={this.saveRef(datetimeRangeRef)}
          id={datetimeRangeRef}
          value={this[datetimeRangeRef] || range}
          onChange={(val) => this.changeDateValues(val, refs)}/>
        {
          !config.noHelper && (
            <DateShortcut
              {...other}
              onChange={val => {
                this.changeDateValues(val, refs);
              }}/>
          )
        }
      </div>
    );
  }
  getSwitch = (config) => {
    const { ref, defaultValue, ...other } = config;
    return (
      <Switch ref={e => this.ref = e} {...other}
        checked={this.getValue(ref)}
        defaultChecked={defaultValue}
        onChange={val => this.changeValue(val, ref)} />
    );
  }
  typeMapper = {
    'customForm': this.getCustomForm,
    'captcha': this.getCaptcha,
    'select-n': this.getSelectNative,
    'select': this.getSelect,
    'input-selector-s': this.getInputSelectorS,
    'input-selector': this.getInputSelector,
    'input-range': this.getInputRange,
    'input': this.getInput,
    'password': this.getInput,
    'textarea': this.getTextArea,
    'ranger': this.getRange,
    'text': this.getText,
    'radio': this.getRadio,
    'checkbox': this.getCheckbox,
    'button': this.getButton,
    'datetime': this.getDatetime,
    'datetimeRange': this.getDatetimeRange,
    'switch': this.getSwitch,
    'hr': this.getHr,
  }
  greneratFormDOM(config) {
    const { type } = config;
    const generator = this.typeMapper[type];

    return generator && generator(config);
  }
}
