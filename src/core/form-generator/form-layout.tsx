/**
 * 组件名    form 通用布局文件
 * 作者      Alex
 * 创建日期  2017-03-30
 */

import React from 'react';

import Button from '../button/button-normal';
import TipPanel, { TipPanelProps } from '../tip-panel/tip-panel';
import Toast from '../toast/toast';
import FormGenerator, { FormGeneratorProps } from './form-generator';
import { UkeComponent } from '../utils/uke-component';
import { BtnItemConfig } from '../utils/props';

export interface FormLayoutProps extends FormGeneratorProps {
  /** 只有一个按钮时传入的按钮 text */
  btnText?: string;
  /** FormLayout 的 className */
  className?: string;
  /** 是否已准备好渲染 */
  ready?: boolean;
  /** 传入 TipPanel 控件的参数 */
  tipInfo: TipPanelProps;
  /** 可以配置一个或多个操作按钮 */
  btnConfig: BtnItemConfig[];
  /** 是否竖立显示 */
  isVertical: boolean;
  /** 是否移动端 */
  isMobile: boolean;
  /** 操作的返回是否有错误 */
  hasErr: boolean;
  /** 操作返回的消息 */
  resDesc: string;
  /** 在 form 之前插入的 children */
  childrenBeforeForm: any;
  /** 在 form 之后插入的 children */
  childrenAfterForm: any;
  /** 在 form 的 children 前插入按钮 */
  childrenBeforeBtn: any;
}

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

  formHelper

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

  _handleClickBtn = ({
    actingRef, preCheck = true, action
  }) => {
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

  saveFormRef = (e) => {
    if (!e) return;
    this.formHelper = e;
    this.clearValue = e.clearValue;
  }

  render() {
    const {
      tipInfo, btnConfig, isVertical, isMobile,
      showInputTitle,
      childrenBeforeForm, childrenAfterForm, childrenBeforeBtn,
      formOptions = [], btnText = this.$T_UKE('确定提交'),
      onSubmit, onChange, ...other
    } = this.props;
    const formClassName = this.props.className;

    let formType = '';
    let onSubmitForGen;

    const _btnConfig = btnConfig || [
      {
        action: onSubmit,
        text: btnText,
        color: 'theme',
        type: 'button',
        className: ''
      }
    ];

    const tipDOM = tipInfo ? (
      <TipPanel {...tipInfo}/>
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
          onChange={onChange}
          onSubmit={onSubmitForGen}
          isMobile={isMobile}
          showInputTitle={showInputTitle}
          formOptions={formOptions}
          ref={this.saveFormRef}>
          {childrenBeforeBtn}
          <div className="form-group">
            <span className="control-label" />
            {btnGroup}
          </div>
          {childrenAfterForm}
        </FormGenerator>
      </div>
    );
  }
}
