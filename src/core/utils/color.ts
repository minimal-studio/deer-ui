export const ThemeColor = [
  'theme',
];
export const ExampleColors = [
  // nature color
  // 'theme',
  'blue',
  'green',
  'orange',
  'red',
  'default',
  // 'cyan',
  // 'purple',
  // 'wine',
  // 'yellow',
  // 'gold',
];
export const NatureColors = [
  // nature color
  'blue',
  'light-blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'red',
  'purple',
];
export const GrayscaleColors = [
  // Grayscale
  'white',
  'black',
  'grey',
  'default',
];
export const StatusColors = [
  // status color
  'important',
  'primary',
  'danger',
  'error',
  'success',
  'warn',
  'warm',
];
export const ColorGroup = [...ThemeColor, ...NatureColors, ...GrayscaleColors, ...StatusColors];

type ForEachColorParams = (color: string, idx: number) => JSX.Element | JSX.Element[];
/**
 * 遍历颜色系统选项
 * @param Colors
 */
export const ForEachColor = (Colors = ExampleColors) => (getComponent: ForEachColorParams) => {
  if (!getComponent) return null;
  return Colors.map((color, idx) => getComponent(color, idx));
};
