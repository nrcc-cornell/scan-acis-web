import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import '../../styles/OutputSelect.css';

var app;

@inject("store") @observer
class OutputSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {
        return (
            <div className='output-select'>
            <div className='radio-div'>
            <form>
              <div className="radio">
                <label>
                  <input type="radio" value="chart" 
                        disabled={app.dataIsLoading}
                        checked={app.getOutputType === 'chart'}
                        onChange={app.setOutputType} />
                  Chart
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" value="table" 
                        disabled={app.dataIsLoading}
                        checked={app.getOutputType === 'table'}
                        onChange={app.setOutputType} />
                  Table
                </label>
              </div>
            </form>
            </div>
            </div>
        )
    }

};

export default OutputSelect;
