import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class DropdownMenu extends Component {
  constructor(props) {
    super(props);

    const {value, defaultValue, isMultiple} = props;

    // 如果是多选模式，value, defaultValue 必须为array，否则value, defaultValue必须为string

    this.isControl = props.hasOwnProperty('value');

    // 受控模式, 详情请查看 react control form
    this.state = {
      selectedValue: defaultValue,
      isShow: false,
      searchValue: ''
    }

    // value 结构: ['values.value']
    this.value = value || defaultValue;
  }
  shouldUpdateComponent(nextState, nextProps) {
    // 如果是受控模式，必须是外部value改变才作出渲染
    const isChange = this.isControl ? JSON.stringify(this.props) !== JSON.stringify(nextProps) : JSON.stringify(this.state) !== JSON.stringify(nextState);
    return isChange || this.state.isShow !== nextState.isShow;
  }
  changeValue(item) {
    const {isMultiple} = this.props;
    const selectedValue = this.valueFilter();
    const {value, text} = item;

    let isShow = !isMultiple ? false : true;
    let nextValue;
    if(isMultiple) {
      nextValue = selectedValue || [];
      if(nextValue.indexOf(value) > -1) {
        nextValue = $GH.RemoveArrayItem(nextValue, value);
      } else {
        nextValue.push(value);
      }
    } else {
      nextValue = value == selectedValue ? undefined : value;
    }

    this.setState({
      selectedValue: nextValue,
      isShow
    });

    this.changeEvent(nextValue);
  }
  selectGroup(groupValues, isSelect) {
    const {isMultiple} = this.props;
    if(!isMultiple) return;
    const selectedValue = this.valueFilter();

    let nextValues = [...selectedValue || []];

    if(isSelect) {
      nextValues = [...nextValues, ...groupValues].deduplication();
    } else {
      nextValues = nextValues.filter(item => {
        return groupValues.indexOf(item) == -1;
      });
    }


    if(!this.isControl) {
      this.setState({
        selectedValue: nextValues
      });
    }

    this.changeEvent(nextValues);
  }
  changeEvent(nextValue) {
    const {isNum, isMultiple} = this.props;
    if(isNum) {
      if(isMultiple) {
        nextValue.forEach((_, idx) => {
          nextValue[idx] = +nextValue[idx];
        });
      } else {
        nextValue = +nextValue;
      }
    }
    this.value = nextValue;
   $GH.CallFunc(this.props.onChange)(this.value);
  }
  showSubMenu() {
    let self = this;
    let {clickHideBg} = this.refs;
    this.setState({
      isShow: true
    }, () => {
      this._input && this._input.focus();
      this._list && this._list.scrollTo(0, 0);
    });
    function handleDocClick() {
      self.hideSubMenu();
      clickHideBg.removeEventListener('click', handleDocClick, false);
    }
    clickHideBg.addEventListener('click', handleDocClick, false);
  }
  hideSubMenu() {
    this.setState({
      isShow: false
    });
  }
  getMenuItem(itemObj, key) {
    // const {selectedValue} = this.state;
    let {searchValue} = this.state;
    searchValue = searchValue.trim()
    const {isMultiple} = this.props;
    const selectedValue = this.valueFilter();
    const {text, value} = itemObj;

    const isActive = !isMultiple ? selectedValue == value : selectedValue.indexOf(value) > -1;
    let renderable = !searchValue ? true : text.indexOf(searchValue) != -1;
    // if(!!searchValue)
    return renderable ? (
      <div
        className={"menu-item" + (isActive ? ' active' : '')}
        onClick={e => this.changeValue({value, text})} key={key}>
        {text}
      </div>
    ) : null;
  }
  checkGroupItemsIsInclude(valuesArr) {
    const selectedValue = this.valueFilter();
    let isAllSelected = false;
    for (var i = 0; i < valuesArr.length; i++) {
      if(selectedValue.indexOf(valuesArr[i]) == -1) break;
      isAllSelected = true;
    }
    return isAllSelected;
  }
  getMenuItemDOM(topValues) {
    /*
     * topValues 结构说明
     * {
     *   value: string || object
     * }
     */
    const {isMultiple} = this.props;

    return (
      <div className="items-group">
        <div className="action-btn-group">
          <div className="action-btn" onClick={e => {
            this.changeEvent(isMultiple ? [] : '');
          }}>取消已选项</div>
        </div>
        {
          Object.keys(topValues).map((gateroy, idx) => {
            let currItem = topValues[gateroy];
            let {values, title} = currItem;
            switch (true) {
              case !!values:
                let groupValues = Object.keys(values);
                let isActiveGroup = this.checkGroupItemsIsInclude(groupValues);
                return (
                  <div className={"group" + (isActiveGroup ? ' active' : '')} key={idx}>
                    <div className="cateroy-title"
                      onClick={e => this.selectGroup(groupValues, !isActiveGroup)}>
                      {title}
                      <span className="flex"></span>
                      <i className={$UK.getIcon('check', 'check-icon')}></i>
                    </div>
                    {
                      groupValues.map((value, _idx) => {
                        var objWrap = {
                          text: values[value],
                          value: value
                        }
                        return this.getMenuItem(objWrap, idx + '-' + _idx);
                      })
                    }
                  </div>
                )
              case !values:
                var objWrap = {
                  text: currItem,
                  value: gateroy
                }
                return this.getMenuItem(objWrap, idx);
            }
          })
        }
      </div>
    );
  }
  valueFilter() {
    return this.isControl ? (this.props.value || '') : this.state.selectedValue;
  }
  getActiveTitle() {
    const {values, value, isMultiple} = this.props;
    if(!values) return;
    const selectedValue = this.valueFilter();

    if(isMultiple) return selectedValue.length + '项已选择';

    return values[selectedValue] || '全选';
  }
  getValuesLength() {
    const {values} = this.props;
    return Array.isArray(values) ? values.length : Object.keys(values).length;
  }
  onSearch(val) {
    this.setState({
      searchValue: val
    })
  }
  render() {
    const {
      style = {}, className = '', values = [],
      inRow = false,
    } = this.props;
    const {isShow, searchValue} = this.state;
    let listStyle = {
      height: isShow ? (32 * (this.getValuesLength())) + 76 : 0
    };

    return (
      <div
        className={
          "v-dropdown-menu" +
          (className ? ' ' + className : '') +
          (isShow ? ' show' : '') +
          (inRow ? ' in-row' : '')
        }
        style={style}>
        <div className="active-item" onClick={e => this.showSubMenu()}>
          <span className="">{
              this.getActiveTitle()
            }</span>
        </div>
        <div className="menu-list" ref={c => this._list = c} style={listStyle}>
          <input
            placeholder="搜索试试"
            className="form-control input-sm"
            type="text"
            ref={c => {this._input = c}}
            onChange={e => this.onSearch(e.target.value)} value={searchValue}/>
            {
              this.getMenuItemDOM(values)
            }
        </div>
        <div className={"section-mark" + (isShow ? '' : ' hide')} style={{position: 'fixed'}} ref="clickHideBg"></div>
      </div>
    )
  }
}
DropdownMenu.propTypes = {
  defaultValue: PropTypes.any,
  className: PropTypes.string,
  values: PropTypes.any,
  value: PropTypes.any,
  isNum: PropTypes.bool,
  inRow: PropTypes.bool,
  isMultiple: PropTypes.bool,
  style: PropTypes.object,
  onChange: PropTypes.func
};
