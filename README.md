### ukelli-ui

### 简易，轻便的 ui 库，提供基础的控件，聚合表单和表格的配置声明渲染方式

### [在线文档](https://ukelli.github.io/uklli-ui-document/#/globals/Overview/)

### 使用概览

/src 目录下

- /core  核心组件集，各个组件为独立组件，除了 form-generator 中是聚合组件
- /other 其他组件集合库，暂时命名为 other

##### /core 中各个组件的引入方式

```
import CitySelector from 'ukelli-ui/core/city-selector';
import MultipleHelper from 'ukelli-ui/core/multiple-selector';
import Avatar from 'ukelli-ui/core/avatar';
import Captcha from 'ukelli-ui/core/captcha';
import ChartCom from 'ukelli-ui/core/chart-dom';
import Carousel from 'ukelli-ui/core/carousel/carousel.js';
import Loading from 'ukelli-ui/core/loading';
import SwitchBtn from 'ukelli-ui/core/switch-button';
import TipPanel from 'ukelli-ui/core/tip-panel';
import Toast from 'ukelli-ui/core/toast';
import Ranger from 'ukelli-ui/core/range-selector';
import PagingBtn from 'ukelli-ui/core/paging-button';
import TipBtn from 'ukelli-ui/core/tip-button';
import Icon from 'ukelli-ui/core/icon';

import {Notify, Notification} from 'ukelli-ui/core/notification';

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

##### /other 引入方式

```
import {Ball} from 'ukelli-ui/other/ball';
import {Countdown} from 'ukelli-ui/other/countdown';
import {qrcode} from 'ukelli-ui/other/qrcode';
```
