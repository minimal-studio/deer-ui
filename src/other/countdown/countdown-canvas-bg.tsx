/**
 * 目前暂时废弃的组件
 */

import React, { Component, PureComponent } from 'react';

interface CountdownBgProps {
  id: any;
  percent: any;
  text: any;
}

export default class CountdownBg extends PureComponent<CountdownBgProps> {
  animationTime

  canvasInfo

  componentDidMount() {
    const { id } = this.props;
    const canvas = document.querySelector(`#countDown${id}`) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const lineWidth = 3;
    const canvasW = canvas.width;
    const circleX = canvasW / 2;
    const circleY = circleX;
    const radius = (canvasW - lineWidth) / 2;
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

  circle(cx, cy, r) {
    const {
      ctx, circleX, circleY, radius, lineWidth
    } = this.canvasInfo;

    ctx.beginPath();
    ctx.moveTo(cx + r, cy);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#eee';
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
  }

  sector(cx, cy, r, startAngle, endAngle, anti = false) {
    const {
      ctx, circleX, circleY, radius, lineWidth
    } = this.canvasInfo;

    ctx.beginPath();
    ctx.moveTo(cx, cy + r); // 从圆形底部开始画
    ctx.lineWidth = lineWidth;

    // 渐变色 - 可自定义
    const linGrad = ctx.createLinearGradient(
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

  draw(nextPercent = 0) {
    const {
      ctx, circleX, circleY, radius, lineWidth, fontSize
    } = this.canvasInfo;

    // 清除canvas内容
    ctx.clearRect(0, 0, circleX * 2, circleY * 2);
    this.circle(circleX, circleY, radius);
    // 圆弧
    this.sector(circleX, circleY, radius, 0, nextPercent / 100 * 360);
  }

  render() {
    const { id } = this.props;
    return (
      <canvas id={`countDown${id}`} className="countdown-bg" width="60" height="60" />
    );
  }
}
