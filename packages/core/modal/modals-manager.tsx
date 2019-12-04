import React from "react";
import { RemoveArrayItem } from "@mini-code/base-func";
import { Children } from "../utils";

export interface ModalChildrenFuncParams {
  /** 关闭此窗口 */
  close: () => void;
}

export interface ModalItemConfig {
  title: string;
  isOpen: boolean;
  children: Children | ((params: ModalChildrenFuncParams) => Children);
  id: string;
}
export interface ModalsManagerState {
  minSecQueue: string[];
  sectionsQueue: string[];
  sectionsList: {
    [sectionID: string]: ModalItemConfig;
  };
}
const DefaultWindowManagerState: ModalsManagerState = {
  minSecQueue: [],
  sectionsQueue: [],
  sectionsList: {},
};

export default class ModalsManager extends React.PureComponent<{}, ModalsManagerState> {
  state = DefaultWindowManagerState

  closeAllWindow = () => {
    this.setState({
      ...DefaultWindowManagerState
    });
  }

  closeWindow = (sectionId) => {
    const { sectionsList, sectionsQueue, minSecQueue } = this.state;
    if (!sectionId) return;
    const nextSectionList = sectionsList;
    const nextSectionQueue = RemoveArrayItem(sectionsQueue, sectionId);

    delete nextSectionList[sectionId];

    this.setState({
      sectionsList: nextSectionList,
      sectionsQueue: nextSectionQueue,
      minSecQueue: RemoveArrayItem(minSecQueue, sectionId)
    });
  }

  openWindow = (modalConfig) => {
    const { sectionsList, sectionsQueue, minSecQueue } = this.state;
    const sectionId = modalConfig.id;
    const nextListState = Object.assign({}, sectionsList);

    const hasCurrSection = !!nextListState[sectionId];

    nextListState[sectionId] = Object.assign({}, nextListState[sectionId], modalConfig, {
      isMinimize: false
    });

    this.setState({
      sectionsList: nextListState,
      sectionsQueue: hasCurrSection ? sectionsQueue : [sectionId, ...sectionsQueue],
      minSecQueue: RemoveArrayItem(minSecQueue, sectionId)
    });
  }

  selectWindow = (sectionId) => {
    if (!sectionId) return;
    const { sectionsList, sectionsQueue, minSecQueue } = this.state;

    let nextSectionQueue = [...sectionsQueue];
    const nextSectionList = sectionsList;
    const selectedCodeIdx = nextSectionQueue.indexOf(sectionId);
    const nextMinSecQueue = RemoveArrayItem(minSecQueue, sectionId);

    if (!nextSectionList[sectionId]) return;

    nextSectionList[sectionId] = Object.assign({}, nextSectionList[sectionId], {
      isMinimize: false
    });

    nextSectionQueue.splice(selectedCodeIdx, 1);
    nextSectionQueue = [sectionId].concat(nextSectionQueue);

    this.setState({
      sectionsList: nextSectionList,
      sectionsQueue: nextSectionQueue,
      minSecQueue: nextMinSecQueue
    });
  }

  minimizeWindow = (sectionId) => {
    if (!sectionId) return;
    const { sectionsList, sectionsQueue, minSecQueue } = this.state;

    let nextSectionQueue = [...sectionsQueue];
    const nextMinSecQueue = [...minSecQueue];
    const nextSectionList = Object.assign({}, sectionsList);

    const displayingQueue = [...nextSectionQueue];
    let miniArr = [sectionId].concat(nextMinSecQueue);
    miniArr = miniArr.deduplication();

    nextSectionList[sectionId] = Object.assign({}, nextSectionList[sectionId], {
      isMinimize: true,
    });

    miniArr.forEach((minItem) => {
      const currIdx = displayingQueue.indexOf(minItem);
      if (currIdx !== -1) displayingQueue.splice(currIdx, 1);
    });

    // nextSectionQueue = displayingQueue;

    if (displayingQueue.length !== 0) {
      // this.selectWindow(displayingQueue[0]);
      // nextSectionList =
    }
    nextSectionQueue = RemoveArrayItem(nextSectionQueue, sectionId).concat(sectionId);

    this.setState({
      sectionsList: nextSectionList,
      sectionsQueue: nextSectionQueue,
      minSecQueue: miniArr
    });
  }
}
