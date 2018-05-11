import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class QRCode extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qrbase64: ''
    }
  }
  /**
   * 接口说明
   * 引用时需要定义对于的接口，详情请参考对于的调用方法
   */
  queryData() {
    const {origin} = this.props;
    if($UK.queryQRCodeData) {
      $UK.queryQRCodeData(base64Res => {
        this.setState({
          qrbase64: base64Res
        });
        localStorage.setItem(origin, base64Res);
      }, origin);
    }
  }
  componentDidMount() {
    this.getCacha();
  }
  getCacha() {
    const {origin} = this.props;
    let result;
    let cacha = localStorage.getItem(origin);
    if(!cacha) return this.queryData();
    this.setState({
      qrbase64: cacha
    });
  }
  render () {
    const {qrbase64} = this.state;
    if(!qrbase64) return <div></div>;
    return (
      <div className="qrcode">
        <img src={qrbase64}/>
      </div>
    )
  }
}

QRCode.propTypes = {
  origin: PropTypes.string.isRequired,
};
