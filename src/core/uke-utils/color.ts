export const ColorGroup = ['theme', 'red', 'orange', 'yellow', 'gold', 'blue', 'green', 'light-p', 'primary', 'default', 'white', 'important', 'warn', 'black', 'grey', 'wine'];

type ForEachColorParams = (color: string) => JSX.Element | JSX.Element[];
export const ForEachColor = (getComponent: ForEachColorParams) => {
  if (!getComponent) return null;
  return ColorGroup.map(color => getComponent(color));
};
