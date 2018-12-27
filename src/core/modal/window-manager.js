import createStore from 'unistore';
import { RemoveArrayItem } from 'basic-helper';

const DefaultWindowManagerState = {
  minSecQueue: [],
  sectionsQueue: [],
  sectionsList: {},
};

const windowManagerStore = createStore(DefaultWindowManagerState);

const windowManagerActions = store => ({
  closeAllWindow() {
    store.setState({
      ...DefaultWindowManagerState
    });
  },
  closeWindow({sectionsList, sectionsQueue}, sectionId) {
    if(!sectionId) return;
    let nextSectionList = sectionsList;
    let nextSectionQueue = RemoveArrayItem(sectionsQueue, sectionId);

    delete nextSectionList[sectionId];

    store.setState({
      sectionsList: nextSectionList,
      sectionsQueue: nextSectionQueue
    });
  },
  openWindow({sectionsList, sectionsQueue}, modalConfig) {
    let sectionId = modalConfig.id;
    let nextState = Object.assign({}, sectionsList);
    
    nextState[sectionId] = Object.assign({}, nextState[sectionId], modalConfig, {
      isMinimize: false
    });

    store.setState({
      sectionsList: nextState,
      sectionsQueue: [sectionId, ...sectionsQueue]
    });
  },
  selectWindow({sectionsQueue, sectionsList}, sectionId) {
    let nextSectionQueue = sectionsQueue;
    let nextSectionList = sectionsList;
    let selectedCodeIdx = nextSectionQueue.indexOf(sectionId);

    if(!nextSectionList[sectionId]) return;

    nextSectionList[sectionId] = Object.assign({}, nextSectionList[sectionId], {
      isMinimize: false
    });

    let selectedCode = nextSectionQueue.splice(selectedCodeIdx, 1);
    nextSectionQueue = selectedCode.concat(nextSectionQueue);

    store.setState({
      sectionsList: nextSectionList,
      sectionsQueue: nextSectionQueue
    });
  },
  minimizeWindow({minSecQueue, sectionsQueue, sectionsList}, sectionId) {
    let nextSectionQueue = [...sectionsQueue];
    let nextMinSecQueue = [...minSecQueue];
    let nextSectionList = sectionsList;

    let displayingWindows = [...nextSectionQueue];
    let miniArr = [sectionId].concat(nextMinSecQueue);

    nextSectionList[sectionId] = Object.assign({}, nextSectionList[sectionId], {
      isMinimize: true
    });

    miniArr.forEach(minItem => {
      let currIdx = displayingWindows.indexOf(minItem);
      if(currIdx !== -1) displayingWindows.splice(currIdx, 1);
    });

    if(displayingWindows.length !== 0) {
      this.selectWindow(displayingWindows[0]);
    }

    store.setState({
      sectionsList: nextSectionList,
      sectionsQueue: nextSectionQueue,
      minSecQueue: nextMinSecQueue
    });
  }
});

export {
  windowManagerActions,
  windowManagerStore,
  DefaultWindowManagerState
};
