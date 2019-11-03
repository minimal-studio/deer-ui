import Rename from '../utils/rename';

import { InputNumber } from './input-number';

const InputVerify = Rename(InputNumber, 'InputVerify', 'InputNumber');

export {
  InputNumber,
  InputVerify
};
