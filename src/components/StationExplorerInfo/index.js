///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import Typography from '@material-ui/core/Typography';
//import Grid from "@material-ui/core/Grid";
//import Button from '@material-ui/core/Button';

import StationExplorerSelect from '../../components/StationExplorerSelect';

// Styles
//import '../../styles/StationExplorerInfo.css';

var app;

@inject('store') @observer
class StationExplorerInfo extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let loc = app.getLocation_explorer;
        let porEnd = (app.getLocation_explorer.edate && app.getLocation_explorer.edate.slice(0,4)==='9999') ? 'present' : app.getLocation_explorer.edate;
        let sid_and_network = app.getLocation_explorer.sid;
        let sid = sid_and_network.split(" ")[0];
        let pedonURL = "https://wcc.sc.egov.usda.gov/nwcc/pedon?sitenum="+sid

        return (
            <div id="station_info">
                <Typography variant="h6">
                  Station Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <ul style={{"padding":0,"margin":0,"listStyleType":"none"}}>
                    <li><b>Name:</b> {app.getLocation_explorer.name}, {app.getLocation_explorer.state}</li>
                    <li><b>Network:</b> {(app.getLocation_explorer.network===17) ? 'SCAN' : 'Tribal SCAN'}</li>
                    <li><b>Latitude, Longitude:</b> {app.getLocation_explorer.ll[1]}, {app.getLocation_explorer.ll[0]}</li>
                    <li><b>Elevation:</b> {app.getLocation_explorer.elev} feet</li>
                    <li><b>Period of Record:</b> {app.getLocation_explorer.sdate} to {porEnd}</li>
                    <li><b>Soil Characterization:</b> <a href={pedonURL} target="_blank" rel="noopener noreferrer">View reports from the NSSC</a></li>
                  </ul>
                </Typography>
            </div>
        );
    }
}

export default withRouter(StationExplorerInfo);
