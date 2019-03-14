///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import { array } from 'prop-types'

import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/StationPickerLegend.css';

@inject('store') @observer
class StationPickerLegend extends Component {

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        return (
            <Control position="topright" className="control-top-right">
                <div className="picker-map-legend">
                    <span className={"picker-map-legend-color-box blue"}></span><span className="picker-map-legend-label">SCAN</span>
                    <span className={"picker-map-legend-color-box red"}></span><span className="picker-map-legend-label">Tribal SCAN</span>
                </div>
            </Control>
        );
    }
}

export default StationPickerLegend;
