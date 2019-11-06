import { Children, ButtonProps } from "../utils/props";
import { DropdownProps } from "../dropdown/dropdown";
import { InputProps } from "../input";
import { InputSelectorProps } from "../input-selector/input-selector";
import { SliderProps } from "../slider/slider";
import { RadioProps } from "../radio";
import { DatetimePickerProps } from "../datetimepicker";
import { SwitchProps } from "../switch-button/switch-c";
import { ToolTipProps } from "../tooltip/tooltip";

type DefaultOnChangeType = (any) => void;

export interface BaseForm<ChangeType = DefaultOnChangeType> {
  /** 显示标题 */
  title?: any | string;
  /** className */
  className?: string;
  /** 是否必填|选 */
  required?: boolean;
  /** 默认的 onChange 并不起效 */
  onChange?: ChangeType;
  /** ToolTip 的 title */
  tips?: ToolTipProps['title'];
}

export interface RefFormControl<ChangeType = DefaultOnChangeType> extends BaseForm<ChangeType> {
  /** 组件的 value 挂载在 FormGenerator 的聚合 values 的 key 引用 */
  ref: string;
}

export interface RefsFormControl<ChangeType = DefaultOnChangeType> extends BaseForm<ChangeType> {
  /** multiple ref */
  refs: string[];
}

export interface RefuFormControl<ChangeType = DefaultOnChangeType> extends BaseForm<ChangeType> {
  /** ref unique */
  refu: {
    /** key for ref, value for display title */
    [ref: string]: string;
  };
}

export interface ButtonType extends RefFormControl {
  type: 'button';
  text: ButtonProps['text'];
  onClick?: (event, ref: string) => void;
}

type CustomFormReturn = {
  component: Children;
  /** props for component */
  props: {};
};
export interface CustomFormOld extends RefFormControl {
  type: 'customFormOld';
  getCustomFormControl: (() => Children | CustomFormReturn);
}

export interface CustomForm extends RefFormControl {
  type: 'customForm';
  /**
   * 自定义插件的接口
   * 
   * @example
   * {
   *   type: 'customForm',
   *   getCustomFormControl: (onChange) => {
   *     return (
   *       <Customer onChange={nextVal => onChange(nextVal)} />
   *     )
   *   }
   * }
   */
  getCustomFormControl: (onChangeValueCallback: (nextVal) => any) => Children;
}

export interface DatetimeType extends RefFormControl, DatetimePickerProps {
  type: 'datetime';
}

export interface HiddenType extends RefFormControl {
  type: 'hidden';
  value?: any;
}

export interface DatetimeRangeType extends RefsFormControl, DatetimePickerProps {
  type: 'datetimeRange';
  /** default value for datetimePicker */
  range?: DatetimePickerProps['defaultValue'];
}

export interface InputType extends InputProps, RefFormControl<InputProps['onChange']> {
  type: 'input';
  /** props for input */
  props?: InputProps['propsForInput'];
}

export interface InputSelectorType extends InputSelectorProps, RefuFormControl<InputSelectorProps['onChange']> {
  type: 'input-selector';
}

export interface InputSelectorSType extends InputSelectorProps, BaseForm<InputSelectorProps['onChange']> {
  type: 'input-selector-s';
  ref: RefFormControl['ref'];
  /** ref for selector */
  refForS: string;
  /** default value for selector */
  defaultValueForS?: InputSelectorProps['defaultSelectorIdx'];
}

export interface InputRangeType extends InputProps, RefsFormControl<InputProps['onChange']> {
  type: 'input-range';
  range: any[];
}

export interface PasswordType extends InputType {
  type: 'password';
}

export interface RadioType extends RefFormControl, RadioProps {
  type: 'radio';
}

export interface CheckboxType extends RefFormControl, RadioProps {
  type: 'checkbox';
}

export interface TextareaType extends RefFormControl {
  type: 'textarea';
  defaultValue?: string;
}

export interface TextType extends RefFormControl {
  type: 'text';
  /** 是否高亮 */
  highlight?: boolean;
  /** 显示的值 */
  value?: any;
  /** 显示的值 */
  text?: any;
}

export interface SelectType extends RefFormControl, DropdownProps {
  type: 'select';
}

export interface SelectNativeType extends RefFormControl {
  values: {
    [val: string]: string;
  };
}

export interface SliderType extends RefFormControl, SliderProps {
  type: 'slider' | 'ranger';
  onChange?: SliderProps['onChange'];
}

export interface SwitchType extends RefFormControl, SwitchProps {
  type: 'switch';
  defaultValue?: SwitchProps['defaultChecked'];
}

export interface HRType {
  type: 'hr';
}

export type FormOptionsItemEnhance = 
ButtonType |
CustomForm |
CustomFormOld |
CheckboxType |
DatetimeType |
DatetimeRangeType |
HRType |
HiddenType |
InputType |
InputRangeType |
InputSelectorType |
InputSelectorSType |
PasswordType |
RadioType |
TextareaType |
TextType |
SwitchType |
SelectNativeType |
SelectNativeType |
SelectType;

// const demo: FormOptionsItemEnhance[] = [
//   {
//     refs: ['startDate', 'endDate'],
//     type: 'datetimeRange',
//     needTime: true,
//     title: '带默认时间',
//     range: [
//       '2019-05-05 00:00:00',
//       '2019-05-06 00:00:00',
//     ],
//   },
//   {
//     refs: ['startDate3', 'endDate3'],
//     type: 'datetimeRange',
//     needTime: false,
//     outputAsString: true,
//     title: '时间',
//     range: [],
//   },
//   {
//     refs: ['startDate2', 'endDate2'],
//     type: 'datetimeRange',
//     needTime: true,
//     title: '时间',
//     range: [],
//   },
//   {
//     ref: 'ref1',
//     tips: [123,321,222],
//     type: 'radio',
//     title: '单选控件',
//     values: {
//       value1: 'value1',
//       value2: 'value2',
//       value3: 'value3',
//     }
//   },
//   {
//     ref: 'input',
//     type: 'input',
//     title: '输入',
//   },
//   {
//     ref: 'refSelector',
//     type: 'select',
//     title: '多选控件',
//     isMultiple: true,
//     isNum: true,
//     defaultValue: [1, 2],
//     values: {
//       1: 'value1',
//       2: 'value2',
//       3: 'value3',
//     }
//   },
//   {
//     ref: 'ref_for_input',
//     refForS: 'ref_for_selector',
//     type: 'input-selector-s',
//     title: '选择输入框',
//     values: {
//       value1: 'value1',
//       value2: 'value2',
//       value3: 'value3',
//     }
//   },
//   {
//     ref: 'ref2',
//     type: 'select',
//     title: '选择控件',
//     values: {
//       value1: 'value1',
//       value2: 'value2',
//       value3: 'value3',
//     }
//   },
//   {
//     refs: ['s', 'e'],
//     type: 'input-range',
//     title: '范围',
//     range: [0, 10]
//   },
// ]
