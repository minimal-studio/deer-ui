import React, { useState } from 'react';
import { Input } from '..';

export default () => {
  const [value, setVal] = useState();
  return (
    <div>
      <Input placeholder="请输入"
        onChange={e => console.log(e)}/>
      <Input title="固定 Title" placeholder="placeholder"
        onChange={e => console.log(e)}/>
      <Input title="输出 number 类型" placeholder="输出数字" outputType="number"
        propsForInput={{
          type: 'number'
        }}
        onChange={e => console.log(e)}/>
      <Input title="只能输入数字" filter={val => (`${val}`).replace(/[^0-9]/g, '')} />
      <Input n="phone" />
      <Input
        title="带按钮的输入框"
        outputType="number"
        inputBtnConfig={{
          action: e => console.log(e),
          text: '按钮'
        }}/>
      <Input
        title="带按钮的输入框"
        outputType="number"
        inputBtnConfig={{
          action: e => console.log(e),
          icon: 'search',
          text: ''
        }}/>
      <Input n="phone" title="电话号码" placeholder="请输入" flowTitle />
    </div>
  );
};
