import React from 'react';
import { RootWrapper } from '../components/root-wrapper';

export const wrapRootElement = ({ element }) => {
  return <RootWrapper>{element}</RootWrapper>;
};

export const onRenderBody = (
  { setPreBodyComponents, setPostBodyComponents },
) => {
  setPostBodyComponents([
    <link key="1" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.3.1/css/all.min.css" />,
    <link key="2" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/airbnb.css" />
  ]);
};
