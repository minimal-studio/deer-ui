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
