import React from 'react';
import { Notify } from '..';

export default () => {
  return (
    <div>
      <span className="btn theme mr10"
        onClick={(e) => {
          Notify({
            position: 'top,right',
            text: '通知内容',
            // id: 'ID',
            title: '通知标题',
            type: 'white', // [success error normal warn black white] default 'desc'
            timer: -1,
            onClickTip: (clickParams) => { console.log(clickParams); },
            actionText: '有 action 时显示的文字',
          });
        }}>
        广播通知
      </span>
      <span className="btn red mr10"
        onClick={(e) => {
          Notify({
            position: 'bottom,right',
            text: '通知内容',
            // id: 'ID',
            title: '通知标题',
            type: 'warn', // [success error normal warn black white] default 'desc'
            timer: 7,
            onClickTip: (clickParams) => { console.log(clickParams); },
            actionText: '有 action 时显示的文字',
          });
        }}>
        右下角广播通知
      </span>
      <span className="btn green mr10"
        onClick={(e) => {
          Notify({
            position: 'bottom,right',
            text: '通知内容',
            // id: 'ID',
            title: '通知标题',
            type: 'success', // [success error normal warn black white] default 'desc'
            timer: 7,
            onClickTip: (clickParams) => { console.log(clickParams); },
            actionText: '有 action 时显示的文字',
          });
        }}>
        成功
      </span>
    </div>
  );
};
