import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class ModalHelper extends Component {
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
    this.setState(({ modalSetting }) => {
      return {
        modalSetting: {
          ...modalSetting,
          isOpen: true
        }
      };
    });
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
