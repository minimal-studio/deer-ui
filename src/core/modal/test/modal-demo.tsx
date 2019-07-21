import React from 'react';
import { Modal, ModalHelper } from '..';

export default class ModalDemo extends ModalHelper {
  state = {
    ...this.state,
    modalSetting: {
      ...this.state.modalSetting,
      children: '内容',
      title: '标题'
    }
  }

  render() {
    const { modalSetting } = this.state;
    return (
      <div className="relative" style={{ height: 300 }}>
        <span className="btn theme"
          onClick={(e) => {
            this.setModal({
              children: '内容2'
            });
          }}>
          打开 Modal
        </span>
        <Modal {...modalSetting} onCloseModal={e => this.closeModal()} />
      </div>
    );
  }
}
