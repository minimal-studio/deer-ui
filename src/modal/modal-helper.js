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
  setModal(modalSetting) {
    this.setState({
      modalSetting: Object.assign({}, modalSetting, {
        isOpen: typeof modalSetting.isOpen == 'undefined' ? true : modalSetting.isOpen
      })
    });
  }
  closeModal() {
    this.setState({
      modalSetting: {
        isOpen: false
      }
    });
  }
}
