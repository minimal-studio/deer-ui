/**
 * 组件名    form 通用布局文件
 * 作者      Alex
 * 创建日期  2017-03-30
 */

import React from 'react';
import { DebounceClass } from 'basic-helper';
import { Button } from '../button';
import Alert, { AlertProps } from '../alert/alert';
import Toast from '../toast/toast';
import FormGenerator, { FormGeneratorProps } from './form-generator';
import { UkeComponent } from '../utils/uke-component';
import { ButtonProps } from '../button/button-basic';

export interface FormLayoutBtn extends ButtonProps {
  /** 点击按钮的回调 */
  action?: (formRef: FormGenerator, actingRef?: string) => void;
  /** 记录该按钮的状态 */
  actingRef?: string;
  /** 该按钮是否需要预检查 */
  preCheck?: boolean;
  /** className */
  className?: string;
}

export type FormLayoutBtnsConfig = FormLayoutBtn[];

export interface FormLayoutProps extends FormGeneratorProps {
  /** 只有一个按钮时传入的按钮 text */
  btnText?: string;
  /** FormLayout 的 className */
  className?: string;
  /** 是否已准备好渲染 */
  ready?: boolean;
  /** 传入 Alert 控件的参数 */
  tipInfo?: AlertProps;
  /** 表单操作按钮 */
  formBtns?: FormLayoutBtnsConfig;
  /** 已改名为 formBtns */
  btnConfig?: FormLayoutBtnsConfig;
  /** 操作的返回是否有错误 */
  hasErr?: boolean;
  /** 操作返回的消息 */
  resDesc?: string;
  /** 在 form 之前插入的 children */
  childrenBeforeForm?: any;
  /** 在 form 之后插入的 children */
  childrenAfterForm?: any;
  /** 在 form 的 children 前插入按钮 */
  childrenBeforeBtn?: any;
}

const delayExec = (new DebounceClass()).exec;

export default class FormLayout extends UkeComponent<FormLayoutProps> {
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { resDesc } = nextProps;
  //   if(prevState.prevResDesc !== resDesc) {
  //     return {
  //       prevResDesc: resDesc,
  //       changeDescFromProps: true
  //     };
  //   } else {
  //     return {
  //       changeDescFromProps: false
  //     };
  //   }
  // }
  private __changedDesc

  toast

  formHelper!: FormGenerator

  clearValue

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { resDesc } = nextProps;
    if (!this.__changedDesc && resDesc && this.props.resDesc !== resDesc) {
      this.__changedDesc = true;
      this.showResDesc(nextProps);
    }
    return true;
  }

  showResDesc(resInfo) {
    !!resInfo.resDesc && this.toast && this.toast.show(resInfo.resDesc, resInfo.hasErr ? 'error' : 'success');
  }

  showDesc(resInfo) {
    this.showResDesc(resInfo);
  }

  preCheck() {
    if (!this.formHelper) return false;
    const { isPass, desc } = this.formHelper.checkForm();
    if (!isPass) {
      this.showResDesc({
        resDesc: desc + this.$T_UKE('必填|选'),
        hasErr: true
      });
    }
    return isPass;
  }

  _handleClickBtn = (formBtns) => {
    const {
      actingRef, preCheck = true, action
    } = formBtns;
    this.__changedDesc = false;
    const _action = () => {
      action(this.formHelper, actingRef);
    };
    if (preCheck) {
      if (this.preCheck()) {
        _action();
      }
    } else {
      _action();
    }
  }

  saveFormRef = (e: FormGenerator) => {
    if (!e) return;
    this.formHelper = e;
    this.clearValue = e.clearValue;
  }

  getDefaultBtn = (): FormLayoutBtn => {
    const {
      onSubmit,
      btnText = this.$T_UKE('确定'),
    } = this.props;
    return {
      action: onSubmit,
      text: btnText,
      color: 'theme',
      type: 'button',
      className: ''
    };
  }

  render() {
    const {
      tipInfo, btnConfig, formBtns,
      childrenBeforeForm, childrenAfterForm, childrenBeforeBtn,
      onSubmit, ...other
    } = this.props;
    const formClassName = this.props.className;

    let formType = '';
    let onSubmitForGen;

    if (btnConfig) {
      delayExec(() => {
        console.warn('请将 btnConfig 改为 formBtns');
      }, 300);
    }

    const _btnConfig = formBtns || btnConfig || [this.getDefaultBtn()];

    const tipDOM = tipInfo ? (
      <Alert {...tipInfo}/>
    ) : null;

    const btnGroup = _btnConfig.map((btn, idx) => {
      const {
        action, text, className = 'mr5', color,
        actingRef = 'loading', type = 'button', preCheck,
        ...otherForBtn
      } = btn;

      const isBtnLoading = this.props[actingRef];
      const isActive = !!action && !isBtnLoading;
      const key = text + actingRef;
      const isSubmit = type === 'submit';
      if (isSubmit) {
        if (formType === 'submit') console.warn('定义了多个 type 为 submit 的按钮');
        formType = 'submit';
        onSubmitForGen = (e) => {
          this._handleClickBtn(btn);
        };
      }
      return (
        <Button
          {...otherForBtn}
          key={key}
          disabled={!isActive}
          text={isBtnLoading ? `${text + this.$T_UKE('中')}...` : text}
          loading={isBtnLoading}
          type={type}
          color={color}
          className={className}
          onClick={e => !isSubmit && this._handleClickBtn(btn)}/>
      );
    });

    return (
      <div className={`form-layout${formClassName ? ` ${formClassName}` : ''}`}>
        <Toast ref={(e) => { this.toast = e; }}/>
        {tipDOM}
        {childrenBeforeForm}
        <FormGenerator
          {...other}
          // type={formType}
          onSubmit={onSubmitForGen}
          ref={this.saveFormRef}>
          {childrenBeforeBtn}
          <div className="form-group">
            <span className="control-label" />
            <div className="form-btn-group">
              {btnGroup}
            </div>
          </div>
          {childrenAfterForm}
        </FormGenerator>
      </div>
    );
  }
}
