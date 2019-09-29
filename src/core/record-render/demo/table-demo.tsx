import React, { useState } from 'react';
import { Table, DescHelper } from '..';
import { ShowModal } from '../../modal';
import MockData from '../../utils/mock-data';
import { records, columns, keyMapperFixed } from '../table-mock-data';
import { setLangTranslate, setUkeLang } from '../../config';

const Test1 = () => {
  const _keyMapper = [...columns];
  const _records = [...records];
  return (
    <div>
      <Table
        // columns={_keyMapper}
        columns={_keyMapper}
        rowKey={record => record.id}
        onChange={(emitVal, config) => {
          console.log(emitVal, config);
        }}
        records={_records} />
    </div>
  );
};

const Test2 = () => {
  const _keyMapper = [...columns];
  const _records = [...records];
  return (
    <div>
      <Table
        columns={_keyMapper}
        rowKey={record => record.id}
        needCount
        onChange={(emitVal, config) => {
          console.log(emitVal, config);
        }}
        records={_records} />
    </div>
  );
};

const Test3 = () => {
  const _keyMapper = [...columns];
  const _records = [...records];
  let table;

  return (
    <div>
      <Table
        columns={_keyMapper}
        clickToHighlight
        ref={(e) => { table = e; }}
        checkedOverlay={checkedItems => (
          <span className="btn theme mu10" onClick={e => table.clearCheckeds()}>
            清除所有的以选中项
          </span>
        )}
        rowKey={record => record.id}
        needCheck
        needCount
        onChange={(emitVal, config) => {
          console.log(emitVal, config);
        }}
        records={_records} />
    </div>
  );
};

const Test4 = () => {
  const [_keyMapper, setKeyMapper] = useState([...keyMapperFixed]);
  const [_records, setRecords] = useState([...records]);
  const [show, setShow] = useState(false);
  let table;

  return (
    <div>
      <div className="mb10">
        <span className="btn theme mr10" onClick={(e) => {
          const nextKeyMapper = [...columns];
          nextKeyMapper.splice(-1, 1);
          setKeyMapper(nextKeyMapper);
        }}>减少最后一个 columns</span>
        <span className="btn green mr10" onClick={(e) => {
          const nextKeyMapper = [...columns, {
            key: `len${columns.length}`
          }];
          setKeyMapper(nextKeyMapper);
        }}>增加一个 columns</span>
        <span className="btn red mr10" onClick={(e) => {
          const nextRecords = [...records, records[0]];
          setRecords(nextRecords);
        }}>增加一条记录</span>
        <span className="btn orange mr10" onClick={(e) => {
          const nextRecords = [...records].slice(0, records.length - 1);
          setRecords(nextRecords);
        }}>减少一条记录</span>
        <hr />
        <Table
          columns={_keyMapper}
          ref={(e) => { table = e; }}
          checkedOverlay={(
            <span className="btn theme mu10" onClick={e => table.clearCheckeds()}>
              清除所有的以选中项
            </span>
          )}
          rowKey={record => record.id}
          height={200}
          needCheck
          needCount
          onChange={(emitVal, config) => {
            console.log(emitVal, config);
          }}
          records={_records} />
      </div>
    </div>
  );
};

const Test5 = () => {
  const [_keyMapper, setKeyMapper] = useState([...keyMapperFixed]);
  const [_records, setRecords] = useState([...records]);
  const [show, setShow] = useState(false);
  let table;

  return (
    <div>
      <div className="mb10">
        <span className="btn theme mr10" onClick={(e) => {
          const nextKeyMapper = [...columns];
          nextKeyMapper.splice(-1, 1);
          setKeyMapper(nextKeyMapper);
        }}>减少最后一个 columns</span>
        <span className="btn green mr10" onClick={(e) => {
          const nextKeyMapper = [...columns, {
            key: `len${columns.length}`
          }];
          setKeyMapper(nextKeyMapper);
        }}>增加一个 columns</span>
        <span className="btn red mr10" onClick={(e) => {
          const nextRecords = [...records, records[0]];
          setRecords(nextRecords);
        }}>增加一条记录</span>
        <span className="btn orange mr10" onClick={(e) => {
          const nextRecords = [...records].slice(0, records.length - 1);
          setRecords(nextRecords);
        }}>减少一条记录</span>
        <hr />
        <Table
          columns={_keyMapper}
          ref={(e) => { table = e; }}
          checkedOverlay={(
            <span className="btn theme mu10" onClick={e => table.clearCheckeds()}>
              清除所有的以选中项
            </span>
          )}
          rowKey={record => record.id}
          height={200}
          needCheck
          needCount
          onChange={(emitVal, config) => {
            console.log(emitVal, config);
          }}
          records={_records} />
      </div>
    </div>
  );
};

