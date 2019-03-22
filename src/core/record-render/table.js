import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class Table extends Component {
  static propTypes = {
    className: PropTypes.string
  }
  static defaultProps = {
    className: "table nomargin table-body"
  }
  state = {}
  render() {
    const { className } = this.props;
    return (
      <table className={className}>
        <tbody>
          {
            records.map((record, idx) => {
              if(!record) return;
              const { _highlight } = record;
              let key = this.getRowKey(record, idx);
              return (
                <tr
                  key={key}
                  className={_highlight}>
                  {this.renderCell(record, idx, needCount)}
                </tr>
              );
            })
          }
        </tbody>
        <tfoot>
          {
            needCount && (
              <tr className="theme statistics">
                {/* {this.getStatisticDOM(this.statistics)} */}
                {
                  keyMapper.map((keyMap, idx) => {
                    const { key } = keyMap;
                    const currItem = this.statistics[key];
                    return (
                      <td key={key}>
                        {currItem ? currItem.toLocaleString('en-US') : '-'}
                      </td>
                    );
                  })
                }
              </tr>
            )
          }
        </tfoot>
      </table>
    )
  }
}