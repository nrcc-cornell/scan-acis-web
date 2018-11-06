///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Select from 'react-select';

// Styles
import '../../../../styles/GddBaseSelect.css';

// selectable values: 32 - 50 degrees F
const selectValues = Array.from(new Array(19), (x,i) => i + 32)

var disabled
var selectOptions = []
for(var idx=0; idx<selectValues.length; idx++){
    disabled = false
    selectOptions.push({ value: selectValues[idx].toString(), label: selectValues[idx].toString()+'°F', clearableValue: false, disabled: disabled })
}

var app;

@inject('store') @observer
class GddBaseSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="gdd-base-select">
                <div className='gdd-base-select-label'>
                  <label><b>GDD Base</b></label>
                </div>
                <div className='gdd-base-select-menu'>
                    <Select
                        name="gdd_base"
                        className="gdd-base-dropdown"
                        placeholder={app.gddtool_getBase+'°F'}
                        value={app.gddtool_getBase}
                        clearable={false}
                        options={selectOptions}
                        onChange={app.gddtool_setBase}
                    />

              <div className={(app.gddtool_getBase==='50') ? "gdd-base-select-8650" : "hide-gdd-base-select-8650"}>
                <form>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value="8650"
                          disabled
                          checked={app.gddtool_getIsMethod8650}
                          onChange={app.gddtool_setIsMethod8650} />
                      <span>use 86/50</span>
                    </label>
                  </div>
                </form>
              </div>

                </div>

            </div>
        );
    }
}

export default GddBaseSelect;
