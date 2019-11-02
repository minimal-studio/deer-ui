import { Children } from "@dear-ui/utils/props";
import { DropdownProps } from "../dropdown/dropdown";
import { InputProps } from "../input";
import { InputSelectorProps } from "../input-selector/input-selector";
import { SliderProps } from "../slider/slider";
import { RadioProps } from "../radio";
import { ButtonProps } from "../button/button";
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
export interface CustomForm extends RefFormControl {
  type: 'customForm';
  getCustomFormControl: (() => Children | CustomFormReturn);
}

export interface DatetimeType extends RefFormControl, DatetimePickerProps {
  type: 'datetime';
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
  defaultValue: any;
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
CheckboxType |
DatetimeType |
DatetimeRangeType |
HRType |
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
