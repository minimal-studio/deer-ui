import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";

import {CallFunc} from 'basic-helper';

// TODO: 更改这个控件的用法
import "./croppie";
const faceCount = 12;

export default class Avatar extends PureComponent {
  static propTypes = {
    size: PropTypes.string,
    text: PropTypes.string,
    changeAvatarable: PropTypes.bool,
    faceId: PropTypes.any,
    onChangeAvatar: PropTypes.func
  };
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
  changeAvatar(faceId) {
    const {onChangeAvatar} = this.props;
    CallFunc(onChangeAvatar)(faceId);
    this.togglePanel(false);
  }
  customUpload = e => {
    let gm = $UKE.getUkeKeyMap;
    e.preventDefault();
    e.stopPropagation();
    this.props.ShowGlobalModal({
      type: "confirm",
      width: 400,
      confirmText: (
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
            <a className="btn default file-btn">
              <span>{gm('选择图片')}</span>
              <input
                type="file"
                onChange={this.handleChange}
                accept="images/*"/>
            </a>
          </div>
        </div>
      ),
      title: gm("自定义头像"),
      onConfirm: isSure => {
        if (isSure) {
          this.Croppie && this.Croppie.result({
            type: 'canvas',
            size: {width: 100, height: 100},
            format: 'jpeg',
            circle: false,
          }).then((resp) => {
            this.changeAvatar(resp);
          });
        }
        this.Croppie && this.Croppie.destroy();
      }
    });
    this.Croppie = null;
    setTimeout(() => {
      if (!this.Croppie) {
        this.Croppie = new Croppie(this._cropper, {
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
    }, 100)
  };

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

  render() {
    const {
      text = "",
      faceId,
      size,
      changeAvatarable = false
    } = this.props;
    const { isShow } = this.state;

    const {avatarImgMap, getImage} = $UKE;

    const changeAvatarDOM = changeAvatarable ? (
      <div>
        <div className="text-center" style={{width: 100}}><span className="link-btn" onClick={e => this.togglePanel(!isShow)}>{gm('更换头像')}</span></div>
        <div className={"hide-panel" + (isShow ? " show" : "")}>
          {[...Array(faceCount)].map((_, idx) => {
            return (
              <img
                src={`${getImage(avatarImgMap, idx)}.jpg`}
                key={idx}
                onClick={e => this.changeAvatar(idx)}
              />
            );
          })}
          <div style={{paddingTop: 10}}>
            <span className="link-btn theme" onClick={this.customUpload}>{gm('自定义头像')}</span>
          </div>
        </div>
      </div>
    ) : null;

    return (
      <div className="avatar-helper">
        <span
          className={"avatar fixbg" + (size ? " " + size : "")}
          style={{ backgroundImage: `url(${(faceId + '').indexOf('data') > -1 ? faceId : `${getImage(avatarImgMap, faceId)}.jpg`})` }}
          onClick={e => this.togglePanel(!isShow)}>
          {text}
        </span>
        {changeAvatarDOM}
      </div>
    );
  }
}
