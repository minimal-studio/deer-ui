import React, { Component, PureComponent } from 'react';
import { Call } from 'basic-helper';

import { Loading } from '../loading';
import { LoadScript } from '../utils/load-stuff';

export interface ChartComProps {
  /** Chart js 的 data */
  data: {};
  /** Chart js 的  options */
  options: {};
  /** Chart js 的 type */
  type?: string;
  /** ID */
  id: string;
  /** height */
  height?: string | number;
  /** width */
  width?: string | number;
}

interface ChartComState {
  loading: boolean;
}

let chartjsURL = '';

let isLoading = false;

export default class ChartCom extends PureComponent<ChartComProps, ChartComState> {
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

  static defaultProps = {
    type: 'line',
    id: 'ukeChart',
    height: '100%',
    width: '100%',
  };

  Chart

  timer

  lineChart

  constructor(props) {
    super(props);

    this.state = {
      loading: !window.Chart,
    };
  }

  componentWillUnmount = () => {
    this.Chart && this.Chart.destroy && this.Chart.destroy();
  }

  loadChart = async (callback) => {
    isLoading = true;

    await LoadScript({
      src: chartjsURL,
    });

    this.setState({
      loading: false,
    });
    Call(callback);
    isLoading = false;
  }

  renderChart = () => {
    if (!window.Chart) {
      if (this.timer) clearTimeout(this.timer);
      if (isLoading || !this.lineChart) {
        /** 确保 chartjs 加载成功，以及 canvas 准备妥当 */
        this.timer = setTimeout(() => {
          this.setState({
            loading: false,
          });
          this.renderChart();
        }, 200);
      } else {
        this.loadChart(this._renderChart);
      }
    } else {
      this._renderChart();
    }
  }

  _renderChart = () => {
    const {
      data, type, options = {}, id
    } = this.props;
    // const ctx = document.querySelector(`#${id}`);
    const ctx = this.lineChart;
    if (this.Chart) {
      Object.assign(this.Chart, {
        data, type, options
      });
      this.Chart.update();
    } else {
      this.Chart = new window.Chart(ctx, {
        type,
        data,
        options
      });
    }
  }

  render() {
    const { loading } = this.state;
    const { id, height, width } = this.props;

    return (
      <Loading loading={loading}>
        <canvas
          className="lineChart"
          id={id}
          ref={(e) => {
            this.lineChart = e;
          }}
          style={{ width, height }}/>
      </Loading>
    );
  }
}
