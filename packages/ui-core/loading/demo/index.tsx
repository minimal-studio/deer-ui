import React, { useState } from 'react';
import { Loading } from '..';

export default () => {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ height: 300 }}>
      <span className="btn theme" onClick={e => setLoading(!loading)}>切换状态</span>
      <Loading loading={loading}>
        {
          () => {
            return (
              <div>Children</div>
            );
          }
        }
      </Loading>
    </div>
  );
};
