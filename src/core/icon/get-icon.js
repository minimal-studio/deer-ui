import {getUkelliConfig} from '../config';

export default function getIcon(iconName, moreClassName) {
  const iconMapper = getUkelliConfig('iconMapper');
  const iconPrefix = getUkelliConfig('iconPrefix');
  if(!iconName) return iconMapper;
  let moreClassNameArr = Array.isArray(moreClassName) ? moreClassName : [moreClassName];
  let resultStr = iconPrefix + iconMapper[iconName] + ' ' + moreClassNameArr.join(' ');
  return resultStr;
}
