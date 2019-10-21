- 支持国际化

分为外部 KeyMapper 和内部 UkeKeyMapper 两种情况，可以通过 setUkeLang 设置语言，默认提供 「中文」 和 「英语」 两种语言，也可以通过 setUkeLangConfig 设置更多的语言

```jsx static
import { setUkeLang, setUkeLangConfig } from 'ukelli-ui';

setUkeLangConfig({
  'zh-HK': {
    '无': '無'
  }
});
setUkeLang('zh-HK');
```

-----------------

Modal 提供可拖动模式

```jsx static
import { ShowModal, CloseModal } from 'ukelli-ui';

const ModalId = ShowModal({
  id: '', // 唯一 ID，如果是拖动模式，用于定位具体 Modal
  children: (
    <span></span>
  ),
  title: '',
  draggable: true, // 使用可拖动模式
  showFuncBtn: true, // 是否显示关闭和确定按钮
  onCloseModal: func, // 关闭窗口的回调
});

// 可以使用 CloseModal 关闭已打开的 Modal
CloseModal(ModalId);
```

Loading 组件提供两种模式，根据 inrow 参数做判定

1. loading 前的 children 不会消失
2. loading 时 children 消失

```jsx static
// inrow = false， 需要 loading 判定
<Loading loading={bool} inrow={false}>
  {
    loading ? null : (
      <span></span>
    )
  }
</Loading>
```

如果 inrow = true，不需要做 children 的 loading 判定

```jsx static
<Loading loading={bool} inrow={true}>
  <span></span>
</Loading>
```

-----------------

关于 Form 聚合表单控件的说明，以下简称 FormController

FormLayout、 FormGenerator、 ConditionGenerator 组件的 formOptions 或者 conditionOptions 参数是要第一次传入时就确定的

注意：*更改 FormLayout 中，具体字段的值*

*FormController* 是一种聚合表单的概念的实现，其内部管理所有的控件的值，内部所有控件都是受 *FormController* 控制，所以一旦已经渲染，再传入新的 formOptions 可能不起作用

如果想要改变 *FormController* 中的值，需要通过 *FormController* 的 ref.changeValues 改变

注意: *文档需要列举所有 FormGenerator 支持的 type*

```jsx static
// 如果是异步获取的表单条件，需要做 loading 判定，以下为一个完整的表单渲染例子
class Com extends Component {
  formOptions = []; // 不建议放入 state 中
  state = {
    loading: true
  }
  componentDidMount() {
    this.getFormOptions();
  }
  async getFormOptions() {
    let res = await fetch();
    this.setState({
      loading: false
    })
    this.formOptions = [
      {
        type: 'text',
        highlight: true,
        ref: 'balance',
        title: `${text}余额`,
        text: MoneyFormat(balance)
      },
      {
        type: 'text',
        highlight: true,
        ref: 'displayBal',
        text: MoneyFormat(userInfo.Balance)
      },
      {
        type: 'input',
        ref: 'TransAmount',
        title: '转换金额',
        outputType: 'number',
        desc: `可以转到游戏或者平台`
      },
    ];
  }
  onSubmit(formHelperRef) {
    /**
     * 点击按钮会触发 onSubmit ，
     * 会传入自身的 ref 作为参数，如果需要改变其中的 formOptions 的值，
     * 需要按照以下方式更改
    */
    formHelperRef.changeValues({
      // valueRef 为 formOptions 的 ref
      valueRef: value
    });
  }
  transferIn(formHelperRef) {
    let postData = {
      method: '',
      actingRef: 'INing', // 用于记录点击按钮的标记符
      data: {
        Money: 1000
      },
      onSuccess: () => {
        setTimeout(() => {
          formHelperRef.changeValues({
            displayBal: this.props.userInfo.Balance,
          });
          // this.formOptions[0].text = $GH.MoneyFormat(USER_INFO.Balance);
          this.queryBalance();
        }, 2000)
      }
    }
  }
  render() {
    const {loading, formOptions} = this.state;

    // 多个按钮的配置
    let formBtns = [
      {
        action: this.transferIn,
        text: '转入游戏',
        actingRef: 'INing', // 用于标记是否提交中的 state 标记
        className: 'theme'
      },
      {
        action: this.transferOut,
        text: '转回平台',
        actingRef: 'OUTing',
        className: 'red'
      },
    ]

    return (
      <Loading loading={loading} inrow={false}>
        {
          loading ? null : (
            <FormLayout
              ref="formHelperRef"
              /**
               * 可以通过 formBtns 设置配置多个按钮
               */
              formBtns={formBtns}
              /**
               * onSubmit 和 btnText 作为一个按钮出现
               * 如果传入 formBtns ， 则此传入的上面两个 props 会失效
               */
              onSubmit={formHelperRef => this.onSubmit(formHelperRef)}
              btnText="提交"
              formOptions={formOptions}>
              ...anything
            </FormLayout>
          )
        }
      </Loading>
    )
  }
}
```

新增一个 input-selector 查询条件类型，具体配置如下

```jsx static
this.conditionOptions = [{
  // refu 表示一个输入框中，多个前置条件的集合，与 selector 配置 values 一样的方式
  refu: {
    'User': '用户', 'Agent': '代理', 'SuperAgent': '总代'
  },
  // 默认的 refu 配置，不填默认为第一个
  defaultValueForS: 'User',
  // 是否可以多选，未实现
  multiple: false,
  // 具体的类型
  type: 'input-selector',
  // 传入到 input 组件的设置，详情参考 Input 组件
  inputProps: {},
}]
```

