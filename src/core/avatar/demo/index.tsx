import React, { useState } from 'react';
import { Avatar } from '..';

export default () => {
  const defaultAvatarSrc = "https://www.jiuwa.net/uploads/image/20170506/20170506084900_43824.jpg";
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatarSrc);
  return (
    <div>
      <Avatar
        size={100}
        onChangeAvatar={(e) => {
          { /* alert('你好') */ }
          console.log(e);
        }}
        tip={10}
        changeAvatarable
        text="A" />
      <hr />
      <Avatar
        size={30}
        text="A" />
      <hr />
      <Avatar
        size={100}
        onChangeAvatar={(res) => {
          console.log(res);
          setAvatarSrc(res);
        }}
        changeAvatarable
        position="top"
        faceOptions={[
          'https://tu.jiuwa.net/bg/992.jpg',
          'https://is2-ssl.mzstatic.com/image/thumb/Purple1/v4/b4/87/68/b487686b-27ec-9bb2-4fff-0c924c426a01/mzl.osfqhmvz.jpg/246x0w.jpg',
          'https://www.jiuwa.net/uploads/image/20170506/20170506084900_43824.jpg',
        ]}
        src={avatarSrc} />
    </div>
  );
};
