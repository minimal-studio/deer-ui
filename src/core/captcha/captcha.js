import React from 'react';
import PropTypes from 'prop-types';
import { Call } from 'basic-helper';

import { UkeComponent } from '../uke-utils';
import Input from '../form-control/input';

/**
 * 验证码，需要先通过 setUkelliConfig 设置获取验证码的方式
 *
 * @export
 * @class Captcha
 * @extends {Component}
 */
export default class Captcha extends UkeComponent {
  static propTypes = {
    /** 获取错误时的回调 */
    onError: PropTypes.func,
    /** 值改变时的回调 */
    onChange: PropTypes.func,
    /** 验证码 Mount 的回调 */
    onCaptchaLoad: PropTypes.func,
    /** 失去焦点的回调 */
    onBlur: PropTypes.func,
    /** 与 react 受控控件行为一致 */
    value: PropTypes.string,
    /** icon */
    icon: PropTypes.string,
    /** 限制输入长度 */
    limit: PropTypes.number,
    /** 尝试自动刷新验证码的次数 */
    autoRetryTime: PropTypes.number,
  };
  static defaultProps = {
    limit: 4,
    autoRetryTime: 10,
    icon: 'security',
  }
  constructor(props) {
    super(props);
    this.state = {
      captchaImg: '',
      captchaValue: '',
      loading: false,
    };
    this.isControl = props.hasOwnProperty('value');
    this.captchaLength = props.limit || 4;
    this.isPass = false;
    this.value = props.value;
    this.captchaKey = '';
    this.refreshTime = 0;
    // 自动尝试刷新验证码
    this.retryTime = 0;
  }
  componentDidMount() {
    this.getCaptcha();
  }
  select() {
    this.captchaInput.select();
  }
  getCaptcha(props) {
    props = props || this.props;
    this.refreshTime = Date.now();
    const { autoRetryTime, onError } = props;

    this.setState({
      loading: true
    });

    if(window.$UKE.queryCAPTCHAData) {
      window.$UKE.queryCAPTCHAData(options => {
        if (this.__unmount) return;
        const { hasErr, captchaImage, captchaKey } = options;
        if(hasErr) {
          this.clearTimeout();
          this.getCaptchaTimer = setTimeout(() => {
            // 如果自动刷新次数少于设置项，则自动刷新
            if(this.retryTime < autoRetryTime) this.refreshCaptcha(false);
            this.retryTime++;
          }, 1000);
        } else {
          this.setState({
            loading: false,
            captchaImg: captchaImage
          });
          this.captchaKey = captchaKey;
          this.props.onCaptchaLoad && this.props.onCaptchaLoad();
        }
      });
    }
  }
  componentWillUnmount() {
    this.__unmount = true;
    this.clearTimeout();
  }
  clearTimeout() {
    this.getCaptchaTimer && clearTimeout(this.getCaptchaTimer);
  }
  shouldRefreshCaptcha(should = false, needFocus) {
    let clickTime = Date.now();
    if(should || clickTime - this.refreshTime > 1 * 60 * 1000) {
      this.getCaptcha();
    }
    if (needFocus) this.select();
  }
  refreshCaptcha(needFocus=true) {
    this.shouldRefreshCaptcha(true, needFocus);
  }
  changeCaptcha(val) {
    const {onChange} = this.props;
    let _val = val.length > this.captchaLength ? val.slice(0, this.captchaLength) : val;
    if(val.length === this.captchaLength) this.isPass = true;
    if(!this.isControl) {
      this.setState({
        captchaValue: _val
      });
    }
    this.value = _val;
    Call(onChange, {
      isPass: this.isPass,
      value: _val,
      key: this.captchaKey,
      // forUsername: this.forUsername
    });
  }
  focus() {
    this.captchaInput.focus();
  }
  render() {
    const gm = this.gm;
    const {captchaImg, captchaValue, loading} = this.state;
    const {value, icon} = this.props;
    const _captchaValue = this.isControl ? value : captchaValue;

    let hasCap = !!captchaImg;
    let loadingTip = null;
    let captchaImgElem = hasCap && !loading ? (
      <img
        src={captchaImg}
        alt=""
        className="cover-image"/>
    ) : null;
    if(!hasCap) {
      loadingTip = gm('验证码');
    }
    if(loading) {
      loadingTip = gm('刷新中');
    }

    return (
      <div className="captcha-group">
        <Input
          ref={e => this.captchaInput = e}
          icon={icon}
          type="number"
          className="form-control captcha-input"
          value={_captchaValue}
          onFocus={e => this.shouldRefreshCaptcha()}
          onChange={val => this.changeCaptcha(val)}
          placeholder={gm("验证码")}>
          <div className="captcha"
            onClick={e => {
              this.getCaptcha();
            }}>
            <div
              className={"text-center captcha-tip" + (!loading && hasCap ? ' hide' : '')}>
              {loadingTip}
            </div>
            {captchaImgElem}
          </div>
        </Input>
      </div>
    );
  // <input
  //   type="text"
  //   className={"form-control captcha-input input-" + scale}
  //   ref="captchaInput"
  //   value={_captchaValue}
  //   onFocus={e => this.shouldRefreshCaptcha()}
  //   onChange={e => this.changeCaptcha(e.target.value)}
  //   placeholder="验证码"/>
  }
}
