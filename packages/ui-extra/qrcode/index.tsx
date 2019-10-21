import React, { Component, PureComponent } from 'react';

export interface QRCodeProps {
  /** 需要生成 QRCode 的字符串 */
  origin: string;
}

type APIQueryQRCode = (getData: (base64Res: string) => void, origin: string) => void;

let queryQRCodeData: APIQueryQRCode = (getData, origin: string) => {
  console.log('请先通过 QRCode.setAPI() 设置获取数据接口');
};

export class QRCode extends PureComponent<QRCodeProps, {
  qrbase64: string;
}> {
  static setAPI = (api: APIQueryQRCode) => { queryQRCodeData = api; };

  constructor(props) {
    super(props);
    this.state = {
      qrbase64: ''
    };
  }

  /**
   * 接口说明
   * 引用时需要定义对于的接口，详情请参考对于的调用方法
   */
  queryData() {
    const { origin } = this.props;
    queryQRCodeData((base64Res) => {
      this.setState({
        qrbase64: base64Res
      });
      localStorage.setItem(origin, base64Res);
    }, origin);
  }

  componentDidMount() {
    this.getCacha();
  }

  getCacha = () => {
    const { origin } = this.props;
    const cacha = localStorage.getItem(origin);
    if (!cacha) {
      this.queryData();
    } else {
      this.setState({
        qrbase64: cacha
      });
    }
  }

  render() {
    const { qrbase64 } = this.state;
    if (!qrbase64) return <div />;
    return (
      <div className="qrcode">
        <img src={qrbase64} alt="" />
      </div>
    );
  }
}
