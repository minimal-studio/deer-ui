/**
 * 组件名    form 通用布局文件
 * 作者      Alex
 * 开始日期  2017-03-30
 * 完成日期  2017-03-30
 * 修改日期  2017-09-21
 */

import React from 'react';
import PropTypes from 'prop-types';

import { UkeComponent, UkePureComponent } from '../uke-basic';
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
        action: PropTypes.func,
        text: PropTypes.string,
        /** 记录该按钮的状态 */
        actingRef: PropTypes.string,
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
  componentWillReceiveProps(nextProps) {
    const { resDesc } = nextProps;
    if(resDesc && this.props.resDesc !== resDesc) {
      this.showResDesc(nextProps);
    }
  }
  showResDesc(resInfo) {
    !!resInfo.resDesc && this.toast && this.toast.show(resInfo.resDesc, resInfo.hasErr ? 'error' : 'success');
  }
  preCheck() {
    const { isPass, desc, ref } = this.formHelper.checkForm();
    if(!isPass) {
      this.showResDesc({
        resDesc: desc + this.gm('必须'),
        hasErr: true
      });
    }
    return isPass;
  }
  render() {
    const {
      tipInfo, btnConfig, className = '', isVertical, isMobile,
      showInputTitle,
      childrenBeforeForm, childrenAfterForm, childrenBeforeBtn,
      formOptions = [], btnText = this.gm('确定提交'),
      onSubmit, onChange, ...other
    } = this.props;

    const _btnConfig = btnConfig ? btnConfig : [
      {
        action: onSubmit,
        text: btnText,
        className: 'theme'
      }
    ];

    const tipDOM = tipInfo ? (
      <TipPanel {...tipInfo}/>
    ) : null;

    const btnGroup = _btnConfig.map((btn, idx) => {
      const { action, text, className, actingRef = 'loading' } = btn;
      const isBtnLoading = this.props[actingRef];
      const isActive = !!action && !isBtnLoading;
      const key = text + actingRef;
      return (
        <span className="mr5" key={key}>
          <Button
            disabled={!isActive}
            text={isBtnLoading ? text + this.gm('中') + '...' : text}
            loading={isBtnLoading}
            className={className}
            onClick={e => {
              if(this.preCheck()) {
                action(this.formHelper, actingRef);
              }
            }}/>
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
          onChange={onChange}
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
