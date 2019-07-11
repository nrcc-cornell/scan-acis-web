///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import PlantingDatePicker from './PlantingDatePicker'
import GddBaseSelect from './GddBaseSelect'
//import GddBaseSelect8650 from './GddBaseSelect8650'
//import GddChartTitle from './GddChartTitle'
import GddChart from './GddChart'
import GddTable from './GddTable'
import LoadingOverlay from 'react-loading-overlay';

// Styles
import '../../../styles/GddTool.css';

var app;

@inject('store') @observer
class GddTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('gddtool')
        if (!app.getLocations || !app.getLocation) {
            // get all stations, set selected station, and download data for selected tool
            app.downloadStationInfo()
        } else {
            // stations are already set, just download data for selected tool
            app.gddtool_downloadData()
        }
    }

    render() {

        let display;
        if (app.getOutputType==='chart') { display = <GddChart /> }
        if (app.getOutputType==='table') { display = <GddTable /> }

        return (
            <div className="gdd-tool">
                <div className="gdd-ui">
                    <PlantingDatePicker />
                    <GddBaseSelect />
                </div>
                <LoadingOverlay
                    active={app.gddtool_dataIsLoading}
                    spinner
                    background={'rgba(255,255,255,1.0)'}
                    color={'rgba(34,139,34,1.0)'}
                    spinnerSize={'10vw'}
                  >
                    {display}
                </LoadingOverlay>
            </div>
        );
    }
}

export default GddTool;

