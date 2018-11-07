---------------

### 布局系统 layout

规则:

- layout + 对应的布局属性的缩写 + row- + 一份的占用的大小, 例如
- layout 为一行，分为 20 份，一个 row-1 占用一份
- 控制布局的行为使用缩写，例如 __justify-content: center === j-c-c__

.layout 的默认属性

```css
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-content: flex-start;
align-items: flex-start;
justify-content: flex-start;
```

justify-content

```js
<div className="layout">
  <span className="row-10" style={{background: '#EEE'}}>row-10</span>
  <span className="row-10" style={{background: '#AAA'}}>row-10</span>
  <span className="row-10" style={{background: '#ccc'}}>row-10</span>
</div>
<hr/>
<div className="layout">
  <span className="row-2" style={{background: '#EEE'}}>row-2</span>
  <span className="row-3" style={{background: '#AAA'}}>row-3</span>
  <span className="row-4" style={{background: '#ccc'}}>row-4</span>
</div>
<hr/>
<div className="layout j-c-c">
  <span className="row-2" style={{background: '#EEE'}}>row-2</span>
  <span className="row-3" style={{background: '#AAA'}}>row-3</span>
  <span className="row-4" style={{background: '#ccc'}}>row-4</span>
</div>
<hr/>
<div className="layout j-c-b">
  <span className="row-2" style={{background: '#EEE'}}>row-2</span>
  <span className="row-3" style={{background: '#AAA'}}>row-3</span>
  <span className="row-4" style={{background: '#ccc'}}>row-4</span>
</div>
<hr/>
<div className="layout j-c-e">
  <span className="row-2" style={{background: '#EEE'}}>row-2</span>
  <span className="row-3" style={{background: '#AAA'}}>row-3</span>
  <span className="row-4" style={{background: '#ccc'}}>row-4</span>
</div>
```

align-items

```js
<div className="layout">
  <span className="row-2" style={{background: '#EEE', height: 30}}>row-2</span>
  <span className="row-3" style={{background: '#AAA', height: 40}}>row-3</span>
  <span className="row-4" style={{background: '#ccc', height: 50}}>row-4</span>
</div>
<hr/>
<div className="layout a-i-c">
  <span className="row-2" style={{background: '#EEE', height: 30}}>row-2</span>
  <span className="row-3" style={{background: '#AAA', height: 40}}>row-3</span>
  <span className="row-4" style={{background: '#ccc', height: 50}}>row-4</span>
</div>
<hr/>
<div className="layout a-i-e">
  <span className="row-2" style={{background: '#EEE', height: 30}}>row-2</span>
  <span className="row-3" style={{background: '#AAA', height: 40}}>row-3</span>
  <span className="row-4" style={{background: '#ccc', height: 50}}>row-4</span>
</div>
<hr/>
```

align-content

```js
<div className="layout" style={{height: 120, display: 'grid'}}>
  <span className="row-2" style={{background: '#EEE', height: 20}}>row-2</span>
  <span className="row-3" style={{background: '#AAA', height: 30}}>row-3</span>
  <span className="row-4" style={{background: '#ccc', height: 40}}>row-4</span>
</div>
<hr/>
<div className="layout a-c-c" style={{height: 120, display: 'grid'}}>
  <span className="row-2" style={{background: '#EEE', height: 20}}>row-2</span>
  <span className="row-3" style={{background: '#AAA', height: 30}}>row-3</span>
  <span className="row-4" style={{background: '#ccc', height: 40}}>row-4</span>
</div>
<hr/>
<div className="layout a-c-around" style={{height: 120, display: 'grid'}}>
  <span className="row-2" style={{background: '#EEE', height: 20}}>row-2</span>
  <span className="row-3" style={{background: '#AAA', height: 30}}>row-3</span>
  <span className="row-4" style={{background: '#ccc', height: 40}}>row-4</span>
</div>
<hr/>
```

---------------

### 内外边距

通用样式 margin, padding, 规则为边距类型缩写 + 以 5 px为单位，从 5px - 20px 的 class，例如

```css static
# mt10
margin-top: 10px;

# mu10 -> margin upset, 上下边距
margin: 10px 0;

# ms10 -> margin side, 左右边距
margin: 0 10px;

# pt10
padding-top: 10px;

# pu10 -> padding upset, 上下边距
padding: 10px 0;

# ps10 -> padding side, 左右边距
padding: 0 10px;
```

---------------

### 按钮

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