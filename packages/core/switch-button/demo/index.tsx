import React, { useState } from 'react';
import { SwitchBtn, Switch } from '..';

const Test1 = () => {
  const [activeIdx, setIdx] = useState('btn1');

  return (
    <div>
      <SwitchBtn
        onSwitch={val => setIdx(val)}
        activeIdx={activeIdx}
        btns={{
          btn1: '选项1',
          btn2: '选项2',
          btn3: '选项3',
        }} />
    </div>
  );
};

const Test2 = () => {
  const [activeIdx, setIdx] = useState(0);

  return (
    <div>
      <SwitchBtn
        onSwitch={val => setIdx(val)}
        activeIdx={activeIdx}
        isNum
        btns={{
          0: '选项1',
          1: '选项2',
          2: '选项3',
        }} />
    </div>
  );
};

const Test3 = () => {
  const [activeIdx, setIdx] = useState('btn1');
  console.log(activeIdx);

  return (
    <div>
      <SwitchBtn
        onSwitch={val => setIdx(val)}
        disabled
        activeIdx={'btn1'}
        btns={{
          btn1: '选项1',
          btn2: '选项2',
          btn3: '选项3',
        }} />
    </div>
  );
};

const TestSwitch = () => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(0);
  return (
    <div>
      <h4>开关, 输出: {JSON.stringify(checked1)}</h4>
      <Switch
        onChange={val => setChecked1(val)}
        checked={checked1} />
      <h4>输出期望值: {checked2}</h4>
      <Switch
        onChange={(val) => {
          console.log(val);
          setChecked2(val);
        }}
        outputs={[1, 0]}
        checked={checked2} />
      <h4>不受控组件</h4>
      <Switch
        onChange={(val) => {
          console.log(val);
        }}
        outputs={[1, 0]}
        defaultChecked={true} />
      <h4>禁止的开关</h4>
      <Switch
        onChange={(val) => {}}
        disabled
        checked={false}
        tips={['开', '关']} />
    </div>
  );
};
