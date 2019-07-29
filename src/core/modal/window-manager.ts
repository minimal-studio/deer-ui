import createStore from 'unistore';
import { RemoveArrayItem } from 'basic-helper';

export interface WindowItemConfig {
  title: string;
  isOpen: boolean;
  children: any;
  id: string;
}

export interface WindowMultipleState {
  minSecQueue: string[];
  sectionsQueue: string[];
  sectionsList: {
    [sectionID: string]: WindowItemConfig;
  };
}

const DefaultWindowManagerState: WindowMultipleState = {
  minSecQueue: [],
  sectionsQueue: [],
  sectionsList: {},
};

const windowManagerStore = createStore(DefaultWindowManagerState);

const windowManagerActions = store => ({
  closeAllWindow: () => {
    store.setState({
      ...DefaultWindowManagerState
    });
  },
  closeWindow: ({ sectionsList, sectionsQueue, minSecQueue }, sectionId) => {
    if (!sectionId) return;
    const nextSectionList = sectionsList;
    const nextSectionQueue = RemoveArrayItem(sectionsQueue, sectionId);

    delete nextSectionList[sectionId];

    store.setState({
      sectionsList: nextSectionList,
      sectionsQueue: nextSectionQueue,
      minSecQueue: RemoveArrayItem(minSecQueue, sectionId)
    });
  },
  openWindow: ({ sectionsList, sectionsQueue, minSecQueue }, modalConfig) => {
    const sectionId = modalConfig.id;
    const nextListState = Object.assign({}, sectionsList);

    const hasCurrSection = !!nextListState[sectionId];

    nextListState[sectionId] = Object.assign({}, nextListState[sectionId], modalConfig, {
      isMinimize: false
    });

    store.setState({
      sectionsList: nextListState,
      sectionsQueue: hasCurrSection ? sectionsQueue : [sectionId, ...sectionsQueue],
      minSecQueue: RemoveArrayItem(minSecQueue, sectionId)
    });
  },
  selectWindow: ({ sectionsQueue, sectionsList, minSecQueue }, sectionId) => {
    if (!sectionId) return;

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

    store.setState({
      sectionsList: nextSectionList,
      sectionsQueue: nextSectionQueue,
      minSecQueue: nextMinSecQueue
    });
  },
  minimizeWindow: ({ minSecQueue, sectionsQueue, sectionsList }, sectionId) => {
    if (!sectionId) return;
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

    store.setState({
      sectionsList: nextSectionList,
      sectionsQueue: nextSectionQueue,
      minSecQueue: miniArr
    });
  }
});

export {
  windowManagerActions,
  windowManagerStore,
  DefaultWindowManagerState
};
