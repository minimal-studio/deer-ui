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

### 表格

```html
<table class="table"></table>
```

```js
<table className="table">
  <thead>
    <tr>
      <th>序号</th>
      <th>表头1</th>
      <th>表头2</th>
      <th>表头3</th>
      <th>表头4</th>
      <th>表头5</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>单元1</td>
      <td>单元2</td>
      <td>单元3</td>
      <td>单元4</td>
      <td>单元5</td>
    </tr>
    <tr>
      <td>2</td>
      <td>单元1</td>
      <td>单元2</td>
      <td>单元3</td>
      <td>单元4</td>
      <td>单元5</td>
    </tr>
  </tbody>
</table>
```