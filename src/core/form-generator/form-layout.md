表单生成器的再一层封装模版，用于渲染通用表单配置

- 表单渲染
- 表单操作按钮的行为与显示
- 操作按钮的状态

```js
<FormLayout
  btnConfig={[
    {
      action: (formRef, actingRef) => {
        console.log(formRef.value, actingRef);
      },
      text: '测试按钮',
      actingRef: 'forTest'
    }
  ]}
  formOptions={[
    {
      refs: ['startDate', 'endDate'],
      type: 'datetimeRange',
      title: '日期',
      required: true,
      range: ['2018-10-10', '2018-10-11']
    },
    {
      ref: 'ref1',
      type: 'radio',
      title: '单选控件',
      values: {
        value1: 'value1',
        value2: 'value2',
        value3: 'value3',
      }
    },
    {
      ref: 'ref2',
      type: 'select',
      title: '选择控件',
      values: {
        value1: 'value1',
        value2: 'value2',
        value3: 'value3',
      }
    },
    {
      ref: 'ref3',
      type: 'input',
      title: '输入数字',
      required: true,
      inputType: 'number'
    },
    {
      refs: ['_ref3', '_ref4'],
      type: 'input-range',
      title: '范围输入',
      required: true,
      inputType: 'number'
    },
    {
      refu: {
        'refu1': '1', 'refu2': '2', 'refu3': '3'
      },
      type: 'input-selector',
      title: '选择器输入',
      required: true,
      inputType: 'number'
    },
  ]}/>
```

表单联动

```js
class ForTest extends React.Component {
  constructor(props) {
    super(props)

    this.formOptions = [
      {
        refs: ['startDate', 'endDate'],
        type: 'datetimeRange',
        title: '日期',
        required: true,
        range: ['2018-10-10', '2018-10-11']
      },
      {
        ref: 'ref1',
        type: 'radio',
        title: '单选控件',
        values: {
          value1: 'value1',
          value2: 'value2',
          value3: 'value3',
        }
      },
      {
        ref: 'ref2',
        type: 'select',
        title: '选择控件',
        values: {
          value1: 'value1',
          value2: 'value2',
          value3: 'value3',
        }
      },
      {
        ref: 'ref3',
        type: 'input',
        title: '输入',
        required: true,
        inputType: 'number'
      },
    ]

    this.formOptionsMapper = {
      value1: [
        {
          ref: 'test',
          type: 'input',
          title: '测试1'
        }
      ],
      value2: [
        {
          ref: 'test',
          type: 'input',
          title: '测试2'
        }
      ],
      value3: [
        {
          ref: 'test',
          type: 'input',
          title: '测试3'
        }
      ],
    }

    this.state = {
      activeVal: ''
    }
  }
  render() {
    const { activeVal } = this.state;
    return (
      <div>
        <FormLayout
          btnConfig={[
            {
              action: (formRef, actingRef) => {
                console.log(formRef, actingRef);
              },
              text: '测试按钮',
              actingRef: 'forTest'
            }
          ]}
          onChange={(value, ref) => {
            if(ref == 'ref1' || ref == 'ref2') this.setState({
              activeVal: value[ref]
            })
          }}
          formOptions={this.formOptions}/>
        {
          activeVal ? (
            <FormLayout
              key={activeVal}
              btnConfig={[
                {
                  action: (formRef, actingRef) => {
                    console.log(formRef, actingRef);
                  },
                  text: '测试按钮',
                  actingRef: 'forTest'
                }
              ]}
              formOptions={this.formOptionsMapper[activeVal]}/>
          ) : null
        }
      </div>
    )
  }
}
<ForTest/>
```