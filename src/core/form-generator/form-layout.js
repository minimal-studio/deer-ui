/**
 * 组件名    form 通用布局文件
 * 作者      Alex
 * 开始日期  2017-03-30
 * 完成日期  2017-03-30
 * 修改日期  2017-09-21
 */

import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import Button from '../button/button-normal';
import TipPanel from '../tip-panel';
import Toast from '../toast';
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

export default class FormLayout extends Component {
  static propTypes = {
    formOptions: PropTypes.array.isRequired,
  
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    btnText: PropTypes.string,
    className: PropTypes.string,
  
    ready: PropTypes.bool,
    tipInfo: PropTypes.object,
    btnConfig: PropTypes.array,
  
    isVertical: PropTypes.bool,
    isMobile: PropTypes.bool,
  
    hasErr: PropTypes.bool,
    resDesc: PropTypes.string,
  
    childrenBeforeForm: PropTypes.any,
    childrenAfterForm: PropTypes.any,
  };
  isShowedDesc = false;
  componentWillReceiveProps(nextProps) {
    const {resDesc} = nextProps;
    if(!!resDesc && (this.props.resDesc !== resDesc) && !this.isShowedDesc) {
      this.showResDesc(nextProps);
    }
  }
  showResDesc(resInfo) {
    this.isShowedDesc = true;
    !!resInfo.resDesc && this.toast && this.toast.show(resInfo.resDesc, resInfo.hasErr ? 'error' : 'success');
  }
  render() {
    let gm = $UKE.getUkeKeyMap;
    const {
      tipInfo, btnConfig, className = '', isVertical, isMobile,
      showInputTitle,
      childrenBeforeForm, childrenAfterForm, childrenBeforeBtn,
      formOptions = [], btnText = gm('确定提交'),
      onSubmit, onChange
    } = this.props;

    const _btnConfig = !!btnConfig ? btnConfig : [
      {
        action: onSubmit,
        text: btnText,
        className: 'theme'
      }
    ]

    const tipDOM = !!tipInfo ? (
      <TipPanel {...tipInfo}/>
    ) : null;

    const btnGroup = _btnConfig.map((btn, idx) => {
      const {action, text, className, actingRef = 'loading'} = btn;
      const isBtnLoading = this.props[actingRef];
      const isActive = !!action && !isBtnLoading;
      return (
        <span className="mr5" key={idx}>
          <Button
            disabled={!isActive}
            text={isBtnLoading ? text + gm('中') + '...' : text}
            loading={isBtnLoading}
            className={className}
            onClick={e => {
              this.isShowedDesc = false;
              action(this.formHelper, actingRef);
            }}/>
        </span>
      )
    });

    return (
      <div className={"form-layout" + (className ? ' ' + className : '')}>
        <Toast ref={toast => this.toast = toast}/>
        {tipDOM}
        {childrenBeforeForm}
        <FormGenerator
          onChange={onChange}
          isVertical={isVertical}
          isMobile={isMobile}
          showInputTitle={showInputTitle}
          formOptions={formOptions}
          ref={formHelper => this.formHelper = formHelper}>
          {childrenBeforeBtn}
          <div className="form-group">
            <label className="control-label"></label>
            {btnGroup}
          </div>
          {childrenAfterForm}
        </FormGenerator>
      </div>
    )
  }
}
