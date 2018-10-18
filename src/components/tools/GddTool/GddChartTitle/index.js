///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { inject, observer} from 'mobx-react';

//Components

// Styles
import '../../../../styles/GddChartTitle.css';

var app;

@inject('store') @observer
class GddChartTitle extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let loc = app.getLocation
        let base_label = (app.gddtool_getBase==='50' && app.gddtool_getIsMethod8650) ? "86/50 method" : "base "+app.gddtool_getBase+"°F"

        return (
            <div className="gdd-chart-title">
                <span>{'Accumulated GDD ('+base_label+') since '+app.getPlantingDate.format("YYYY-MM-DD")+''}</span>
                <br/>
                <span>{'@ '+loc.name+', '+loc.state}</span>
            </div>
        );

    }
}

export default GddChartTitle;

