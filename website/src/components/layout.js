import React from 'react';
import { LiveConfig } from 'react-ui-doc/components';
import styled, * as sc from 'styled-components';
import * as UICore from '@deer-ui/core';
import * as EnhanceUI from '@deer-ui/enhance-ui';
import * as UIUtils from '@deer-ui/core/utils';
import * as BaseFunc from '@mini-code/base-func';
import * as MockDataForTable from './mock-data/table';
import MockData from './mock-data/mock-data';
import FormOptions from './mock-data/form-options';

import './style.scss';

const loadSentry = () => {
  const script = document.createElement('script');
  script.src = 'https://browser.sentry-cdn.com/5.15.0/bundle.min.js';
  script.setAttribute('integrity', 'sha384-+ysfQckQvwCB5SppH41IScIz/Iynt2pePnJNMl+D7ZOzDJ+VYhQEuwB0pA60IDM0');
  script.setAttribute('crossorigin', 'anonymous');
  script.onload = () => {
    window.Sentry?.init({ dsn: 'https://b2148bb851ae4e3fbd0f625c5cc9fa0e@sentry.io/5171956' });
  };
  document.head.appendChild(script);
};

/**
 * 如果为开发环境，加载 core 的样式
 * 因为 react-ui-doc 已经加载了 core 的样式，无需重复加载
 */
if (process.env.NODE_ENV === 'development') {
  require('@deer-ui/core/style/default.scss');
}

export default function Layout({ children }) {
  React.useEffect(() => {
    loadSentry();
  }, []);
  return (
    <>
      <LiveConfig
        modules={{
          react: React,
          '@deer-ui/core': UICore,
          '@deer-ui/enhance-ui': EnhanceUI,
          '@deer-ui/core/utils': UIUtils,
          'mockdata-for-table': MockDataForTable,
          '@mini-code/base-func': BaseFunc,
          mockdata: MockData,
          formOptions: FormOptions,
          'styled-components': Object.assign(styled, sc),
        }}
      />
      {children}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/airbnb.css" />
    </>
  );
}
