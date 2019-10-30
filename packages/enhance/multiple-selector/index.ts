import Multiple from './multiple-selector';
import Rename from '../rename-filter';

const MultipleHelper = Rename(Multiple, 'MultipleHelper', 'Multiple');

export {
  MultipleHelper, Multiple
};