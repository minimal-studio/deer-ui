### ukelli-ui

### 简易，轻便的 ui 库，提供基础的控件，聚合表单和表格的配置声明渲染方式

### [在线文档](https://ukelli.github.io/uklli-ui-document/#/globals/Overview/)

### 使用概览

/src 目录下

- /core  核心组件集，各个组件为独立组件，除了 form-generator 中是聚合组件
- /other 其他组件集合库，暂时命名为 other

##### /core 中各个组件的引入方式

```
import CitySelector from 'ukelli-ui/city-selector';
import MultipleHelper from 'ukelli-ui/multiple-selector';
import Avatar from 'ukelli-ui/avatar';
import Captcha from 'ukelli-ui/captcha';
import ChartCom from 'ukelli-ui/chart-dom';
import Carousel from 'ukelli-ui/carousel/carousel.js';
import Loading from 'ukelli-ui/loading';
import SwitchBtn from 'ukelli-ui/switch-button';
import TipPanel from 'ukelli-ui/tip-panel';
import Toast from 'ukelli-ui/toast';
import Ranger from 'ukelli-ui/range-selector';
import PagingBtn from 'ukelli-ui/paging-button';
import TipBtn from 'ukelli-ui/tip-button';
import Icon from 'ukelli-ui/icon';

import {Notify, Notification} from 'ukelli-ui/notification';

import {Popover, GlobalPopover, PopoverEntity} from 'ukelli-ui/popover';
import {FormGenerator, FormFilter, FormLayout, ConditionGenerator} from 'ukelli-ui/form-generator';
import {DatepickerHelper, DatetimePicker} from 'ukelli-ui/datetimepicker';
import {Input, IconInput} from 'ukelli-ui/form-control';
import {Button} from 'ukelli-ui/button';
import {MapperFilter, TableBody, RecordItemsHelper, DescHelper} from 'ukelli-ui/record-render';
import {Tab, Tabs} from 'ukelli-ui/tabs';
import {Modal, ModalHelper, ShowGlobalModal, CloseGlobalModal} from 'ukelli-ui/modal';
import {DropdownMenu, Radio} from 'ukelli-ui/selector';
```

##### /other 引入方式

```
import {Ball} from 'ukelli-ui/other/ball';
import {Countdown} from 'ukelli-ui/other/countdown';
import {qrcode} from 'ukelli-ui/other/qrcode';
```
