export const NatureColors = [
  // nature color
  'theme',
  'green',
  'blue',
  'red',
  'yellow',
  'cyan',
  'gold',
  'purple',
  'orange',
  'wine',
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
  'error',
  'success',
  'warn',
  'warm',
];
export const ColorGroup = [...NatureColors, ...GrayscaleColors, ...StatusColors];

type ForEachColorParams = (color: string) => JSX.Element | JSX.Element[];
/**
 * 遍历颜色系统选项
 * @param Colors
 */
export const ForEachColor = (Colors = ColorGroup) => (getComponent: ForEachColorParams) => {
  if (!getComponent) return null;
  return Colors.map(color => getComponent(color));
};
