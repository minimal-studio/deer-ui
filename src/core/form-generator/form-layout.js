/**
 * 组件名    form 通用布局文件
 * 作者      Alex
 * 开始日期  2017-03-30
 * 完成日期  2017-03-30
 * 修改日期  2017-09-21
 */

import React from 'react';
import PropTypes from 'prop-types';

import { UkeComponent, UkePureComponent } from '../uke-utils';
import Button from '../button/button-normal';
import TipPanel from '../tip-panel/tip-panel';
import Toast from '../toast/toast';
import FormGenerator from './form-generator';

/**
 * 默认一个按钮，可以配置多个按钮，
 * btnConfig: [{
 *   action: func,
 *   text: string,
 *   className: string
 * }]
 * 一旦设定 btnConfig, onSubmit btnText className 将会失效
 */

export default class FormLayout extends UkeComponent {
  static propTypes = {
    /** FormGenerator 的配置 */
    formOptions: PropTypes.arrayOf(
      PropTypes.object
    ).isRequired,
  
    /** 只有一个操作按钮的 sumbit 回调 */
    onSubmit: PropTypes.func,
    /** FormGenerator 的变化回调 */
    onChange: PropTypes.func,
    /** 只有一个按钮时传入的按钮 text */
    btnText: PropTypes.string,
    /** FormLayout 的 className */
    className: PropTypes.string,
  
    /** 是否已准备好渲染 */
    ready: PropTypes.bool,
    /** 传入 TipPanel 控件的参数 */
    tipInfo: PropTypes.shape({
      text: PropTypes.any,
      texts: PropTypes.array,
      title: PropTypes.any,
    }),
    /** 可以配置一个或多个操作按钮 */
    btnConfig: PropTypes.arrayOf(
      PropTypes.shape({
        /** 该按钮的操作 */
        action: PropTypes.func,
        /** 该按钮的类型 */
        type: PropTypes.oneOf([
          'submit', 'button'
        ]),
        /** 该按钮的字 */
        text: PropTypes.string,
        /** 记录该按钮的状态 */
        actingRef: PropTypes.string,
        /** 按钮颜色 */
        color: PropTypes.string,
        /** 该按钮是否需要预检查 */
        preCheck: PropTypes.bool,
      })
    ),
  
    /** 是否竖立显示 */
    isVertical: PropTypes.bool,
    /** 是否移动端 */
    isMobile: PropTypes.bool,
  
    /** 操作的返回是否有错误 */
    hasErr: PropTypes.bool,
    /** 操作返回的消息 */
    resDesc: PropTypes.string,
  
    /** 在 form 之前插入的 children */
    childrenBeforeForm: PropTypes.any,
    /** 在 form 之后插入的 children */
    childrenAfterForm: PropTypes.any,
  };
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
  // componentDidUpdate() {
  //   const { changeDescFromProps } = this.state;
  //   if(changeDescFromProps) {
  //     this.showResDesc(this.props);
  //   }
  // }
  // TODO: 废除这个方法，并且不影响之前的效果
  // componentWillReceiveProps(nextProps) {
  //   const { resDesc } = nextProps;
  //   if(resDesc && this.props.resDesc !== resDesc) {
  //     this.showResDesc(nextProps);
  //   }
  // }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { resDesc } = nextProps;
    if(!this.__changeedDesc && resDesc && this.props.resDesc !== resDesc) {
      this.__changeedDesc = true;
      this.showResDesc(nextProps);
    }
    return true;
  }
  showResDesc(resInfo) {
    !!resInfo.resDesc && this.toast && this.toast.show(resInfo.resDesc, resInfo.hasErr ? 'error' : 'success');
  }
  preCheck() {
    if(!this.formHelper) return;
    const { isPass, desc, ref } = this.formHelper.checkForm();
    if(!isPass) {
      this.showResDesc({
        resDesc: desc + this.gm('必填|选'),
        hasErr: true
      });
    }
    return isPass;
  }
  _handleClickBtn = ({ actingRef, preCheck = true, action, type }) => {
    this.__changeedDesc = false;
    const _action = () => {
      action(this.formHelper, actingRef);
    };
    if(preCheck) {
      if(this.preCheck()) {
        _action();
      }
    } else {
      _action();
    }
  }
  render() {
    const {
      tipInfo, btnConfig, className = '', isVertical, isMobile,
      showInputTitle,
      childrenBeforeForm, childrenAfterForm, childrenBeforeBtn,
      formOptions = [], btnText = this.gm('确定提交'),
      onSubmit, onChange, ...other
    } = this.props;

    let formType = '';
    let onSubmitForGen = null;

    const _btnConfig = btnConfig ? btnConfig : [
      {
        action: onSubmit,
        text: btnText,
        color: 'theme',
        type: 'button',
        className: 'theme'
      }
    ];

    const tipDOM = tipInfo ? (
      <TipPanel {...tipInfo}/>
    ) : null;

    const btnGroup = _btnConfig.map((btn, idx) => {
      const {
        action, text, className, color, actingRef = 'loading', type = 'button',
      } = btn;
      const isBtnLoading = this.props[actingRef];
      const isActive = !!action && !isBtnLoading;
      const key = text + actingRef;
      const isSubmit = type === 'submit';
      if(isSubmit) {
        if(formType === 'submit') console.warn('定义了多个 type 为 submit 的按钮');
        formType = 'submit';
        onSubmitForGen = (e) => {
          this._handleClickBtn(btn);
        };
      }
      return (
        <span className="mr5" key={key}>
          <Button
            disabled={!isActive}
            text={isBtnLoading ? text + this.gm('中') + '...' : text}
            loading={isBtnLoading}
            type={type}
            className={color || className || ''}
            onClick={e => !isSubmit && this._handleClickBtn(btn)}/>
        </span>
      );
    });

    return (
      <div className={"form-layout" + (className ? ' ' + className : '')}>
        <Toast ref={toast => this.toast = toast}/>
        {tipDOM}
        {childrenBeforeForm}
        <FormGenerator
          {...other}
          type={formType}
          onChange={onChange}
          onSubmit={onSubmitForGen}
          isVertical={isVertical}
          isMobile={isMobile}
          showInputTitle={showInputTitle}
          formOptions={formOptions}
          ref={e => this.formHelper = e}>
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
