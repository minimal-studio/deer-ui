# ukelli-ui

## 请查看[关于 UI 的逻辑思考](./ui-logic.md)

## 简易，轻便的 ui 库，提供基础的控件，聚合表单和表格的配置声明渲染方式

## [在线文档](https://ukelli.github.io/uklli-ui-document/#/globals/Overview/)

## 使用概览

/src 目录下

- /core  核心组件集，各个组件为独立组件，除了 form-generator 中是聚合组件
- /other 其他组件集合库，暂时命名为 other

### /core 中各个组件的引入方式

```js
import CitySelector from 'ukelli-ui/core/city-selector';
import MultipleHelper from 'ukelli-ui/core/multiple-selector';
import Avatar from 'ukelli-ui/core/avatar';
import Captcha from 'ukelli-ui/core/captcha';
import ChartCom from 'ukelli-ui/core/chart-dom';
import Carousel from 'ukelli-ui/core/carousel/carousel';
import Loading from 'ukelli-ui/core/loading';
import SwitchBtn from 'ukelli-ui/core/switch-button';
import TipPanel from 'ukelli-ui/core/tip-panel';
import Toast from 'ukelli-ui/core/toast';
import Ranger from 'ukelli-ui/core/range-selector';
import PagingBtn from 'ukelli-ui/core/paging-button';
import TipBtn from 'ukelli-ui/core/tip-button';
import Icon from 'ukelli-ui/core/icon';
import Label from 'ukelli-ui/core/label';

import {Notify, CancelNotify, Notification} from 'ukelli-ui/core/notification';

import {Popover, GlobalPopover, PopoverEntity} from 'ukelli-ui/core/popover';
import {FormGenerator, FormFilter, FormLayout, ConditionGenerator} from 'ukelli-ui/core/form-generator';
import {DatepickerHelper, DatetimePicker} from 'ukelli-ui/core/datetimepicker';
import {Input, IconInput} from 'ukelli-ui/core/form-control';
import {Button} from 'ukelli-ui/core/button';
import {MapperFilter, TableBody, RecordItemsHelper, DescHelper} from 'ukelli-ui/core/record-render';
import {Tab, Tabs} from 'ukelli-ui/core/tabs';
import {Modal, ModalHelper, ShowGlobalModal, CloseGlobalModal} from 'ukelli-ui/core/modal';
import {DropdownMenu, Radio} from 'ukelli-ui/core/selector';
```

### /other 引入方式

```js
import {Ball} from 'ukelli-ui/other/ball';
import {Countdown, CountdownBg} from 'ukelli-ui/other/countdown';
import {QRCode} from 'ukelli-ui/other/qrcode';
import StateManager from 'ukelli-ui/other/state-manager';
```

-----------------

## 简要说明

依赖 basic-helper ，UI 库的全局作用域为 window.$UKE, 可以通过配置去改变

## 配置准备

提供一个接口，设置 UI 库的部分内部结构，某些控件在使用前需要传入必要的配置，设置都挂载在 $UKE 作用域下

```js
import {setUkelliConfig} from 'ukelli-ui';

setUkelliConfig({
  // Avatar 头像控件的 img mapper
  avatarImgMap: 'face',

  // Icon 的 mapper， Ukelli UI 库并不提供内置的 icon，可以根据具体项目的实际使用来决定使用什么 icon 库
  iconMapper,

  // icon 的前缀，与 iconMapper 同用
  iconPrefix,

  // 查询验证码的接口，如果需要使用验证码的表单，则需要设置此方法
  queryCAPTCHAData: () => {
    return {
      hasErr: bool,
      captchaImage: base64Img,
      captchaKey: CaptchaKey
    }
  },

  // 查询二维码的接口，返回 base64 的 image 即可
  queryQRCodeData: () => {
    return base64Img;
  }
})
```

## [组件说明](./docs/components.md)

## 引用其他的外部库依赖

为了减少打包体积，外部库都需要通过 load script 的方式引入

外部库引用列表

- CroppieJs // 设置头像
- ChartJs   // 图表显示

```js
import {Avatar, ChartDOM} from 'ukelli-ui';
Avatar.setCroppieUrl(loadUrl);
ChartDOM.setChartJSPath(loadUrl);
```
