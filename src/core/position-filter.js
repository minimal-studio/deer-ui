/**
 * 用于过滤控件的定位标识, 确保位置准确性
 * 检查缺失项，并且补全
 * 过滤重复位置标识
 * @param {"verticalPosition,horizontalPosition"} position
 * @returns {"verticalPosition horizontalPosition"}
 */
export default function positionFilter(position) {
  let horizontal = ['left', 'right'];
  let vertical = ['bottom', 'top'];
  let all = [...horizontal, ...vertical];
  let result = [];
  let positionArr = position.split(/,|\./);
  all.forEach(pos => {
    let posIdx = positionArr.indexOf(pos);
    if(posIdx != -1) {
      result.push(pos);
    }
  });
  if(result.length < 2) {
    let hasPos = result[0];
    horizontal.indexOf(hasPos) == -1 && result.push(horizontal[0]);
    vertical.indexOf(hasPos) == -1 && result.push(vertical[0]);
  }
  return result.join(' ');
}