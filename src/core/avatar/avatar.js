/* eslint-disable react/no-multi-comp */

import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import { Call } from 'basic-helper';

import { LoadScript } from '../config';
import { Loading } from '../loading';
import { ShowGlobalModal, CloseGlobalModal } from '../modal';

import { UkePureComponent } from '../uke-basic';

let croppieUrl = './js/libs/croppie.js';

class CroppieHelper extends UkePureComponent {
  static propTypes = {
    changeAvatar: PropTypes.func,
    onClose: PropTypes.func,
  };
  state = {
    loadingScript: !window.Croppie
  };
  init = () => {
    // console.log(window.Croppie)
    if(!window.Croppie) return console.log('先加载 Croppie js');
    if (!this.Croppie) {
      this.Croppie = new window.Croppie(this._cropper, {
        viewport: {
          width: 200,
          height: 200,
          type: "circle"
        },
        boundary: {
          width: 300,
          height: 300
        }
      });
    }
  }
  componentDidMount() {
    if(this.state.loadingScript) {
      LoadScript({src: croppieUrl, onload: () => {
        this.init();
        this.setState({
          loadingScript: false,
        });
      }});
    } else {
      this.init();
    }
  }
  handleChange = e => {
    const input = e.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      this._cropPlaceholder.setAttribute("style", "display: none;");
      this._cropWrapper.setAttribute("style", "display: block;");
      this._upload.setAttribute("style", "width: 300px;margin: 50px auto 0;");
      reader.onload = e => {
        this.Croppie.bind({ url: e.target.result });
      };

      reader.readAsDataURL(input.files[0]);
    }
  };
  sureChange = () => {
    const {changeAvatar, onClose} = this.props;
    this.Croppie && this.Croppie.result({
      type: 'canvas',
      size: {width: 100, height: 100},
      format: 'jpeg',
      circle: false,
    }).then((resp) => {
      changeAvatar(resp);
      onClose();
    });
    this.Croppie && this.Croppie.destroy();
  }
  render() {
    const {onClose} = this.props;
    const {loadingScript} = this.state;

    const gm = this.gm;

    return (
      <Loading loading={loadingScript} inrow>
        <div>
          <div
            ref={c => (this._cropWrapper = c)}
            style={{ display: "none" }}
            className="crop-container">
            <div ref={c => (this._cropper = c)} />
          </div>
          <div
            ref={c => (this._cropPlaceholder = c)}
            className="crop-placeholder">
            {gm('请选择图片')}
          </div>
          <div
            className="text-left"
            style={{ width: 350, margin: "10px auto 0" }}
            ref={c => this._upload = c}>
            <span className="btn default file-btn">
              <span>{gm('选择图片')}</span>
              <input
                type="file"
                onChange={this.handleChange}
                accept="images/*"/>
            </span>
          </div>
          <div className="btn-group p10 text-center">
            <span className="btn flat theme mr10" onClick={e => this.sureChange()}>{gm('确定')}</span>
            <span className="btn flat default" onClick={e => onClose()}>{gm('取消')}</span>
          </div>
        </div>
      </Loading>
    );
  }
}

/**
 * Avatar Component，依赖 Croppie 三方库作为自定义图片，需要设置 Croppie 的地址 
 *
 * @export
 * @class Avatar
 * @extends {PureComponent}
 */
export default class Avatar extends UkePureComponent {
  /**
   * 设置 Croppie 库的获取地址
   *
   * @static
   * @memberof Avatar
   * @public
   */
  static setCroppieUrl = (url) => {
    croppieUrl = url;
  };
  static propTypes = {
    /** 头像的大小 */
    size: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    /** 头像显示的第一个字 */
    text: PropTypes.string,
    /** 头像的数组, ['A', 'B', 'face.jpg'] */
    faceOptions: PropTypes.arrayOf(PropTypes.string),
    /** 是否可换头像 */
    changeAvatarable: PropTypes.bool,
    /** ID */
    faceId: PropTypes.any,
    /** 换头像后的回调 */
    onChangeAvatar: PropTypes.func
  };
  static defaultProps = {
    size: 50,
    text: '',
    changeAvatarable: false,
    faceOptions: []
  }
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      crop: false
    };
  }

  togglePanel(isShow) {
    const self = this;
    function handleDocClick() {
      self.setState({
        isShow: false
      });
      document.removeEventListener("click", handleDocClick, false);
    }
    this.setState({
      isShow
    });
    if (isShow) {
      document.addEventListener("click", handleDocClick, false);
    }
  }
  changeAvatar = (faceId) => {
    const {onChangeAvatar} = this.props;
    Call(onChangeAvatar, faceId);
    this.togglePanel(false);
  }
  customUpload = e => {
    e.preventDefault();
    e.stopPropagation();
    const modalId = ShowGlobalModal({
      // type: "confirm",
      width: 400,
      children: (
        <CroppieHelper changeAvatar={this.changeAvatar} onClose={e => CloseGlobalModal(modalId)}/>
      ),
      showFuncBtn: false,
      title: this.gm("自定义头像"),
    });
  };

  render() {
    const {
      text,
      faceId,
      size,
      faceOptions,
      changeAvatarable
    } = this.props;
    const { isShow } = this.state;
    const hasFaceConfig = faceOptions.length > 0 && changeAvatarable;
    const gm = window.$UKE.getUkeKeyMap;

    const {avatarImgMap, getImage} = window.$UKE;

    const changeAvatarDOM = hasFaceConfig ? (
      <div>
        <div className={"hide-panel" + (isShow ? " show" : "")}>
          <div className="text-center" style={{width: 100}}><span className="link-btn" onClick={e => this.togglePanel(!isShow)}>{gm('更换头像')}</span></div>
          {
            faceOptions.map((name, idx) => {
              return (
                <span
                  key={name}
                  onClick={e => this.changeAvatar(idx)}>
                  <img
                    alt=""
                    src={`${getImage(avatarImgMap, name)}.jpg`}/>
                </span>
              );
            })
          }
          <div style={{paddingTop: 10}}>
            <span className="link-btn theme" onClick={this.customUpload}>{gm('自定义头像')}</span>
          </div>
        </div>
      </div>
    ) : null;

    const isBase64Img = (faceId + '').indexOf('data') > -1;
    const hasImg = isBase64Img || !!avatarImgMap;
    const sizeStyle = {
      width: size, height: size, fontSize: size / 1.5, lineHeight: size + 'px'
    };
    const bgStyle = hasImg ? {
      backgroundImage: `url(${isBase64Img ? faceId : `${getImage(avatarImgMap, faceId)}.jpg`})`
    } : {};

    return (
      <span className="avatar-helper">
        <span
          className="avatar fixbg"
          style={Object.assign({}, sizeStyle, bgStyle)}
          onClick={e => this.togglePanel(!isShow)}>
          {text}
        </span>
        {changeAvatarDOM}
      </span>
    );
  }
}
