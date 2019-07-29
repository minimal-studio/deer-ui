import React from 'react';

export default [...Array(4)].map((_, idx) => ({
  label: `切换到内容${idx + 1}`,
  children: (
    <div className="p10" key={idx}>内容 {idx + 1}</div>
  )
}));
