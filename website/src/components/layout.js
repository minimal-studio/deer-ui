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

export default function Layout({ children }) {
  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/airbnb.css" />
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
    </>
  );
}
