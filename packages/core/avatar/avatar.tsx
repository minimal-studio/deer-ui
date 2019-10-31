import React from "react";
import { Call } from '@mini-code/base-func';

import { UIPureComponent } from '@dear-ui/utils/ui-component';
import { Color } from '@dear-ui/utils/props';
import { DropdownWrapper } from '../dropdown-wrapper';

import { Tip } from '../tip';

export interface AvatarProps {
  /** 头像的大小 */
  color?: Color;
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
  /** className */
  className?: string;
  /** 显示在右上角的提示 */
  tip?: boolean | string | number;
  /** 换头像后的回调 */
  onChangeAvatar?: (avatarRes) => void;
}

/**
 * Avatar
 *
 * @export
 * @class Avatar
 * @extends {PureComponent}
 */
export class Avatar extends UIPureComponent<AvatarProps> {
  static defaultProps: AvatarProps = {
    size: 50,
    text: '',
    tip: false,
    color: 'theme',
    className: '',
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
      className,
      color,
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
      <span className={`__avatar ${className}`}>
        <span
          className={`avatar fixbg ${color}`}
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
