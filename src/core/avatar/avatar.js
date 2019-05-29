/* eslint-disable react/no-multi-comp */

import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import { Call } from 'basic-helper';

import { DropdownWrapper } from '../selector';
// import { LoadScript, LoadLink } from '../utils';
// import { Loading } from '../loading';
// import { ShowModal, CloseModal } from '../modal';

import { UkePureComponent } from '../uke-utils';

// let croppieUrl = 'https://cdnjs.cloudflare.com/ajax/libs/cropper/4.0.0/cropper.min.js';
// let croppieCssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/cropper/4.0.0/cropper.min.css';

// class CroppieHelper extends UkePureComponent {
//   static propTypes = {
//     changeAvatar: PropTypes.func,
//     onClose: PropTypes.func,
//   };
//   state = {
//     loadingScript: !window.Croppie
//   };
//   init = () => {
//     // console.log(window.Croppie)
//     if(!window.Croppie) return console.log('先加载 Croppie js');
//     if (!this.Croppie) {
//       this.Croppie = new window.Croppie(this._cropper, {
//         viewport: {
//           width: 200,
//           height: 200,
//           type: "circle"
//         },
//         boundary: {
//           width: 300,
//           height: 300
//         }
//       });
//     }
//   }
//   componentDidMount() {
//     if(this.state.loadingScript) {
//       LoadScript({src: croppieUrl, onload: () => {
//         this.setState({
//           loadingScript: false,
//         }, () => this.init());
//       }});
//       LoadLink({src: croppieCssUrl});
//     } else {
//       this.init();
//     }
//   }
//   handleChange = e => {
//     const input = e.target;
//     if (input.files && input.files[0]) {
//       var reader = new FileReader();
//       this._cropPlaceholder.setAttribute("style", "display: none;");
//       this._cropWrapper.setAttribute("style", "display: block;");
//       this._upload.setAttribute("style", "width: 300px;margin: 50px auto 0;");
//       reader.onload = e => {
//         this.Croppie.bind({ url: e.target.result });
//       };

//       reader.readAsDataURL(input.files[0]);
//     }
//   };
//   sureChange = () => {
//     const {changeAvatar, onClose} = this.props;
//     this.Croppie && this.Croppie.result({
//       type: 'canvas',
//       size: {width: 100, height: 100},
//       format: 'jpeg',
//       circle: false,
//     }).then((resp) => {
//       changeAvatar(resp);
//       onClose();
//     });
//     this.Croppie && this.Croppie.destroy();
//   }
//   render() {
//     const {onClose} = this.props;
//     const {loadingScript} = this.state;

//     const $T_UKE = this.$T_UKE;

//     return (
//       <Loading loading={loadingScript} inrow={false}>
//         {
//           () => (
//             <div>
//               <div
//                 ref={c => (this._cropWrapper = c)}
//                 style={{ display: "none" }}
//                 className="crop-container">
//                 <div ref={c => (this._cropper = c)} />
//               </div>
//               <div
//                 ref={c => (this._cropPlaceholder = c)}
//                 className="crop-placeholder">
//                 {$T_UKE('请选择图片')}
//               </div>
//               <div
//                 className="text-left"
//                 style={{ width: 350, margin: "10px auto 0" }}
//                 ref={c => this._upload = c}>
//                 <span className="btn default file-btn">
//                   <span>{$T_UKE('选择图片')}</span>
//                   <input
//                     type="file"
//                     onChange={this.handleChange}
//                     accept="images/*"/>
//                 </span>
//               </div>
//               <div className="btn-group p10 text-center">
//                 <span className="btn flat theme mr10" onClick={e => this.sureChange()}>{$T_UKE('确定')}</span>
//                 <span className="btn flat default" onClick={e => onClose()}>{$T_UKE('取消')}</span>
//               </div>
//             </div>
//           )
//         }
//       </Loading>
//     );
//   }
// }

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
    // croppieUrl = url;
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
    /** 图片地址, 可以为网络图片、base64 和相对路径图片 */
    src: PropTypes.string,
    /** icon 名称，参考 Icon */
    icon: PropTypes.string,
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

  changeAvatar = (res) => {
    const { onChangeAvatar } = this.props;
    Call(onChangeAvatar, res);
  }
  // customUpload = e => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   const modalId = ShowModal({
  //     // type: "confirm",
  //     width: 400,
  //     children: (
  //       <CroppieHelper changeAvatar={this.changeAvatar} onClose={e => CloseModal(modalId)}/>
  //     ),
  //     showFuncBtn: false,
  //     title: this.$T_UKE("自定义头像"),
  //   });
  // };

  renderMoreOptions = ({ hide }) => {
    const { faceOptions } = this.props;
    return (
      <div className="avatar-options">
        {
          faceOptions.map((src, idx) => {
            return (
              <span
                key={idx}
                className="img"
                onClick={e => {
                  this.changeAvatar(src);
                  hide();
                }}>
                <img
                  alt=""
                  src={src}/>
              </span>
            );
          })
        }
        {/* <div style={{paddingTop: 10}}>
          <span className="link-btn theme" onClick={this.customUpload}>{$T_UKE('自定义头像')}</span>
        </div> */}
      </div>
    );
  }

  render() {
    const {
      text,
      src,
      alt,
      size,
      position,
      children
    } = this.props;

    const sizeStyle = {
      width: size, height: size, fontSize: size / 1.5, lineHeight: size + 'px'
    };
    const _img = src && (
      <div style={{
        backgroundImage: `url(${src})`
      }} alt={alt} className="img fixbg fill" />
    );

    let child = children || text;

    return (
      <DropdownWrapper position={position}
        overlay={this.renderMoreOptions}>
        <span className="uke-avatar">
          <span
            className="avatar fixbg"
            style={sizeStyle}>
            {child}
            {_img}
          </span>
          {/* {changeAvatarDOM} */}
        </span>
      </DropdownWrapper>
    );
  }
}
