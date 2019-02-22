///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import { array } from 'prop-types'

import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/StationExplorerLegend.css';

@inject('store') @observer
class StationExplorerLegend extends Component {

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        return (
            <Control position="topright" className="control-top-right">
                <div className="explorer-map-legend">
                    <span className={"explorer-map-legend-color-box blue"}></span><span className="explorer-map-legend-label">Traditional SCAN</span>
                    <span className={"explorer-map-legend-color-box green"}></span><span className="explorer-map-legend-label">Tribal SCAN</span>
                </div>
            </Control>
        );
    }
}

export default StationExplorerLegend;
