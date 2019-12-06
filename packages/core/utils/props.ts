export interface ButtonProps {
  /** 是否加载中 */
  loading?: boolean;
  /** 是否需要加载中的提示 */
  loadingHint?: boolean;
  /** 加载中是否禁用 */
  loadingDisable?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 按钮样式是否中空 */
  hola?: boolean;
  /** 是否占据一行 */
  block?: boolean;
  /** 设置 btn 的 class */
  className?: HTMLElement['className'];
  /** btn 的字 */
  text?: string;
  /** btn 的状态 */
  status?: StatusColorTypes | 'link';
  /** btn 的颜色 */
  color?: Color;
  /** size */
  size?: Sizes;
  /** style */
  style?: React.CSSProperties;
  /** children */
  children?: any;
  /** btn 的类型 */
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /** onClick */
  onClick?: (clickEvent) => void;
}

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
export type ContainerSizes = 'xl' | 'lg' | 'md' | 'sm';

export interface BtnItemConfig extends ButtonProps {
  /** 该按钮的操作 */
  action?: () => void;
  /** className */
  className?: HTMLElement['className'];
}

export type Children =
  React.ReactNode |
  JSX.Element |
  JSX.ElementClass |
  JSX.ElementClass[] |
  JSX.Element[] |
  boolean |
  string |
  null |
  undefined;
export type FuncChildren = (props?: any) => Children;

export type DivideType = '-' | 'hr';
