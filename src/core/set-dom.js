export default function setDOMById(targetID, className = '') {
  if(!targetID) console.log('params id is required');
  let targetDOM = document.getElementById(targetID);
  if(!targetDOM) {
    targetDOM = document.createElement('div');
    targetDOM.id = targetID;
    targetDOM.className = className;
    document.body.appendChild(targetDOM);
  }
  return targetDOM;
}

export function getElementLeft(element) {
  return getElementOffset(element).offsetLeft;
}

export function getElementTop(element) {
  return getElementOffset(element).offsetTop;
}

export function getElementOffset(element) {
  if(!element) return;
  var actualTop = element.offsetTop;
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    const currentStyle = getComputedStyle(current);
    const isFixed = currentStyle.position === 'fixed';
    console.log(current, current.scrollTop)
    actualLeft += (current.offsetLeft + current.clientLeft - (isFixed ? current.scrollLeft : 0));
    actualTop += (current.offsetTop + current.clientTop - (isFixed ? current.scrollTop : 0));
    current = current.offsetParent;
  }
  return {
    offsetLeft: actualLeft,
    offsetTop: actualTop
  };
}