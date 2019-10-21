import { ButtonProps } from "../button/button-basic";

export type NatureColorTypes =
  'theme'
  |'white'
  |'red'
  |'orange'
  |'yellow'
  // |'gold'
  |'blue'
  |'green'
  |'purple';
export type GrayColorTypes =
  |'white'
  |'black'
  |'grey';
export type StatusColorTypes =
  |'primary'
  |'default'
  |'important'
  |'danger'
  |'success'
  |'error'
  |'warn';

export type Color = NatureColorTypes | GrayColorTypes | StatusColorTypes;
export type Sizes = 'xl' | 'lg' | 'md' | 'sm' | 'tiny';

export interface BtnItemConfig extends ButtonProps {
  /** 该按钮的操作 */
  action?: () => void;
  /** className */
  className?: string;
}

export type Children = JSX.Element | JSX.Element[] | boolean | string | null | undefined;
export type FuncChildren = () => Children;

export type DivideType = '-' | 'hr';
