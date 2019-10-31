import React from 'react';
import { Playground, Props } from 'docz';

function E() {
  return (
    <Playground>
      {
        () => {
          const _keyMapper = [...columns];
          const _records = [...records];
          let table;

          return (
            <div>
              <Table
                columns={_keyMapper}
                clickToHighlight
                ref={(e) => table = e}
                checkedOverlay={(checkedItems) => (
                  <span className="btn theme mu10" onClick={(e) => table.clearCheckeds()}>
                清除所有的以选中项
                  </span>
                )}
                rowKey={(record) => record.id}
                needCheck
                needCount
                onChange={(emitVal, config) => {
                  console.log(emitVal, config);
                }}
                records={_records} />
            </div>
          );
        }
      }
    </Playground>
  );
}
