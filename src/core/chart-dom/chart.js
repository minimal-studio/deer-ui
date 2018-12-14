import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call } from 'basic-helper';

import { Loading } from '../loading';
import { LoadScript } from '../config';

let chartjsURL = '';

let isLoading = false;

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
    isLoading = true;
    LoadScript({
      src: chartjsURL,
      onload: () => {
        this.setState({
          loading: false,
        });
        Call(callback);
        isLoading = false;
      }
    });
  }
  renderChart = () => {
    if(!window.Chart) {
      if(isLoading) {
        // 检查 chart js 是否加载完成
        if(this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
          if(window.Chart) {
            clearInterval(this.timer);
            this.setState({
              loading: false,
            });
            setTimeout(this._renderChart, 100);
          }
        }, 100);
      } else {
        this.loadChart(this._renderChart);
      }
    } else {
      setTimeout(this._renderChart, 100);
    }
  }
  _renderChart = () => {
    const { data, type, options = {}, id } = this.props;
    // const ctx = document.querySelector(`#${id}`);
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
