import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call } from 'basic-helper';

import Loading from '../loading';

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
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    options: PropTypes.objectOf(PropTypes.any).isRequired,
    type: PropTypes.string
  };
  static defaultProps = {
    type: 'line'
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: !window.Chart
    };
  }
  loadChart(callback) {
    let self = this;
    fetch(
      chartjsURL,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain'
        },
        cache: 'default'
      })
      .then(res => {
        return res.text();
      })
      .then(res => {
        self.setState({
          loading: false,
        });
        try {
          eval(res);
        } catch(e) {
          console.log(e);
        }
      })
      .then(() => {
        Call(callback);
      });
  }
  renderChart() {
    if(!window.Chart) {
      this.loadChart(this._renderChart);
    } else {
      setTimeout(this._renderChart, 100);
    }
  }
  _renderChart = () => {
    const {data, type, options = {}} = this.props;
    const ctx = this.lineChart;
    new window.Chart(ctx, {
      type,
      data,
      options
    });
  }
  render() {
    const {loading} = this.state;
    return (
      <Loading loading={loading}>
        <canvas
          className="lineChart"
          ref={e => {
            if(!this.lineChart) this.lineChart = e;
          }}
          style={{width: '100%', height: '100%'}}/>
      </Loading>
    );
  }
}
