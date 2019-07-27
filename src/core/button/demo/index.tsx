import React, { useState } from 'react';
import { Button } from '..';

export default () => {
  const defaultAvatarSrc = "https://www.jiuwa.net/uploads/image/20170506/20170506084900_43824.jpg";
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatarSrc);
  return (
    <div>
      <Button
        className="mr10"
        onClick={(e) => {
          ShowModal({
            title: '试试',
            children: (
              <div className="p20">你好</div>
            )
          });
        }} icon="archway">
        弹窗
      </Button>
      <hr />
      <Button
        onClick={(e) => {
          setState({
            loading: !state.loading
          });
          setTimeout(() => {
            setState(({ loading }) => ({
              loading: !loading
            }));
          }, 1500);
        }}
        loading={state.loading}
        icon="bolt"
        color="green"
        text="试试切换 Loading" />
      <hr />
      <Button
        onClick={(e) => {
          alert('你好');
        }}
        icon="bell-slash"
        color="red"
        disabled
        text="禁用按钮" />
      <hr />
      <Button
        onClick={(e) => {
          alert('你好');
        }}
        icon="bell-slash"
        className="res"
        disabled
        text="响应式按钮" />
    </div>
  );
};
