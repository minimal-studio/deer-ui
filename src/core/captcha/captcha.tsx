import React from 'react';
import { Call } from 'basic-helper';

import { UkeComponent } from '../utils/uke-component';
import Input from '../form-control/input';

interface GetDataRes {
  /** 是否发生错误 */
  hasErr: boolean;
  /** 验证码的图片 */
  captchaImage: string;
  /** 验证码的 key */
  captchaKey: string;
}

type APIQueryCaptcha = (getData: (resData: GetDataRes) => void) => void;

export interface CaptchaProps {
  /** 获取错误时的回调 */
  onError?: Function;
  /** 值改变时的回调 */
  onChange?: Function;
  /** 验证码 Mount 的回调 */
  onCaptchaLoad?: Function;
  /** 失去焦点的回调 */
  onBlur?: Function;
  /** 与 react 受控控件行为一致 */
  value?: string | number;
  /** icon */
  icon?: string;
  /** 限制输入长度 */
  limit?: number;
  /** 尝试自动刷新验证码的次数 */
  autoRetryTime?: number;
}

interface State {
  captchaImg: string;
  captchaValue: string | number;
  loading: boolean;
}

let queryCAPTCHAData: APIQueryCaptcha = (getData) => {
  console.log('请先通过 Captcha.setAPI() 设置获取数据接口');
};

/**
 * 验证码，需要先通过 setUkelliConfig 设置获取验证码的方式
 *
 * @export
 * @class Captcha
 * @extends {Component}
 */
export default class Captcha extends UkeComponent<CaptchaProps, State> {
  static defaultProps = {
    limit: 4,
    autoRetryTime: 10,
    icon: 'security',
  }

  static setQueryCAPTCHAData = (func) => {
    console.log('此接口已废弃，请使用 setAPI');
    queryCAPTCHAData = func;
  }

  static setAPI = (func) => {
    queryCAPTCHAData = func;
  }

  captchaInput

  isControl: boolean;

  captchaLength: number;

  isPass = false;

  value

  getCaptchaTimer

  captchaKey = ''

  refreshTime = 0

  retryTime = 0

  __didMount = false

  constructor(props) {
    super(props);
    this.state = {
      captchaImg: '',
      captchaValue: '',
      loading: false,
    };
    this.isControl = typeof props.value != 'undefined';
    this.captchaLength = props.limit || 4;
    this.value = props.value;
  }

  componentDidMount() {
    this.__didMount = true;
    this.getCaptcha();
  }

  componentWillUnmount() {
    this.__didMount = false;
    this.clearTimeout();
  }

  select() {
    this.captchaInput.select();
  }

  getCaptcha = () => {
    this.refreshTime = Date.now();
    const { autoRetryTime = 10, onError, onCaptchaLoad } = this.props;

    this.setState({
      loading: true
    });

    queryCAPTCHAData((resData: GetDataRes) => {
      if (this.__didMount) {
        const { hasErr, captchaImage, captchaKey } = resData;
        if (hasErr) {
          this.clearTimeout();
          this.getCaptchaTimer = setTimeout(() => {
          // 如果自动刷新次数少于设置项，则自动刷新
            if (this.retryTime < autoRetryTime) this.refreshCaptcha(false);
            this.retryTime++;
          }, 1000);
        } else {
          this.setState({
            loading: false,
            captchaImg: captchaImage
          });
          this.captchaKey = captchaKey;
          Call(onCaptchaLoad, captchaKey);
        }
      }
    });
  }

  clearTimeout() {
    this.getCaptchaTimer && clearTimeout(this.getCaptchaTimer);
  }

  shouldRefreshCaptcha(should = false, needFocus = false) {
    const clickTime = Date.now();
    if (should || clickTime - this.refreshTime > 1 * 60 * 1000) {
      this.getCaptcha();
    }
    if (needFocus) this.select();
  }

  refreshCaptcha(needFocus = true) {
    this.shouldRefreshCaptcha(true, needFocus);
  }

  changeCaptcha(val) {
    const { onChange } = this.props;
    const _val = val.length > this.captchaLength ? val.slice(0, this.captchaLength) : val;
    if (val.length === this.captchaLength) this.isPass = true;
    if (!this.isControl) {
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
    const { captchaImg, captchaValue, loading } = this.state;
    const { value, icon } = this.props;
    const _captchaValue = this.isControl ? value : captchaValue;

    const hasCap = !!captchaImg;
    let loadingTip = null;
    const captchaImgElem = hasCap && !loading ? (
      <img
        src={captchaImg}
        alt=""
        className="cover-image"/>
    ) : null;
    if (!hasCap) {
      loadingTip = this.$T_UKE('验证码');
    }
    if (loading) {
      loadingTip = this.$T_UKE('刷新中');
    }

    return (
      <div className="captcha-group">
        <Input
          ref={(e) => { this.captchaInput = e; }}
          icon={icon}
          type="number"
          className="form-control captcha-input"
          value={_captchaValue}
          onFocus={e => this.shouldRefreshCaptcha()}
          onChange={val => this.changeCaptcha(val)}
          placeholder={this.$T_UKE("验证码")}>
          <div className="captcha"
            onClick={(e) => {
              this.getCaptcha();
            }}>
            <div
              className={`text-center captcha-tip${!loading && hasCap ? ' hide' : ''}`}>
              {loadingTip}
            </div>
            {captchaImgElem}
          </div>
        </Input>
      </div>
    );
  }
}
