import '../style/default.scss';

export default ({ children }) => {
  window.__removeLoading();
  return children;
};