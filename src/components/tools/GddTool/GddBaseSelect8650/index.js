///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Select from 'react-select';

// Styles
import '../../../../styles/GddBaseSelect8650.css';

var app;

@inject('store') @observer
class GddBaseSelect8650 extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
              <div className={(app.gddtool_getBase==='50') ? "gdd-base-select-8650" : "hide-gdd-base-select-8650"}>
                <form>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value="8650"
                          checked={app.gddtool_getIsMethod8650}
                          onChange={app.gddtool_setIsMethod8650} />
                      <span>use 86/50</span>
                    </label>
                  </div>
                </form>
              </div>
        );
    }
}

export default GddBaseSelect8650;
