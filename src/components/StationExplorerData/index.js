///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
//import Typography from '@material-ui/core/Typography';
//import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';

import StationExplorerClimateSummary from '../../components/StationExplorerClimateSummary';
import StationExplorerLatestConditions from '../../components/StationExplorerLatestConditions';

// Styles
//import '../../styles/StationExplorerData.css';

var app;

@inject('store') @observer
class StationExplorerData extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        //let loc = app.getLocation_explorer
        //let porEnd = (app.getLocation_explorer.edate && app.getLocation_explorer.edate.slice(0,4)==='9999') ? 'present' : app.getLocation_explorer.edate
        let variantClimate = (app.getDataView_explorer==='climate') ? 'contained' : 'outlined'
        let variantWeather = (app.getDataView_explorer==='weather') ? 'contained' : 'outlined'

        return (
            <div id="station_data">
                <div className="dataButtons">
                  <Button variant={variantWeather} color="primary" onClick={() => {app.setDataView_explorer('weather')}}>
                    Latest Conditions 
                  </Button>
                  <Button variant={variantClimate} color="primary" onClick={() => {app.setDataView_explorer('climate')}}>
                    Climate Summary
                  </Button>
                </div>
                { app.getDataView_explorer==='weather' && (<StationExplorerLatestConditions/>)}
                { app.getDataView_explorer==='climate' && (<StationExplorerClimateSummary/>)}
            </div>
        );
    }
}

export default withRouter(StationExplorerData);
