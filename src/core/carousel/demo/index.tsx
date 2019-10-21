import React, { useState } from 'react';
import { Carousel } from '..';

export default () => {
  const [value, setVal] = useState();
  return (
    <div>
      <Carousel
        style={{
          width: '100%',
          height: 500
        }}
        carouselItems={[
          {
            imgUrl: '/website/static/images/c1.jpg',
            action: () => alert('点击了 img')
          },
          {
            imgUrl: '/website/static/images/c2.jpg',
            action: () => alert('点击了 img')
          },
          {
            element: (
              <div className="p20 t_white">
                <div>使用自定义的 React Components</div>
                <Button text="任意的组件" onClick={e => alert('点击了按钮')} />
              </div>
            )
          }
        ]}/>
    </div>
  );
};
