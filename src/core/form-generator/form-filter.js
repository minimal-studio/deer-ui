import React, { Component } from 'react';
import { Call, CallFunc, IsFunc, HasValue, IsObj } from 'basic-helper';

import { UkeComponent } from '../uke-basic';

import { DatetimePicker, DateShortcut } from '../datetimepicker';
import { Radio, DropdownMenu } from '../selector';
import { Input } from '../form-control';
import { Ranger } from '../range-selector';
import { Captcha } from '../captcha';
import { ToolTip } from '../tooltip';
import InputSelector from '../form-control/input-selector';
import Switch from '../switch-button/switch';

/**
 * 表单生成器
 * 统一的聚合表单
 */
export default class FormFilterHelper extends UkeComponent {
  _refs = {};
  state = {};
  // static getDerivedStateFromProps(props, state) {
  //   return {
  //     changeProps: true
  //   };
  // }
  constructor(props) {
    super(props);
    this.value = {};
    this.requiredRefMapper = {}; // 用于检测是否通过表单强制要求验证的mapper

    this.initValues();
  }
  componentWillUnmount() {
    this.value = {};
    this.requiredRefMapper = {};
  }
  initValues() {
    const { conditionConfig, formOptions } = this.props;
    this.setDefaultValues(formOptions || conditionConfig);
  }
  resetValues() {
    this.initValues();
  }
  // TODO: 观察移除 componentWillReceiveProps 这个后果
  // componentWillReceiveProps(nextProps) {
  //   this.resetRequireRefMapper(nextProps);
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevProps, prevState)
  //   // this.resetRequireRefMapper(nextProps);
  // }
  resetRequireRefMapper(nextProps = this.props) {
    this.requiredRefMapper = {};
    const { conditionConfig, formOptions } = nextProps;
    const configArr = formOptions || conditionConfig || [];
    configArr.forEach(config => this.setRequiredRefMapper(config));
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
      defaultValue, ref, refs, range, refu, refuDefaultIdx
    } = config;

    if(HasValue(defaultValue)) {
      if(ref) this.value[ref] = defaultValue;
      if(IsObj(refu)) {
        /** 判断是否有 refuDefaultIdx，如果有则直接使用，否则区 refu 第一个作为默认值 */
        let targetKey;
        if(HasValue(refuDefaultIdx)) {
          targetKey = refuDefaultIdx;
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
      <ToolTip title={tips} n="question" s="r"/>
    );
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
    Call(this.props.onChange, this.value, ref, value);
  }
  changeValues(valRefMapper, update = true) {
    const refs = Object.keys(valRefMapper);
    /**
     * valRefMapper
     * {
     *   ref: val
     * }
     */
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
  // onInputChange = ({val, disabled, inputType = 'string', ref}) => {
  //   if (disabled) return;
  //   let __val = val;
  //   // let __val = elem.value;
  //   switch (inputType) {
  //   case 'dotnumber':
  //     let _tmpVal = +__val;
  //     __val = _tmpVal === 0 ? (__val == '0.' ? '0.' : undefined) : (_tmpVal ? (/\.\d{3,}/.test(__val) ? _tmpVal.toFixed(2) : __val): undefined);
  //     break;
  //   case 'number':
  //     __val = +((+__val === 0 ? (__val === '' ? '' : 0) : (+__val || '')) + '').replace(/\..+/, '');
  //     break;
  //   case 'string':
  //   default:
  //     __val = __val + '';
  //     break;
  //   }
  //   this.changeValue(__val, ref);
  // }
  loadPlugin = (Plugin, props) => {
    let P = IsFunc(Plugin) ? <Plugin /> : Plugin;

    P = React.cloneElement(P, props);

    return P;
  }
  // TODO: 调整此实现
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
      ...other, ...cusProps, onChange: val => this.changeValue(val, ref)
    });
  }
  getCaptcha = (config) => {
    const { ref, ...other } = config;
    let captchaKeyRef = 'CaptchaKey';
    let captchaForUsernameRef = 'CaptchaForUsername';
    return (
      <Captcha
        {...other}
        value={this.getValue(ref) || ''}
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
    const { ref, ...other} = config;
    return (
      <DropdownMenu
        {...other}
        value={this.getValue(ref)}
        onChange={val => {
          this.changeValue(val, ref);
        }}/>
    );
  }
  getInputSelectorS = (config) => {
    const { inputProps = {}, refuDefaultIdx, refForS, values, required, ref, ...other } = config;
    return (
      <InputSelector 
        {...other}
        ref={e => {
          this._refs[ref] = e;
        }}
        defaultSelectorIdx={refuDefaultIdx}
        values={values}
        inputProps={inputProps}
        value={this.zeroFilter(this.getValue(ref), '')}
        onChange={(val, activeRef) => {
          this.changeValues({
            [ref]: val,
            [refForS]: activeRef
          });
        }}/>
    );
  }
  getInputSelector = (config) => {
    const { inputProps = {}, refuDefaultIdx, refu, required, ref, ...other } = config;
    return (
      <InputSelector 
        {...other}
        ref={e => {
          for (const _ref in refu) {
            this._refs[_ref] = e;
          }
        }}
        defaultSelectorIdx={refuDefaultIdx}
        values={refu}
        inputProps={inputProps}
        value={this.zeroFilter(this.getValue(ref), '')}
        onChange={(val, activeRef) => {
          Object.keys(refu).map((itemRef) => {
            /** selector 改变时，需要把其余的清空，确保输出只有一个 */
            if(activeRef !== itemRef) {
              delete this.value[itemRef];
              delete this.requiredRefMapper[itemRef];
            } else if(required) {
              this.requiredRefMapper[activeRef] = config.title;
            }
          });
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
        ref={e => this._refs[ref] = e}
        className={formClass}
        value={this.zeroFilter(this.getValue(ref), '')}
        onBlur={(val, e) => {
          /** 在 onBlur 中修正 value 的类型 */
          this.changeValue(val, ref);
          Call(config.onBlur, val);
        }}
        onChange={val => this.changeValue(val, ref)}/>
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
    const { ref, ...other } = config;
    return (
      <Ranger
        {...other}
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
    const { ref, ...other } = config;
    return (
      <Radio
        {...other}
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
  getDatetimeRange = (config) => {
    let { ref, range, refs, ...other } = config;
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
        {/* <span className="title">{this.gm('范围')}</span> */}
        <DatetimePicker
          mode="range"
          {...other}
          ref={e => this._refs[datetimeRangeRef] = e}
          id={datetimeRangeRef}
          value={this.value[datetimeRangeRef] || range}
          onChange={(val) => changeDateValues(val)}/>
        {
          !config.noHelper ? (
            <DateShortcut
              {...other}
              value={this.getValue(ref)}
              onClick={val => changeDateValues(val)}/>
          ) : null
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
    'button': this.getButton,
    'datetime': this.getDatetime,
    'datetimeRange': this.getDatetimeRange,
    'switch': this.getSwitch,
  }
  greneratFormDOM(config) {
    const { type } = config;
    const generator = this.typeMapper[type];

    return generator && generator(config);
  }
}
