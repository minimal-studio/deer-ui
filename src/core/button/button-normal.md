### 交互

```js
<Button
  className="mr10"
  onClick={e => {
    alert('你好')
  }} icon="bath" text="洗澡" />

<Button
  onClick={e => {
    alert('你好')
  }}
  icon="bath"
  color="red"
  disabled
  text="不能洗澡" />
```

-----------

### 样式

实心的按钮样式 btn

```js
<span className="btn theme m5">按钮</span>
<span className="btn red m5">按钮</span>
<span className="btn gold m5">按钮</span>
<span className="btn black m5">按钮</span>
<span className="btn default m5">按钮</span>
<span className="btn yellow m5">按钮</span>
<span className="btn light-p m5">按钮</span>
<span className="btn important m5">按钮</span>
<span className="btn warn m5">按钮</span>
<span className="btn wine m5">按钮</span>
<span className="btn grey m5">按钮</span>
```

中空的按钮 hola

```js
<span className="btn hola theme m5">按钮</span>
<span className="btn hola red m5">按钮</span>
<span className="btn hola gold m5">按钮</span>
<span className="btn hola black m5">按钮</span>
<span className="btn hola default m5">按钮</span>
<span className="btn hola yellow m5">按钮</span>
<span className="btn hola light-p m5">按钮</span>
<span className="btn hola important m5">按钮</span>
<span className="btn hola warn m5">按钮</span>
<span className="btn hola wine m5">按钮</span>
<span className="btn hola grey m5">按钮</span>
```

链接按钮 link

```js
<span className="link-btn m5">按钮</span>
<span className="link m5">按钮</span>
```

响应式按钮

```js
<span className="btn theme res">按钮</span>
```