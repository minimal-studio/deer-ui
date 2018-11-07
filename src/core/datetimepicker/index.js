import DatetimePicker from './datetimepicker';
import DateShortcut from './date-shortcut';

import Rename from '../rename-filter';

const DatepickerHelper = Rename(DateShortcut, 'DatepickerHelper', 'CardTable');

export {
  DatepickerHelper, DatetimePicker, DateShortcut
};
