### 语意化辅助函数库

- 基础数字管理，例如数字长度、单位、长度截取等
- 特定字符串格式验证，例如是否 URL、电话号码等
- 基础的数据类型验证，例如是否 Object、function 等
- 数组操作
- 日期格式化
- 生成 UUID
- 随机函数
- Storage 封装函数，可用于 Web 和 React Native
- script 标签过滤
- 订阅发布模块, 可以规定订阅次数
- 防抖函数
- 全局函数注册机制
- 函数代理机制

#### 订阅发布模块

```js static
// 订阅发布机制
import { EventEmitter, EventEmitterClass } from 'basic-helper';
// EventEmitter 为内置的对象

// 简写 Alias
EventEmitter.on('event', callback) === EventEmitter.subscribe('event', callback)
EventEmitter.rm('event', callback) === EventEmitter.unsubscribe('event', callback)

// 新增执行次数 execTime, 如果为 0，则为无限次
EventEmitter.on('event', callback, execTime = 0);

// 新增只绑定一次的 api once
EventEmitter.once('event', callback) === EventEmitter.on('event', callback, execTime = 1) === EventEmitter.subscribe('event', callback, 1)

// 继承其中的订阅发布功能
class Demo extends EventEmitterClass {
  onRes() {
    this.emit('res', {something});
  }
}
Demo.on('res', (resConfig) => {
  
});
```

#### 函数代理

```js static
import { Call, CallFunc } from 'basic-helper';

// 无法确定 fakeFunc1 是否一个函数，可以是用函数代理，适用于 props.func
const fakeFunc1 = (arg1, arg2) => {};

// Call 第一个参数为需要代理的函数，后面的作为, 如果 fakeFunc1 不是函数
Call(fakeFunc1, 123, 321)
// CallFunc 为函数代理，无论 fakeFunc1 是否函数，都会返回一个函数
CallFunc(fakeFunc1)(123, 321)
```

```js static
import {
  GetBasicUnit, GetFloatLen,
  ToFixed,
  MoneyFormat, GetBasicUnit, GetFloatLen, ToBasicUnitMoney,
  StripScript, IsUrl, IsFunc, IsObj, IsEmail, IsPhoneNumber,
  HasValue,
  GenerateNumberRange, WrapNumbPrefix,
  CallFunc, UUID, Random, InArr,
  UnitFormat, DateParseHook,
  RemoveArrayItem
} from 'basic-helper';
```