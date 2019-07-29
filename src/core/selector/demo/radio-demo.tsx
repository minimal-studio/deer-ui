import React, { useState } from 'react';
import { Radio } from '..';

const Test1 = () => {
  let radio1;
  let radio2;
  let radio3;
  const values1 = {
    value1: '显示的值1',
    value2: '显示的值2',
    value3: '显示的值3',
  };
  const values2 = {
    value1: (
      <h1>标题</h1>
    ),
    value2: (
      <img src="http://m.360buyimg.com/pop/jfs/t22765/41/1722519893/139051/da2d7354/5b6948b5Nb66bd80d.png"/>
    ),
    value3: '显示的值3',
  };
  const [value, setValue] = useState('value1');
  const [valueMul, setValueMul] = useState(['value1']);
  return (
    <div>
      <span className="mr10">多选 {value}</span>
      <Radio
        ref={(e) => { radio3 = e; }}
        onChange={(val) => {
          setValueMul(val);
        }}
        isMultiple
        value={valueMul}
        values={values1}/>
      <hr />
      <span className="mr10">实际的值 {value}</span>
      <Radio
        ref={(e) => { radio1 = e; }}
        onChange={(val) => {
          console.log(val);
          setValue(val);
        }}
        value={value}
        values={values1}/>
      <hr />
      <span className="mr10">竖向排列</span>
      <Radio
        column
        ref={(e) => { radio1 = e; }}
        onChange={(val) => {
          console.log(val);
          setValue(val);
        }}
        value={value}
        values={values1}/>
      <hr />
      <div>
        <div className="mu10">可以通过 ref 来改变 Radio 的值</div>
        <div className="btn theme" onClick={e => radio1.changeValue('value3')}>点击改变为 value3</div>
      </div>
      <hr/>
      <span className="mr10">其中的内容可以为任意值</span>
      <Radio
        ref={(e) => { radio2 = e; }}
        onChange={(val) => {
          setValue(val);
        }}
        value={value}
        itemStyle={{
          border: '1px solid #EEE',
          maxWidth: 100
        }}
        values={values2}/>
    </div>
  );
};
