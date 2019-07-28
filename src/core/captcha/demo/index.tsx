import React, { useState } from 'react';
import { Captcha } from '..';

export default () => {
  const [value, setVal] = useState();
  return (
    <div>
      <Captcha
        onError={e => console.log(e)}
        onChange={(e) => {
          console.log(e);
          setVal(e);
        }}
        onCaptchaLoad={e => console.log(e)}
        onBlur={e => console.log(e)}
        value={value}
        limit={4}/>
    </div>
  );
};
