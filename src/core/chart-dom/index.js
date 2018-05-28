import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import Loading from '../loading';

let chartjsURL = '';

export default class ChartCom extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: !window.Chart
    }
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
        $GH.CallFunc(callback)();
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
    const {data, type = 'line', options = {}} = this.props;
    const ctx = this.refs.lineChart;
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
          ref="lineChart"
          style={{width: '100%', height: '100%'}}></canvas>
      </Loading>
    )
  }
}
ChartCom.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  type: PropTypes.string
};
ChartCom.setChartJSPath = function(path) {
  chartjsURL = path.replace(/\/$/, "/");
};
