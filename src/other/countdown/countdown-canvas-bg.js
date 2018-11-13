/**
 * 目前暂时废弃的组件
 */

import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class CountdownBg extends PureComponent {
  componentDidMount() {
    const {id} = this.props;
    var canvas = document.querySelector('#countDown' + id);
    var ctx = canvas.getContext('2d');

    let lineWidth = 3;
    let canvasW = canvas.width;
    let circleX = canvasW / 2;
    let circleY = circleX;
    let radius = (canvasW - lineWidth) / 2;
    this.animationTime = 200; // ms

    this.canvasInfo = {
      ctx,
      circleX,
      circleY,
      radius,
      lineWidth,
    };

    this.draw();
  }
  // TODO: 通过不同的 key 来刷新，不需要这个
  // componentWillReceiveProps(nextProps) {
  //   let currPercent = this.props.percent;
  //   if(this.props.text !== nextProps.text) {
  //     if(this.timer) clearInterval(this.timer);
  //     this.timer = setInterval(() => {
  //       let nextPercent = nextProps.percent;
  //       let unit = (nextPercent - currPercent) / 20;

  //       if(!nextPercent || currPercent >= nextPercent) return clearInterval(this.timer);
  //       currPercent += unit < 1 ? 1: unit;
  //       this.draw(currPercent || 0);
  //     }, 20);
  //   }
  // }
  circle(cx, cy, r) {
    const {ctx, circleX, circleY, radius, lineWidth} = this.canvasInfo;

    ctx.beginPath();
    ctx.moveTo(cx + r, cy);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#eee';
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
  }
  sector(cx, cy, r, startAngle, endAngle, anti) {
    const {ctx, circleX, circleY, radius, lineWidth} = this.canvasInfo;

    ctx.beginPath();
    ctx.moveTo(cx, cy + r); // 从圆形底部开始画
    ctx.lineWidth = lineWidth;

    // 渐变色 - 可自定义
    var linGrad = ctx.createLinearGradient(
      circleX, circleY - radius - lineWidth, circleX, circleY + radius + lineWidth
    );
    linGrad.addColorStop(0.0, '#fe0362');
    linGrad.addColorStop(1.0, '#7473e3');
    ctx.strokeStyle = linGrad;

    // 圆弧两端的样式
    ctx.lineCap = 'round';

    // 圆弧
    ctx.arc(
      cx, cy, r,
      startAngle * (Math.PI / 180.0) + (Math.PI / 2),
      endAngle * (Math.PI / 180.0) + (Math.PI / 2),
      !!anti
    );
    ctx.stroke();
  }
  draw(nextPercent) {
    const {ctx, circleX, circleY, radius, lineWidth, fontSize} = this.canvasInfo;
    const {percent, text} = this.props;
    const self = this;

    // 清除canvas内容
    ctx.clearRect(0, 0, circleX * 2, circleY * 2);
    this.circle(circleX, circleY, radius);

    // 中间的字
    // ctx.font = fontSize + 'px Arial, "Microsoft YaHei", "微软雅黑"';
    // ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';
    // ctx.fillStyle = '#999';
    // ctx.fillText(text, circleX, circleY);

    // 圆形

    // 圆弧
    this.sector(circleX, circleY, radius, 0, nextPercent / 100 * 360);

    // 控制结束时动画的速度
    // if (process / percent > 0.90) {
    //     process += 0.30;
    // } else if (process / percent > 0.80) {
    //     process += 0.55;
    // } else if (process / percent > 0.70) {
    //     process += 0.75;
    // } else {
    //     process += 1.0;
    // }
  }
  render() {
    const {id} = this.props;
    return (
      <canvas id={"countDown" + id} className="countdown-bg" width="60" height="60" />
    );
  }
}
CountdownBg.propTypes = {
  id: PropTypes.any.isRequired,
  percent: PropTypes.any.isRequired,
  text: PropTypes.any.isRequired,
};
