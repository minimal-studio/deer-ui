/**
 * 组件名    form 通用布局文件
 * 作者      Alex
 * 开始日期  2017-03-30
 * 完成日期  2017-03-30
 * 修改日期  2017-09-21
 */

import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import {Button, TipPanel, FormHelper, Toast} from '../index.js';

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
  componentWillReceiveProps(nextProps) {
    if((this.props.loading !== nextProps.loading && !nextProps.loading) || this.props.hasErr !== nextProps.hasErr) {
      this.showResDesc(nextProps);
    }
  }
  showResDesc(resInfo) {
    this.toast.show(resInfo.resDesc, resInfo.hasErr ? 'error' : 'success');
  }
  render() {
    const {
      loading, tipInfo, btnConfig,
      childrenBeforeForm, childrenAfterForm, childrenBeforeBtn,
      formOptions = [], btnText = '确定提交',
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
      const {action, text, className} = btn;
      // if(action) {
      return (
        <span className="mr5" key={idx}>
          <Button
            disabled={!action}
            text={loading ? text + '中...' : text}
            loading={loading}
            className={className}
            onClick={e => action(this.formHelper)}/>
        </span>
      )
      // }
    });

    return (
      <div className="form-layout">
        <Toast ref={toast => this.toast = toast}/>
        {tipDOM}
        {childrenBeforeForm}
        <FormHelper
          onChange={onChange}
          formOptions={formOptions}
          ref={formHelper => this.formHelper = formHelper}>
          {childrenBeforeBtn}
          <div className="form-group">
            <label className="control-label"></label>
            {btnGroup}
          </div>
          {childrenAfterForm}
        </FormHelper>
      </div>
    )
  }
}

FormLayout.propTypes = {
  formOptions: PropTypes.array.isRequired,

  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  btnText: PropTypes.string,

  loading: PropTypes.bool,
  tipInfo: PropTypes.object,
  btnConfig: PropTypes.array,

  hasErr: PropTypes.bool,
  resDesc: PropTypes.string,

  childrenBeforeForm: PropTypes.any,
  childrenAfterForm: PropTypes.any,
};
