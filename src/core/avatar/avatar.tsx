/* eslint-disable react/no-multi-comp */

import React, { Component, PureComponent } from "react";
import { Call } from 'basic-helper';

import { DropdownWrapper } from '../selector';
import { Tip } from '../tip';

import { UkePureComponent } from '../uke-utils';

export interface AvatarProps {
  /** 头像的大小 */
  size?: number;
  /** Avatar 中显示的字 */
  text?: string;
  /** 头像的数组, ['A', 'B', 'face.jpg'] */
  faceOptions?: string[];
  /** 是否可换头像 */
  changeAvatarable?: boolean;
  /** 图片地址, 可以为网络图片、base64 和相对路径图片 */
  src?: string;
  /** 弹出的位置 */
  position?: string;
  /** icon 名称，参考 Icon */
  icon?: string;
  /** 显示在右上角的提示 */
  tip?: boolean|string|number;
  /** 换头像后的回调 */
  onChangeAvatar?: Function;
}

/**
 * Avatar Component，依赖 Croppie 三方库作为自定义图片，需要设置 Croppie 的地址
 *
 * @export
 * @class Avatar
 * @extends {PureComponent}
 */
export default class Avatar extends UkePureComponent<AvatarProps> {
  static defaultProps = {
    size: 50,
    text: '',
    tip: false,
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

  changeAvatar = (res) => {
    const { onChangeAvatar } = this.props;
    Call(onChangeAvatar, res);
  }

  renderMoreOptions = ({ hide }) => {
    const { faceOptions = [] } = this.props;
    return (
      <div className="avatar-options">
        {
          faceOptions.map((src, idx) => (
            <span
              key={idx}
              className="img"
              onClick={(e) => {
                this.changeAvatar(src);
                hide();
              }}>
              <img
                alt=""
                src={src}/>
            </span>
          ))
        }
      </div>
    );
  }

  render() {
    const {
      text,
      src,
      size,
      position,
      changeAvatarable,
      faceOptions,
      tip,
      children
    } = this.props;

    const sizeStyle = size ? {
      width: size, height: size, fontSize: size / 1.5
    } : {};
    const _img = src && (
      <div style={{
        backgroundImage: `url(${src})`
      }} className="img fixbg fill" />
    );

    const child = children || text;
    const _changeAvatarable = changeAvatarable && faceOptions && faceOptions.length > 0;

    const avatarDOM = (
      <span className="uke-avatar">
        <span
          className="avatar fixbg"
          style={sizeStyle}>
          <span className="c">
            {child}
          </span>
          {_img}
        </span>
        {
          !!tip && (
            <Tip animate={false} scale={22} color="red">{tip}</Tip>
          )
        }
        {/* {changeAvatarDOM} */}
      </span>
    );

    return _changeAvatarable ? (
      <DropdownWrapper position={position}
        overlay={this.renderMoreOptions}>
        {avatarDOM}
      </DropdownWrapper>
    ) : avatarDOM;
  }
}
