import React, { useState } from 'react';
import { DatetimePicker } from '..';

export default () => {
  const [date, setDate] = useState([]);
  return (
    <div>
      <div className="layout a-i-c">
        <DatetimePicker
          onChange={(val) => {
            setDate(val);
          }} />
        {date.toString()}
      </div>
      <div className="layout a-i-c">
        <DatetimePicker
          outputAsString={true}
          onChange={(val) => {
            setDate(val);
          }} />
        {date.toString()}
      </div>
      <div className="layout a-i-c">
        <DatetimePicker
          outputAsString={true}
          needTime={false}
          onChange={(val) => {
            setDate(val);
          }} />
        {date.toString()}
      </div>
      <div className="layout a-i-c">
        <DatetimePicker
          mode="range"
          onChange={(val) => {
            setDate(val);
          }} />
        {date.toString()}
      </div>
      <div className="layout a-i-c">
        <DatetimePicker
          needTime={false}
          outputAsString
          mode="range"
          onChange={(val) => {
            setDate(val);
          }} />
        {date.toString()}
      </div>
    </div>
  );
};
