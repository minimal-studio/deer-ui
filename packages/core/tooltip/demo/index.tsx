import React, { useState } from 'react';
import { ToolTip } from '..';

const Demo = () => {
  const [isShow, setShow] = useState(true);
  return (
    <div>
      {
        isShow ? (
          <ToolTip
            onClick={e => setShow(!isShow)}
            clickToClose
            title="就是这么爽"
            n="angry" />
        ) : (
          <span onClick={e => setShow(true)}>显示</span>
        )
      }
    </div>
  );
};

const Demo2 = () => {
  const [isOpen, setOpen] = useState(false);
  const [position, setPos] = useState('left');
  return (
    <div>
      <span className="ms10 link" onClick={e => setPos('left')}>左</span>
      <span className="ms10 link" onClick={e => setPos('right')}>右</span>
      <span className="ms10 link" onClick={e => setPos('top')}>上</span>
      <span className="ms10 link" onClick={e => setPos('bottom')}>下</span>
      <hr />
      <ToolTip
        onClick={e => setOpen(!isOpen)}
        position={position}
        title={!isOpen ? "打开书" : "关闭书"}
        className="bg_default p10"
        n={isOpen ? "book-open" : "book"}>
        打开位置 {position}
      </ToolTip>
    </div>
  );
};
