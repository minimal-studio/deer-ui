import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class TableHeader extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.allCheck !== nextProps.allCheck;
  }
  render() {
    const {keyMapper, allCheck = false} = this.props;

    const tableHeader = (
      <table className="table fixed nomargin table-header">
        <thead>
          <tr>
            {
              keyMapper.map((item, idx) => {
                if(!item) return;
                let title = item.title || $UK.getKeyMap(item.key);
                if(item.key == 'checkbox') title = (
                  <input type="checkbox" checked={allCheck}
                    onChange={e =>$GH.CallFunc(this.props.onCheckAll)(e.target.checked)}/>
                );
                return (
                  <th style={{width: item.w || '10%'}} key={idx}>{title}</th>
                )
               })
             }
          </tr>
        </thead>
      </table>
    );

    return tableHeader;
  }
}
TableHeader.propTypes = {
  keyMapper: PropTypes.array.isRequired,
  allCheck: PropTypes.bool,
  onCheckAll: PropTypes.func,
  // conditions: PropTypes.object.isRequired,
  // onChangeCon: PropTypes.func.isRequired
};