-----------------

ChartDOM 组件需要设置对应的 chart js 下载路径

```jsx static
ChartCom.setChartJSPath(chartJsDownloadPath);
```

-----------------

Notify, CancelNotify 只要引入 'import * as UI from ukelli-ui' 就可以使用

```jsx static
import {Notify, CancelNotify} from 'ukelli-ui';

// Notify 将返回 ID，可以提供取消
let notifyID = Notify({
  position: string,
  config: {
    type: 'success error normal black white wram',
    text: 'content',
    id: '',
    title: 'title',
    onClickTip: (config) => {}, // 如果有传入，则显示点击查看详情，并且触发此函数，
  },
  handleClick: func
});

CancelNotify(notifyID);
```

或者使用 $GH.EventEmitter.emit 方法传入

```jsx static
$GH.EventEmitter.emit('NOTIGY', config) // config 配置与上述的一致
```

-----------------

ukelli-ui/core/selector/selector 目录提供选择器的通用方法，提供基础的 value 的 state 管理，详情请参考源码

-----------------

ukelli-ui/other/state-manager 提供通用的 react 组件 state 的管理，包含完整的异步请求的 state 的处理流程，提供几个 hook 函数处理数据，可根据具体业务定制相应的流程代码，详情请查看源码

以下为 ActionBasic 的实现方式，主要是用于处理业务请求

```jsx static
import StateManager from 'ukelli-ui/other/state-manager';

export default class ActionBasic extends StateManager {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      pagingInfo: $MN.DefaultPaging,
      records: []
    };
  }
  showResDesc(resInfo) {
    return resInfo;
  }
  resDescFilter(resErrCode) {
    const resInfo = {
      hasErr: resErrCode.Code != '0',
      resDesc: resErrCode.Desc
    };
    this.showResDesc(resInfo);
    return resInfo;
  }
  defaultStateAfterPost(res, {actingRef = 'loading', recordsRef = 'Results'}) {
    let resData = res.Data || {};
    let records = resData.Results || [];
    let pagingInfo = resData.Paging || this.state.pagingInfo || this.defaultPaging;
    let errCode = res.Header.ErrCode;

    let resFilterRes = this.resDescFilter(errCode);

    return {
      ...resFilterRes,
      [actingRef]: false,
      resData,
      records,
      pagingInfo,
    };
  }
  checkResIsSuccess(res) {
    return res.Header.ErrCode.Code == '0';
  }
  wrapDataFilter(data) {
    const listRefs = ['TransAmount'];
    listRefs.forEach(ref => {
      if(data[ref]) {
        data[ref] = this.toBasicUnitMoney(data.TransAmount);
      }
    });
    return data;
  }
  async request(reqObj) {
    return $MN.$request.send(reqObj);
  }
}
```

-----------------

Radio 控件

Radio 控件须传入 defaultValue 才会有选择，否则为空

-----------------

Carousel 轮播图

```jsx static
import {Carousel} from 'ukelli-ui';
// css style config of carousel, 只有 3 个参数有效
let styleConfig = {
  width,
  height,
  margin
}
// 轮播图的内容
let carouselItems = [
  {
    action: () => {

    },
    imgUrl: '' // 图片地址
  }
];
let isMobile = true; // 移动端模式，后续继续完善

// 以下是可选的，有默认值
let transitionName = 'banner'; // 对应的 css 动画的名字
let transitionTimer = 600; // 对应的 css 动画的持续时间，默认 600ms
let thumbRate = 15; // 缩略图的缩放比例，默认 15

<Carousel
  transitionName={transitionName}
  transitionTimer={transitionTimer}
  thumbRate={thumbRate}
  styleConfig={styleConfig}
  actionClass="action-area"
  carouselItems={carouselItems}
  isMobile={isMobile}/>
```

自定义 transition css, 分为两个部分，分别是上下张的动画

```css
// to next
.banner-to-next-enter {
  opacity: 0.01;
  transform: translateX(10%);
}

.banner-to-next-enter.banner-to-next-enter-active {
  opacity: 1;
  transition: opacity $bannerTransDuration ease, transform $bannerTransDuration ease;
  transform: translateX(0);
  // transform: scale(1);
}

.banner-to-next-exit {
  opacity: 1;
  // transform: scale(1);
  transform: translateX(0);
}

.banner-to-next-exit.banner-to-next-exit-active {
  opacity: 0.01;
  transition: opacity $bannerTransDuration ease, transform $bannerTransDuration ease;
  // transform: scale(1.1);
  transform: translateX(-10%);
}

// to prev
.banner-to-prev-enter {
  opacity: 0.01;
  transform: translateX(-10%);
}

.banner-to-prev-enter.banner-to-prev-enter-active {
  opacity: 1;
  transition: opacity $bannerTransDuration ease, transform $bannerTransDuration ease;
  transform: translateX(0);
  // transform: scale(1);
}

.banner-to-prev-exit {
  opacity: 1;
  // transform: scale(1);
  transform: translateX(0);
}

.banner-to-prev-exit.banner-to-prev-exit-active {
  opacity: 0.01;
  transition: opacity $bannerTransDuration ease, transform $bannerTransDuration ease;
  // transform: scale(1.1);
  transform: translateX(10%);
}
```

-----------------

新增 Tip 组件

```jsx static
import { Tip } from 'ukelli-ui';

<Tip/>
```

-----------------
