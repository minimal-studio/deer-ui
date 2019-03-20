import React from 'react';
import { Call } from 'basic-helper';
import PropTypes from 'prop-types';

import { UkeComponent, UkePureComponent } from '../uke-utils';
import DropdownWrapper from '../selector/dropdown-wrapper';
import Radio from '../selector/radio';
import { Icon } from '../icon';

export default class MapperFilter extends UkePureComponent {
  static propTypes = {
    config: PropTypes.shape({}),
    onChange: PropTypes.func,
  }
  state = {
    selectorCache: {}
  };
  changeVal = (emitVal) => {
    const { onChange } = this.props;
    this.setState(({ selectorCache }) => ({
      selectorCache: Object.assign({}, selectorCache, emitVal)
    }));
    Call(onChange, emitVal);
  }
  render() {
    const { config } = this.props;
    const { selectorCache } = this.state;
    const { defaultTitle, ref, onChange, ...other } = config;
    const valFromCache = selectorCache[ref];
    return (
      <div className={`selector ${valFromCache ? 'active' : ''}`}>
        {defaultTitle}
        <DropdownWrapper
          outside
          className="selector-group"
          menuWrapper={() => {
            return (
              <Icon n="filter" />
            );
          }}>
          {
            () => {
              return (
                <div className="layout col p10">
                  <span className="mb10" onClick={e => {
                    // selectorCache[ref] = null;
                    const emitVal = {
                      [ref]: undefined
                    };
                    this.changeVal(emitVal);
                  }}>
                    {this.gm('清除')}
                  </span>
                  <Radio
                    {...other}
                    column
                    defaultValue={valFromCache}
                    onChange={val => {
                      const emitVal = {
                        [ref]: val
                      };
                      this.changeVal(emitVal);
                    }} />
                </div>
              );
            }
          }
        </DropdownWrapper>
      </div>
    );
  }
}
