import React from 'react';
import { RootWrapper } from '../components/root-wrapper';
import { LoaderDOM, LoadedDOM } from '../utils/loader-script';

export const wrapRootElement = ({ element }) => {
  return <RootWrapper>{element}</RootWrapper>;
};

export const onRenderBody = (
  { setPreBodyComponents, setPostBodyComponents },
) => {
  setPreBodyComponents([
    <LoadedDOM key="1" />,
    <LoaderDOM key="2" />,
  ]);
  setPostBodyComponents([
    <link key="1" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.3.1/css/all.min.css" />,
    <link key="2" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/airbnb.css" />
  ]);
};
