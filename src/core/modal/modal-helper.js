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
  setModal = (mextSetting) => {
    this.setState(({ modalSetting }) => {
      const { isOpen = true } = mextSetting;
      return {
        modalSetting: Object.assign({}, modalSetting, mextSetting, {
          isOpen
        })
      };
    });
  }
  closeModal = () => {
    this.setState({
      modalSetting: {
        isOpen: false
      }
    });
  }
}
