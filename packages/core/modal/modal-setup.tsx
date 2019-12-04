/* eslint-disable class-methods-use-this */
import React from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Icon } from '../icon';
import ModalHelper from './modal-helper';
import Modal from './modal';
import setDOMById from '../utils/set-dom';
import ModalsManagerClass from './modals-manager';

class ModalEntity extends ModalHelper {
  componentDidMount() {
    // console.log(this)
    this.setModal({
      ...this.props,
      isOpen: true,
    });
  }

  render() {
    const { children, onCloseModal } = this.props;
    return (
      <Modal
        {...this.state.modalSetting}
        {...this.props}
        onCloseModal={onCloseModal || this.closeModal.bind(this)}
      >
        {children}
      </Modal>
    );
  }
}

class ModalsManager extends ModalsManagerClass {
  render() {
    const {
      sectionsList, sectionsQueue, minSecQueue
    } = this.state;
    const sections = Array.isArray(sectionsQueue) && sectionsQueue.map((key) => {
      const currItem = sectionsList[key];
      if (!currItem) return null;
      const { id } = currItem;
      const animateType = Modal.animateTypeFilter(currItem);
      const sectionId = id;
      const currSectionIdx = sectionsQueue.indexOf(sectionId);
      return (
        <CSSTransition
          key={key}
          classNames={animateType}
          timeout={300}
        >
          <ModalEntity
            idx={currSectionIdx}
            sectionId={sectionId}
            selectWindow={this.selectWindow}
            minimizeWindow={this.minimizeWindow}
            animation={false}
            isOpen
            {...currItem}
            onCloseModal={() => this.closeWindow(sectionId)}
          />
        </CSSTransition>
      );
    });
    return (
      <div className="modals-render">
        <TransitionGroup
          component={null}
        >
          {sections}
        </TransitionGroup>
        <div className="min-container">
          {
            minSecQueue.map((minSectionId) => {
              const currItem = sectionsList[minSectionId];
              return (
                <div key={minSectionId}
                  className="min-item"
                >
                  <span className="title" onClick={(e) => this.selectWindow(minSectionId)}>{currItem.title}</span>
                  <Icon n="close" onClick={(e) => this.closeWindow(minSectionId)} />
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

let __entity: ModalsManager;
export const setupModal = () => {
  return new Promise<ModalsManager>((resolve, rejects) => {
    if (__entity) {
      resolve(__entity);
    } else {
      const modalsManagerContainer = setDOMById('__ModalsManager', 'modals-manager');
      ReactDOM.render(
        <ModalsManager
          ref={(e) => {
            if (!e) {
              rejects();
            } else {
              __entity = e;
              resolve(__entity);
            }
          }}
        />,
        modalsManagerContainer
      );
    }
  });
};
