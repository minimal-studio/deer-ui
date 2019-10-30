import React, { useState } from 'react';

import { Tabs, Tab } from '..';
import tabsColl from '../tabs-demo';

const Test = () => (
  <div>
    <Tabs className="bg_default p20">
      <Tab label="Tab_1">
        <div className="p10">内容1</div>
      </Tab>
      <Tab label="Tab_2">
        <div className="p10">内容2</div>
      </Tab>
      <Tab label="Tab_3">
        <div className="p10">内容3</div>
      </Tab>
    </Tabs>
  </div>
);

const Test2 = () => {
  const [tabs, setTabs] = useState(tabsColl);
  return (
    <Tabs
      className="bg_default p20"
      closeable onClose={(idx) => {
        const nextTabs = [...tabs];
        nextTabs.splice(idx, 1);
        setTabs(nextTabs);
      }}>
      {
        tabs.map((tab) => {
          return (
            <Tab {...tab} key={tab.label} />
          );
        })
      }
    </Tabs>
  );
};

const TestClose = () => {
  const [tabs, setTabs] = useState(tabsColl);
  return (
    <Tabs
      className="bg_default p20"
      closeable onClose={(idx) => {
        const nextTabs = [...tabs];
        nextTabs.splice(idx, 1);
        setTabs(nextTabs);
      }}>
      {
        tabs.map((tab) => {
          return (
            <Tab {...tab} key={tab.label} />
          );
        })
      }
    </Tabs>
  );
};

const Content = () => (
  <Tabs inRow={true} className="bg_default p20">
    <Tab label="Tab_1">
      <div className="p10">内容1</div>
    </Tab>
    <Tab label="Tab_2">
      <div className="p10">内容2</div>
    </Tab>
    <Tab label="Tab_3">
      <div className="p10">内容3</div>
    </Tab>
  </Tabs>
);

const TestControl = () => {
  const [activeTabIdx, setIdx] = useState(0);
  return (
    <div>
      <div>
        <span className="btn theme" onClick={e => setIdx(2)}>
          切换到最后一个 Tab
        </span>
      </div>
      <Tabs
        activeTabIdx={activeTabIdx}
        className="bg_default p20"
        onChangeTab={(idx) => {
          setIdx(idx);
        }}>
        <Tab label="Tab_1">
          <div className="p10">内容1</div>
        </Tab>
        <Tab label="Tab_2">
          <div className="p10">内容2</div>
        </Tab>
        <Tab label="Tab_3">
          <div className="p10">内容3</div>
        </Tab>
      </Tabs>
    </div>
  );
};
