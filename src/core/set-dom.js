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
  if(!element) return;
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += (current.offsetLeft + current.clientLeft);
    current = current.offsetParent;
  }
  return actualLeft;
}

export function getElementTop(element) {
  if(!element) return;
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null) {
    actualTop += (current.offsetTop + current.clientTop);
    current = current.offsetParent;
  }
  return actualTop;
}

export function getElementOffset(elem) {
  if(!elem) return console.log('please pass elem');
  let left = getElementLeft(elem);
  let top = getElementTop(elem);
  return {
    offsetLeft: left, offsetTop: top
  };
}