import React, { useState } from 'react';
import { Alert } from '..';
import MockData from '../../utils/mock-data';

const test = () => {
  return (
    <div>
      <Alert
        title="了不起的盖茨比"
        text={MockData[0]}
      />
      <Alert
        title="内容可收起"
        collapse
        text={MockData[3]}
      />
      <Alert
        title="很多内容"
        texts={MockData}
      />
      <Alert title="通用"
        type="normal"
        texts={[
          '带有序号的内容1',
          '带有序号的内容2',
        ]}
      />
      <Alert title="成功"
        type="success"
        texts={[
          '带有序号的内容1',
          '带有序号的内容2',
        ]}
      />
      <Alert title="重要或错误"
        type="error"
        texts={[
          '带有序号的内容1',
          '带有序号的内容2',
        ]}
      />
      <Alert title="警告"
        type="warn"
        texts={[
          '带有序号的内容1',
          '带有序号的内容2',
        ]}
      />
      <Alert
        title="任意组件"
        text={(
          <span className="btn red">按钮</span>
        )}
      />
    </div>
  );
};
