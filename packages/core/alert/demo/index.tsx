import React, { useState } from 'react';
import { TipPanel } from '..';
import MockData from '../../utils/mock-data';

const test = () => {
  return (
    <div>
      <TipPanel
        title="了不起的盖茨比"
        text={MockData[0]}/>
      <TipPanel
        title="内容可收起"
        collapse
        text={MockData[3]}/>
      <TipPanel
        title="很多内容"
        texts={MockData}/>
      <TipPanel title="通用"
        type="normal"
        texts={[
          '带有序号的内容1',
          '带有序号的内容2',
        ]}/>
      <TipPanel title="成功"
        type="success"
        texts={[
          '带有序号的内容1',
          '带有序号的内容2',
        ]}/>
      <TipPanel title="重要或错误"
        type="error"
        texts={[
          '带有序号的内容1',
          '带有序号的内容2',
        ]}/>
      <TipPanel title="警告"
        type="warn"
        texts={[
          '带有序号的内容1',
          '带有序号的内容2',
        ]}/>
      <TipPanel
        title="任意组件"
        text={(
          <span className="btn red">按钮</span>
        )}/>
    </div>
  );
};
