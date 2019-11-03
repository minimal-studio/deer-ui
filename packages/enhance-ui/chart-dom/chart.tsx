import React, { Component, PureComponent } from 'react';
import { Call } from '@mini-code/base-func';

import { LoadScript } from '@dear-ui/core/utils/load-stuff';
import { Loading } from '@dear-ui/core/loading';

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
  /** 加载外部资源成功的回调 */
  onLoadDep?: () => void;
}

interface ChartComState {
  loading: boolean;
}

let chartjsURL = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js';

let isLoading = false;
let isLoaded = false;

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
    id: 'ChartID',
    height: '100%',
    width: '100%',
  };

  Chart

  timer

  lineChart

  constructor(props) {
    super(props);

    this.state = {
      loading: !isLoaded,
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
    isLoaded = true;
    Call(this.props.onLoadDep);
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
