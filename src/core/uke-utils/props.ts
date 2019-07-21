export type Color = 'theme'|'red'|'orange'|'yellow'|'gold'|'blue'|'green'|'light-p'|
'primary'|'default'|'white'|'important'|'warn'|'black'|
'grey'|'wine';

export interface BtnItemConfig {
  /** 该按钮的操作 */
  action?: Function;
  /** 该按钮的类型 */
  type?: 'submit' | 'button';
  /** 该按钮的字 */
  text: string;
  /** className */
  className?: string;
  /** 记录该按钮的状态 */
  actingRef?: string;
  /** 按钮颜色 */
  color?: Color;
  /** 该按钮是否需要预检查 */
  preCheck?: boolean;
}

export type FuncChildren = () => any;
export type Children = React.ReactNode | React.ElementType | HTMLElement | boolean | string | number;

export type DivideType = '-' | 'hr';
