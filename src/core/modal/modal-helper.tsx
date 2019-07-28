import React, { Component, PureComponent } from 'react';
import { ModalProps } from './modal';

export interface ModalConfig {
  title?: string;
  isOpen: boolean;
  children: any;
  id: string;
}
export interface ModalHelperState {
  modalSetting: ModalConfig;
}

export default class ModalHelper<
  P extends ModalProps = ModalProps
> extends Component<P, ModalHelperState> {
  constructor(props) {
    super(props);
    this.state = {
      modalSetting: {
        title: '',
        isOpen: false,
        children: '',
        id: ''
      }
    };
  }

  showModal = () => {
    this.setState(({ modalSetting }) => ({
      modalSetting: {
        ...modalSetting,
        isOpen: true
      }
    }));
  }

  setModal = (nextSetting) => {
    this.setState(({ modalSetting }) => {
      const { isOpen = true } = nextSetting;
      return {
        modalSetting: Object.assign({}, modalSetting, nextSetting, {
          isOpen
        })
      };
    });
  }

  closeModal = () => {
    const { modalSetting } = this.state;
    this.setState({
      modalSetting: {
        ...modalSetting,
        isOpen: false
      }
    });
  }
}
