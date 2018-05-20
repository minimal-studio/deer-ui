import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import {Tabs, Tab} from '../tabs';
import Loading from '../loading';
import TipPanel from '../tip-panel';

let defaultUrl = '/js/libs/arealist.simple.js';
let scriptSourceUrl = defaultUrl;

export default class CitySelector extends Component {
  constructor(props) {
    super(props);
    const defaultVal = {
      idx: -1,
      value: ''
    };
    const hasLoadedDepList = !!window.LocalList;
    this.state = {
      localList: window.LocalList || [],
      isShowPickPanel: false,
      selectedRegion: {
        idx: -1,
        value: '省'
      },
      selectedState: {
        idx: -1,
        value: '市'
      },
      selectedCity: {
        idx: -1,
        value: '区／县'
      },
      selectedBranch: {
        idx: -1,
        value: '支行'
      },
      branchListMapper: window.BANK_BRANCH_MAPPER ? window.BANK_BRANCH_MAPPER[window.__SelectedBankCode] : {},
      activeTab: 0,
      title: '请选择',
      loadingCity: !hasLoadedDepList,
      branchConfigLoading: true
    }
  }
  loadDecSource() {
    if(!scriptSourceUrl) return console.log('please call interface CitySelector.setCitySourceUrl("url")');
    const {__SelectedBankCode} = window;
    const self = this;
    if(!window.LocalList) {
      window.LoadScript({source: scriptSourceUrl, callback: (res) => {
        self.setState({
          localList: window.LocalList,
          loadingCity: false
        });
      }});
    }
    if(!__SelectedBankCode) {
      this.setState({
        branchConfigLoading: false
      })
      return console.log('没有设置 __SelectedBankCode');
    }
    if(!window.BANK_BRANCH_MAPPER || !window.BANK_BRANCH_MAPPER[__SelectedBankCode]) {
      window.LoadScript({source: '/bank/' + __SelectedBankCode + '.bank.branch.mapper.js', callback: (res) => {
        this.setState({
          branchListMapper: window.BANK_BRANCH_MAPPER[__SelectedBankCode] || {},
          branchConfigLoading: false
        })
      }});
    } else {
      this.setState({
        branchConfigLoading: false
      })
    }
  }
  changeTab(idx) {
    this.setState({
      activeTab: idx
    });
  }
  togglePickPanel(isShow) {
    if(isShow) this.loadDecSource();
    this.setState({
      isShowPickPanel: isShow
    });
  }
  selectRegion(options) {
    this.setState({
      selectedRegion: options,
      selectedState: {idx: -1, value: '市'},
      selectedCity: {idx: -1, value: '区／县'},
      activeTab: 1
    });
    // this.changeTab(1);
  }
  selectState(options) {
    this.setState({
      selectedState: options,
      selectedCity: {idx: -1, value: '区／县'},
      activeTab: 2
    });
    // this.changeTab(2);
  }
  selectCity(options) {
    this.setState({
      selectedCity: options,
      activeTab: 3,
    });
    // this.changeTab(3);
  }
  selectBranch(options) {
    this.setState({
      selectedBranch: options
    }, () => {
      this.onSubmit();
    });
  }
  onSubmit() {
    this.setValue();
    this.togglePickPanel(false);
    this.setState({activeTab: 0});
  }
  onCancel() {
    this.togglePickPanel(false);
  }
  setValue() {
    const {selectedRegion, selectedState, selectedCity, selectedBranch} = this.state;

    const cityInfo = {
     region: selectedRegion.value,
      state: selectedState.value,
      city: selectedCity.value,
      branch: selectedBranch.value
    };

    this.citySelected = cityInfo;
   $GH.CallFunc(this.props.onChange)(cityInfo);

    this.setState({
      title: `${cityInfo.region} - ${cityInfo.state} - ${cityInfo.city} - ${cityInfo.branch}`
    })
  }
  getTabDOM(options) {
    const {id, childList = [], action, activeValueInfo} = options;
    const {inputDesc = ''} = this.props;
    const {loadingCity, branchConfigLoading} = this.state;
    const inputRefName = 'search-deep-' + id;
    const {value, idx} = activeValueInfo;
    return (
      <Tab label={value}>
        <div>
          {id == 'branch' ? <TipPanel text={'注意：支行必须填写正确, 否则无法提现.'}/> : null}
          <div className="mb5 pb5">
            <input
              ref={inputRefName}
              type="text"
              placeholder={inputDesc}
              className="form-control input-sm"/>
            <span className="btn theme flat" onClick={e => {
                const currSearchVal = this.refs[inputRefName].value;
                if(!currSearchVal) return;
                action({idx: -1, value: currSearchVal});
              }}>使用该值</span>
          </div>
          <Loading loading={id == 'branch' ? branchConfigLoading : loadingCity}>
            <div className="selector-panel">
              {
                Array.isArray(childList) ? childList.map((item, _idx) => {
                  let isActive = idx == _idx;
                  let value = typeof item == 'string' ? item : item.name;
                  return (
                    <div key={_idx}
                      onClick={e => action({idx: _idx, value})}
                      className={'item' + (isActive ? ' active' : '')}>
                      {value}
                    </div>
                  )
                }) : ''
              }
            </div>
          </Loading>
        </div>
      </Tab>
    );
  }
  // getBranchVal() {
  //   const {
  //     selectedRegion, selectedState, selectedCity, branchListMapper
  //   } = this.state;
  //   let result = branchListMapper;
  //   [selectedRegion, selectedState, selectedCity].forEach(item => {
  //     if(result[item.value]) result = result[item.value];
  //   });
  //   return result;
  // }
  render() {
    const {
      localList, selectedRegion, selectedState, selectedCity, selectedBranch,
      isShowPickPanel, activeTab, title, loading, branchListMapper
    } = this.state;

    const currLocalList = localList[selectedRegion.idx];
    let stateList;
    let cityList;
    let branchList;
    if(currLocalList) {
      stateList = currLocalList.state;
    }
    if(stateList) {
      cityList = (stateList[selectedState.idx] || {}).city;
    }
    if(selectedCity.idx > -1) {
      // branchList = this.getBranchVal();
      branchList = branchListMapper && branchListMapper[selectedCity.value] ?branchListMapper[selectedCity.value]: [];
    }

    let panelDOM;

    switch (true) {
      case isShowPickPanel:
        panelDOM = window.__SelectedBankCode ? (
          <div className="pick-panel">
            <div className="panel-container">
              <Tabs activeTabIdx={activeTab} onChangeTab={this.changeTab.bind(this)}>
                {
                  this.getTabDOM({
                    id: 'region',
                    childList: localList,
                    activeValueInfo: selectedRegion,
                    action: this.selectRegion.bind(this),
                  })
                }
                {
                  this.getTabDOM({
                    id: 'state',
                    childList: stateList,
                    activeValueInfo: selectedState,
                    action: this.selectState.bind(this),
                  })
                }
                {
                  this.getTabDOM({
                    id: 'city',
                    childList: cityList,
                    activeValueInfo: selectedCity,
                    action: this.selectCity.bind(this),
                  })
                }
                {
                  this.getTabDOM({
                    id: 'branch',
                    childList: branchList,
                    activeValueInfo: selectedBranch,
                    action: this.selectBranch.bind(this),
                  })
                }
              </Tabs>
              <div className="text-center">
                <span className="btn flat red" onClick={e => this.onCancel()}>取消</span>
              </div>
            </div>
            <div className="section-mark"></div>
          </div>
        ) : (
          <div className="pick-panel">
            <div className="panel-container">
              <div className="p10">请先选择银行</div>
              <div className="text-center">
                <span className="btn flat red" onClick={e => this.onCancel()}>取消</span>
              </div>
            </div>
            <div className="section-mark"></div>
          </div>
        )
        break;
    }

    return (
      <div className={"city-selector" + (isShowPickPanel ? ' show' : '')}>
        <div onClick={e => this.togglePickPanel(true)} className="btn flat theme">{title}</div>
        {panelDOM}
      </div>
    )
  }
}
CitySelector.propTypes = {
  onChange: PropTypes.func,
  inputDesc: PropTypes.string
};
CitySelector.setCitySourceUrl = function(url) {
  scriptSourceUrl = url;
}
