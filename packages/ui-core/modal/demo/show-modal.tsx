/**
 * 用于测试组件的 props 是否设置正确
 */
import React from 'react';
import {
  ShowModal, Modal, CloseModal, CloseAllModal
} from '..';
import { DropdownMenu, Pop } from '../..';

const Test1 = () => {
  return (
    <div>
      <span
        className="btn theme mr10"
        onClick={e => ShowModal({
          draggable: false,
          title: '默认的 Modal',
          id: 'ShowModal',
          onClose: () => {
            console.log('ShowModal');
          },
          children: <div
            style={{ height: 200, overflow: 'auto' }} className="p10 relative">
          内容
            <div style={{ height: 300 }}>
            </div>
            <DropdownMenu
              values={{
                a: '123',
                b: '456',
              }} />
            <div onClick={(event) => {
              Pop.show({
                elem: event.target as HTMLElement,
                props: {
                  showCloseBtn: false,
                  position: 'top',
                  type: 'red'
                },
                children: (
                  <div className="p10">
                  任意内容任意内容任意内容任意内容<br />
                  任意内容任意内容任意内容任意内容<br />
                  任意内容任意内容任意内容任意内容<br />
                  任意内容任意内容任意内容任意内容<br />
                  </div>
                )
              });
            }}>浮动</div>
          </div>
        })}>
      默认的 Modal
      </span>

      <span
        className="btn orange mr10"
        onClick={e => ShowModal({
          title: '有操作按钮的 Modal',
          showFuncBtn: true,
          children: <div className="p20">任意的内容</div>
        })}>
      有操作按钮的 Modal
      </span>

      <span
        className="btn purple mr10"
        onClick={e => ShowModal({
          type: 'confirm',
          title: '确认框',
          confirmText: '是否确定',
          onConfirm: (isSure) => {
            alert(`确定？${isSure}`);
          }
        })}>
      确认框
      </span>
    </div>
  );
};

const Test2 = () => {
  return (
    <div>
      <span
        className="btn theme mr10"
        onClick={e => ShowModal({
          draggable: true,
          title: '按住 header 可拖动的 Modal',
          children: <div className="p15">任意的内容</div>
        })}>
        多个可拖动的 Modal
      </span>

      <span
        className="btn red mr10"
        onClick={e => CloseAllModal()}>
        关闭所有 Modal
      </span>
    </div>
  );
};

const Test3 = () => {
  return (
    <div>
      <span
        className="btn blue mr10"
        onClick={e => ShowModal({
          title: '有操作按钮的 Modal',
          type: 'side',
          position: 'right',
          children: <div className="p20">任意的内容</div>
        })}>
        右边弹出
      </span>
      <span
        className="btn green mr10"
        onClick={e => ShowModal({
          title: '有操作按钮的 Modal',
          type: 'side',
          position: 'left',
          children: <div className="p20">任意的内容</div>
        })}>
        左边弹出
      </span>
      <span
        className="btn red mr10"
        onClick={e => ShowModal({
          title: '有操作按钮的 Modal',
          type: 'side',
          position: 'top',
          children: <div className="p20">任意的内容</div>
        })}>
        上边弹出
      </span>
      <span
        className="btn orange mr10"
        onClick={e => ShowModal({
          title: '有操作按钮的 Modal',
          type: 'side',
          position: 'bottom',
          children: <div className="p20">任意的内容</div>
        })}>
        下边弹出
      </span>
    </div>
  );
};

const Test4 = () => {
  return (
    <div>
      <span
        className="btn blue mr10"
        onClick={e => ShowModal({
          title: '自定义 Modal 模版',
          template: (props) => {
            console.log(props);
            return (
              <div onClick={() => { props.onCloseModal(); }} style={{
                position: 'fixed',
                top: 0,
                right: 0,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                zIndex: 999,
                height: 400,
                width: 500,
                backgroundColor: '#FFF'
              }}>
            自定义的 Modal 模版，点击关闭
              </div>
            );
          }
        })}>
        自定义 Modal 模版
      </span>
    </div>
  );
};
