import React, { PureComponent } from 'react';
import { Icon } from '../icon';

export interface AlertProps {
  /** panel 的 title */
  title?: string;
  /** panel 的一项内容 */
  text?: any;
  /** panel 的类型 */
  type?: 'warn'|'error'|'success'|'normal';
  /** 是否默认显示内容 */
  defaultShow?: boolean;
  /** 数据数据，任意类型，渲染出来带有序号 */
  texts?: any[];
  /** 是否需要内容收起展开的开关 */
  needToolTip?: boolean;
  /** 是否可收缩内容 */
  collapse?: boolean;
}

export default class Alert extends PureComponent<AlertProps, {
  showContent: boolean;
}> {
  static defaultProps = {
    type: 'normal',
    needToolTip: false,
    defaultShow: true,
    collapse: false,
    title: '',
    text: '',
  }

  state = {
    showContent: !!this.props.defaultShow
  };

  toggleContent = () => {
    this.setState(({ showContent }) => ({
      showContent: !showContent
    }));
  }

  render() {
    const {
      title, text, texts = [], type, needToolTip, defaultShow, collapse, ...other
    } = this.props;
    const { showContent } = this.state;

    const titleDOM = title && (
      <h4 className="title">
        <div onClick={collapse ? this.toggleContent : undefined}>
          {title}
          {
            collapse && (
              <Icon
                n={showContent ? "arrow-up" : "arrow-down"} />
            )
          }
        </div>
      </h4>
    );

    const textDOM = text && (
      <div className="item">{text}</div>
    );

    const textsDOM: any[] = [];

    for (let i = 0; i < texts.length; i++) {
      const currT = texts[i];
      if (currT) {
        textsDOM.push(
          <div className="item" key={i}>{`${i + 1}.`} {currT}</div>
        );
      }
    }

    return (
      <div className={`__alert ${type}`} {...other}>
        {titleDOM}
        {
          showContent ? (
            <React.Fragment>
              {textDOM}
              {textsDOM}
            </React.Fragment>
          ) : null
        }
      </div>
    );
  }
}
