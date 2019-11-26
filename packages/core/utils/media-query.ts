export const screenxswidth = '576px';
export const screensmwidth = '768px';
export const screenlgwidth = '992px';
export const screenxlwidth = '1200px';

export const queryIsMobile = () => {
  return !window.matchMedia(`(min-width: ${screenxswidth})`).matches;
};
