import React, { useState } from 'react';
import { Steps, Step } from '..';

export default () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [max, setMax] = useState(5);
  return (
    <div>
      <Steps activeIdx={activeIdx} justify="between" className="p20">
        <Step title="分步1" type="success">这里是描述1</Step>
        <Step title="分步2" type="wran">这里是描述2</Step>
        <Step title="分步3">这里是描述3</Step>
        <Step title="分步4">这里是描述4</Step>
        <Step title="分步5" type="error">
          这里是描述4这里是描述4这里是描述4这里是描述4, <span style={{
            color: 'red'
          }}>可以为任意元素</span>
        </Step>
      </Steps>

      <span className="btn theme" onClick={(e) => {
        let nextIdx = activeIdx + 1;
        if (nextIdx > max) nextIdx = 0;
        setActiveIdx(nextIdx);
      }}>
        下一个
      </span>
    </div>
  );
};
