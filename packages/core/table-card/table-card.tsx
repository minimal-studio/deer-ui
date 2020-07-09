import React from 'react';

import ColumnFilter, { ColumnFilterProps } from '../table/column-filter';
import { Grid, GridProps } from '../grid';
import NodataTip from '../table/nodata-tip';

export interface TableCardProps extends ColumnFilterProps {
  gridItemProps?: GridProps;
  gridContainerProps?: GridProps;
}

const defaultGridItemProps = {
  xl: 3,
  lg: 4,
  md: 6,
  sm: 12,
  xs: 12,
};

const defaultGridContainerProps = {
  space: 5
};

/**
 * 卡片式表格渲染模版
 *
 * @export
 * @class TableCard
 * @extends {ColumnFilter}
 */

export default class TableCard extends ColumnFilter<TableCardProps> {
  render() {
    const { gridItemProps = {}, gridContainerProps = {} } = this.props;
    const dataRows = this.getDataRows();
    const columns = this.getColumns();
    if (!Array.isArray(dataRows)) {
      console.error('dataRows 必须为 []');
      return null;
    }

    const hasData = dataRows.length > 0;

    return hasData ? (
      <Grid
        {...Object.assign({}, defaultGridContainerProps, gridContainerProps)}
        container
        className="table-card"
      >
        {
          dataRows.map((record, idx) => (
            <Grid
              {...Object.assign({}, defaultGridItemProps, gridItemProps)}
              key={idx}
            >
              <div className="item">
                {
                  columns.map((mapper, _idx) => {
                    if (!mapper) return null;
                    const { key } = mapper;
                    const currText = record[key];
                    const resultText = this.columnFilter(mapper, record, idx);
                    const title = this.titleFilter(mapper, _idx);
                    const tdKey = `${key}_${currText}`;
                    return (
                      <div key={tdKey}>
                        <span className="title">{title}</span>
                        <span className="content">{resultText}</span>
                      </div>
                    );
                  })
                }
              </div>
            </Grid>
          ))
        }
      </Grid>
    ) : (
      <NodataTip />
    );
  }
}
