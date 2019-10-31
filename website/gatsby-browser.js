import React from 'react';
import { RootWrapper } from '../components/root-wrapper';

export const wrapRootElement = ({ element }) => {
  return <RootWrapper>{element}</RootWrapper>;
};
