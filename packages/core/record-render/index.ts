import Table from './table-body';
import CardTable from './card-table';
import MapperFilter from './mapper-filter';
import DescHelper from './desc-helper';

import Rename from '../rename-filter';

const RecordItemsHelper = Rename(CardTable, 'RecordItemsHelper', 'CardTable');
const TableBody = Rename(Table, 'TableBody', 'Table');

export {
  MapperFilter, TableBody, Table, RecordItemsHelper, CardTable, DescHelper
};
