import React, { useState } from 'react';
import { DropdownMenu } from '..';

const Test1 = () => {
  const values = {
    value1: 'Item 1',
    value2: 'Item 2',
    value3: 'Item 3',
  };
  const [value, setValue] = useState('value1');
  return (
    <div className="mu10">
      <DropdownMenu
        onChange={(val) => {
          setValue(val);
        }}
        value={value}
        values={values}/>
      <span className="ml10">输出值 {value}</span>
    </div>
  );
};
const Test2 = () => {
  const values = {
    value1: 'Item 1',
    value2: 'Item 2',
    value3: 'Item 3',
  };
  const [valueMul, setValueMul] = useState([]);
  return (
    <div className="mu10">
      <DropdownMenu
        onChange={(val) => {
          setValueMul(val);
        }}
        isMultiple
        values={values}/>
      <span className="ml10">输出值数组 {JSON.stringify(valueMul)}</span>
    </div>
  );
};
const Test3 = () => {
  const values = {
    value1: 'Item 1',
    value2: 'Item 2',
    value3: 'Item 3',
  };
  const [value, setValue] = useState('value1');
  let dropdownRef;
  return (
    <div className="mu10">
      <span className="btn theme mb10"
        onClick={(e) => {
          dropdownRef.changeValue('value3');
        }}>把 Dropdown 实例中的更改为 value3</span>
      <br />
      <DropdownMenu
        ref={(e) => { dropdownRef = e; }}
        onChange={(val) => {
          setValue(val);
        }}
        value={value}
        values={values}/>
      <span className="ml10">输出值 {value}</span>
    </div>
  );
};
const Test4 = () => {
  const valuesNumber = {
    0: '数字0',
    1: '数字1',
    2: '数字2',
    3: '数字3',
  };
  const [value, setValue] = useState(0);
  const [valueMul, setValueMul] = useState([]);
  return (
    <div className="mu10">
      <DropdownMenu
        onChange={(val) => {
          setValue(val);
        }}
        isNum
        defaultValue={value}
        values={valuesNumber}/>
      <span className="ml10">输出值 {value}, 类型 {typeof value}</span>
      <hr />
      <h4>多选</h4>
      <DropdownMenu
        onChange={(val) => {
          setValueMul(val);
        }}
        isMultiple
        values={valuesNumber}/>
      <span className="ml10">输出值 {valueMul.join(' ')}</span>
    </div>
  );
};
const Test5 = () => {
  const values = {
    value1: 'Item 1',
    value2: 'Item 2',
    value3: 'Item 3',
  };
  return (
    <div className="mu10">
      <span className="ms10">上左对齐</span>
      <DropdownMenu
        position="top,left"
        values={values}/>
      <hr/>
      <span className="ms10">上右对齐</span>
      <DropdownMenu
        position="top,right"
        values={values}/>
    </div>
  );
};
const Test6 = () => {
  const values = {
    value1: 'Item 1',
    value2: 'Item 2',
    value3: 'Item 3',
  };
  return (
    <div className="mu10">
      <DropdownMenu
        outside
        values={values}/>
    </div>
  );
};
const Test7 = () => {
  const values = {
    value1: 'Item 1',
    value2: 'Item 2',
    value3: 'Item 3',
  };
  let containerRef;
  return (
    <div className="mu10"
      style={{
        height: 100,
        overflow: 'auto'
      }}
      ref={(e) => { containerRef = e; }}>
      <div style={{
        height: 200
      }}>
        <DropdownMenu
          outside
          scrollElem={() => containerRef}
          values={values}/>
      </div>
    </div>
  );
};
const Test8 = () => {
  const values = {
    value1: 'Item 1',
    value2: 'Item 2',
    value3: 'Item 3',
  };
  return (
    <div className="mu10">
      <DropdownMenu
        position="top,right"
        defaultValue="123"
        values={values}/>
    </div>
  );
};
const Test9 = () => {
  const values = {
    value1: 'Item 1',
    value2: 'Item 2',
    value3: 'Item 3',
  };
  const defaultValue = ['value1', 'value2'];
  const [valueMul, setValueMul] = useState(defaultValue);
  return (
    <div className="mu10">
      <DropdownMenu
        onChange={(val) => {
          setValueMul(val);
        }}
        isMultiple
        defaultValue={defaultValue}
        values={values}/>
      <span className="ml10">输出值 {valueMul.join(',')}</span>
    </div>
  );
};
const Test10 = () => {
  const values = {
    value1: 'Item 1',
    value2: 'Item 2',
    value3: 'Item 3',
  };
  return (
    <div className="mu10">
      <DropdownMenu
        withInput={false}
        values={values}/>
    </div>
  );
};
