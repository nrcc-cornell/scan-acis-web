///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import PlantingDatePicker from './PlantingDatePicker'
import GddBaseSelect from './GddBaseSelect'
//import GddBaseSelect8650 from './GddBaseSelect8650'
import GddChartTitle from './GddChartTitle'
import GddChart from './GddChart'
import LoadingOverlay from 'react-loading-overlay';

// Styles
import '../../../styles/GddTool.css';

var app;

@inject('store') @observer
class GddTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.gddtool_downloadData()
    }

    render() {

        return (
            <div className="gdd-tool">
                <div className="gdd-ui">
                    <PlantingDatePicker />
                    <GddBaseSelect />
                </div>
                <GddChartTitle />
                <LoadingOverlay
                    active={app.gddtool_dataIsLoading}
                    spinner
                    background={'rgba(200,200,200,0.0)'}
                    color={'rgba(34,139,34,1.0)'}
                    spinnerSize={'10vw'}
                  >
                    <GddChart />
                </LoadingOverlay>
            </div>
        );
    }
}

export default GddTool;

