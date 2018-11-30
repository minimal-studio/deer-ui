import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call } from 'basic-helper';

import { Loading } from '../loading';
import { LoadScript } from '../config';

let chartjsURL = '';

export default class ChartCom extends PureComponent {
  /**
   * 设置 Chart js 库的获取地址
   *
   * @static
   * @memberof ChartCom
   * @public
   */
  static setChartJSPath = (path) => {
    chartjsURL = path.replace(/\/$/, "/");
  };
  static propTypes = {
    /** data */
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    /** 选项 */
    options: PropTypes.objectOf(PropTypes.any),
    /** ID */
    id: PropTypes.string,
    /** type */
    type: PropTypes.string
  };
  static defaultProps = {
    type: 'line',
    id: 'ukeChart'
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: !window.Chart
    };
  }
  loadChart = (callback) => {
    LoadScript({
      src: chartjsURL,
      onload: () => {
        this.setState({
          loading: false,
        });
        Call(callback);
      }
    });
    // fetch(
    //   chartjsURL,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'text/plain'
    //     },
    //     cache: 'default'
    //   })
    //   .then(res => {
    //     return res.text();
    //   })
    //   .then(res => {
    //     self.setState({
    //       loading: false,
    //     });
    //     try {
    //       eval(res);
    //     } catch(e) {
    //       console.log(e);
    //     }
    //   })
    //   .then(() => {
    //     Call(callback);
    //   });
  }
  renderChart = () => {
    if(!window.Chart) {
      this.loadChart(this._renderChart);
    } else {
      setTimeout(this._renderChart, 100);
    }
  }
  _renderChart = () => {
    const { data, type, options = {} } = this.props;
    const ctx = this.lineChart;
    new window.Chart(ctx, {
      type,
      data,
      options
    });
  }
  render() {
    const { loading } = this.state;
    const { id } = this.props;

    return (
      <Loading loading={loading}>
        <canvas
          className="lineChart"
          id={id}
          ref={e => {
            this.lineChart = e;
          }}
          style={{width: '100%', height: '100%'}}/>
      </Loading>
    );
  }
}
