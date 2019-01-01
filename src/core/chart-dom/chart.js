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
      loading: !window.Chart,
    };
  }
  componentWillUnmount = () => {
    this.Chart.destroy();
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
    if(!window.Chart) {
      if(this.timer) clearTimeout(this.timer);
      if(isLoading || !this.lineChart) {
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
    const { data, type, options = {}, id } = this.props;
    // const ctx = document.querySelector(`#${id}`);
    const ctx = this.lineChart;
    if(this.Chart) {
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