const Test6 = () => {
  const [_keyMapper, setKeyMapper] = useState([...keyMapperFixed]);
  const [_records, setRecords] = useState([...records]);
  const [show, setShow] = useState(false);
  let table;

  return (
    <div>
      <div className="mb10">
        <span className="btn blue mr10" onClick={(e) => {
          const nextShow = !show;
          const nextRecords = nextShow ? [...records] : [];
          setShow(nextShow);
          setRecords(nextRecords);
        }}>{show ? '隐藏' : '显示'}表格</span>
      </div>
      <div style={!show ? { display: 'none' } : null}>
        <Table
          columns={_keyMapper}
          ref={(e) => { table = e; }}
          checkedOverlay={(
            <span className="btn theme mu10" onClick={e => table.clearCheckeds()}>
              清除所有的以选中项
            </span>
          )}
          rowKey={record => record.id}
          height={200}
          needCheck
          needCount
          fixedRightKeys={['status']}
          onChange={(emitVal, config) => {
            console.log(emitVal, config);
          }}
          records={_records} />
      </div>
    </div>
  );
};

const Test7 = () => {
  const _keyMapper = [{
    key: 'desc',
    title: '排序',
    filter: (_, item) => item.age,
    onSort: (mapper, isDesc) => {
      return !isDesc;
    }
  }, ...columns];
  const _records = [...records];
  let table;
  return (
    <div>
      <Table
        columns={_keyMapper}
        ref={(e) => { table = e; }}
        checkedOverlay={checkedItems => (
          <span className="btn theme mu10" onClick={e => table.clearCheckeds()}>
            清除所有的以选中项
          </span>
        )}
        rowKey={record => record.id}
        onChange={(emitVal, config) => {
          console.log(emitVal, config);
        }}
        records={_records} />
    </div>
  );
};

const Test8 = () => {
  const _keyMapper = [...columns];
  const _records = [...records];
  let table;
  return (
    <div>
      <Table
        columns={_keyMapper}
        ref={(e) => { table = e; }}
        checkedOverlay={checkedItems => (
          <span className="btn theme mu10" onClick={e => table.clearCheckeds()}>
            清除所有的以选中项
          </span>
        )}
        needInnerSort
        rowKey={record => record.id}
        onChange={(emitVal, config) => {
          console.log(emitVal, config);
        }}
        records={_records} />
    </div>
  );
};

const Test9 = () => {
  const _keyMapper = [...columns];
  const _records = [...records];
  const [lang, setLang] = useState('zh-CN');
  const langMapper = {
    'zh-CN': {
      property: '财产',
      cn: '中国',
      uk: '英国',
      正常: '正常'
    },
    'en-US': {
      property: 'property',
      正常: 'Normal'
    },
  };
  setLangTranslate(langMapper);
  return (
    <div>
      <span className="btn theme" onClick={(e) => {
        const nextLang = lang == 'zh-CN' ? 'en-US' : 'zh-CN';
        setUkeLang(nextLang);
        setLang(nextLang);
      }}>{lang}</span>
      <Table
        columns={_keyMapper}
        rowKey={record => record.id}
        needCount
        onChange={(emitVal, config) => {
          console.log(emitVal, config);
        }}
        records={_records} />
    </div>
  );
};
