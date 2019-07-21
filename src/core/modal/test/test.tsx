/**
 * 用于测试组件的 props 是否设置正确
 */
import React from 'react';
import { ShowModal, Modal, CloseModal } from '..';

const ModalID = ShowModal({
  template: props => (<div></div>),
  title: 'sasd',
  children: false
});
CloseModal(ModalID);

const M = () => <Modal onCloseModal={() => false} isOpen={false} />;
