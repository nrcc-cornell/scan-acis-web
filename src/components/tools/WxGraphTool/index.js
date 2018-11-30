///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';

// Components
import TimeFrameButtonGroup from './TimeFrameButtonGroup'
//import ExtremeSwitch from './ExtremeSwitch'
import VarPicker from './VarPicker'
import WxCharts from './WxCharts'

// Styles
import '../../../styles/WxGraphTool.css';

var app;

@inject('store') @observer
class WxGraphTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.wxgraph_downloadData()
    }

    render() {

        let display;
        if (app.getOutputType==='chart') { display = <WxCharts /> }
        //if (app.getOutputType==='table') { display = <WxTables /> }

        return (
            <div className='wx-graph-tool'>
                <VarPicker />
                <div className='wxgraph-display'>
                  <TimeFrameButtonGroup/>
                  <LoadingOverlay
                    active={app.wxgraph_dataIsLoading}
                    spinner
                    background={'rgba(255,255,255,1.0)'}
                    color={'rgba(34,139,34,1.0)'}
                    spinnerSize={'10vw'}
                    >
                      {display}
                  </LoadingOverlay>
                </div>
            </div>
        );
    }
}

export default WxGraphTool;
