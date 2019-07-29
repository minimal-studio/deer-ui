import InputNumber from './input-number';
import Input from './input';
import InputSelector from './input-selector';

import Rename from '../rename-filter';

const InputVerify = Rename(InputNumber, 'InputNumber', 'InputVerify');

export {
  InputVerify,
  InputNumber, Input, InputSelector
};
