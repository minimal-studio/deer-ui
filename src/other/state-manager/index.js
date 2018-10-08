/**
 * 基础 Action 组件, 主要实现了请求方式, 包含表单验证的方式
 * @Alex
 */

import {Component} from 'react';
import PropTypes from 'prop-types';
import { DebounceClass, Call } from 'basic-helper';

const rewiteMsg = {
  checkResIsSuccess: 'rewrite this.checkResIsSuccess',
  defaultStateAfterPost: 'rewrite this.defaultStateAfterPost',
  wrapDataFilter: 'rewrite this.wrapDataFilter',
  request: `
  rewrite this async this.request:

  class A extends ActionBasic {
    async request(sendData) {
      return $request.send(reqObj);
    }
  }
  `
}

/**
 * 提供基础的 react state 管理方式
 * 与业务分离，提供一些 hook 接口，把每一步都拆分为可处理的流程，便于根据不同以为定制
 * 提供 log 在开发环境时提示的功能
 */
export default class StateManager extends Component {
  static propTypes = {
    onNavigate: PropTypes.func
  };
  defaultPaging = {};
  state = {
    loading: false,   // 是否加载中
    submiting: false, // 是否提交中
    querying: false,  // 是否查询中
    ready: true,      // 组件是否已经准备，主要是用于需要异步获取查询条件或表单数据的表单与表格
    hasErr: false,    // 是否有错误
    resDesc: '',      // 返回的描述
    pagingInfo: {},   // 分页信息
    resData: {},      // 返回的数据
  };
  log(...args) {
    process.env.NODE_ENV == 'development' ? console.log(...args) : '';
  }
  setModal(modalSetting) {
    const {onNavigate} = this.props;
    onNavigate && onNavigate({
      type: 'MODAL',
      modalSetting
    })
  }
  toBasicUnitMoney(money) {
    return $GH.ToBasicUnitMoney(money);
  }
  closeModal() {
    const {onNavigate} = this.props;
    onNavigate && onNavigate({
      type: 'CLOSE_MODAL'
    })
  }
  getStateBeforePost(params, actingRef) {
    return {
      [actingRef]: true,
      hasErr: false,
      resDesc: '',
      ...params,
    };
  }
  componentWillUnmount() {
    this.__unmount = true;
  }
  basicUnitFilter(data) {
    const listRefs = ['TransAmount'];
    listRefs.forEach(ref => {
      if(data[ref]) {
        data[ref] = this.toBasicUnitMoney(data.TransAmount);
      }
    });
    return data;
  }
  delayExec(...args) {
    if(!this._delayExec) this._delayExec = new DebounceClass();
    return this._delayExec.exec(...args);
  }
  defaultStateAfterPost(res, sendOptions) {
    this.log(rewiteMsg.defaultStateAfterPost);
    return {};
  }
  stateSetter(state) {
    if(!this.__unmount) this.setState(state);
  }
  async request() {
    // const sendDataRes = await $MN.$request.send({sendData});
    this.log(rewiteMsg.request);
    return (async () => {
      return;
    })();
  }
  checkResIsSuccess() {
    this.log(rewiteMsg.checkResIsSuccess);
    return true;
  }
  _checkResIsSuccess(res, onSuccessCallback) {
    // return res.Header.ErrCode.Code == '0';
    let {success, data} = this.checkResIsSuccess(res);
    if(success) Call(onSuccessCallback, data);
    return success;
  }
  wrapDataFilter(sendData) {
    this.log(rewiteMsg.wrapDataFilter);
    return sendData;
  }
  async _sendData(options) {
    /**
     * 参数说明
     * method@String          请求的接口
     * ---------------------------------
     * data@Object            请求的 Data，一般由继承 Helper 组件包装成功后传入，
     *                        参见 action-form-basic || action-report-basic
     *                        action-form-basic 处理大部分表单的统一验证
     *                        action-report-basic 处理大部分报表的查询条件业务
     * ---------------------------------
     * stateBeforePost@Object    追加 state 到请求发起前的 setState
     * stateAfterPostHook@func   追加 state 到请求完成后的 setState，必须返回一个 Object
     * actingRef@String          请求状态的标记为，默认是 loading，兼容记录多个接口的请求状态
     * onSuccess@Func            业务请求成功的 callback
     * onRes@Func                发起的请求成功，包括业务错误
     */
    const {
      method, data = {},
      stateBeforePost = {},
      stateAfterPostHook = (res) => {},
      actingRef = 'loading',
      onSuccess, onRes
    } = options;

    /**
     * 第一步
     * 设置对应的 loading state
     */
    this.stateSetter(this.getStateBeforePost(stateBeforePost, actingRef));

    /**
     * 第二步
     * 包装成 uke request 的 sendData
     */
    const sendData = {
      ...(method ? {method} : {}),
      data: this.wrapDataFilter(data)
    };

    /**
     * 第三步
     * 通过自身接口发送数据
     */
    const sendDataRes = await this.request({sendData});

    /**
     * 第四步
     * 发送成功后的回调处理
     * 在 setState 之前执行 stateAfterPostHook 
     * 
     */
    Call(onRes, sendDataRes);
    this._checkResIsSuccess(sendDataRes, onSuccess);
    this.stateSetter(
      {
        ...(this.defaultStateAfterPost(sendDataRes, options)),
        ...(Call(stateAfterPostHook, sendDataRes))
      }
    );
  }
}
