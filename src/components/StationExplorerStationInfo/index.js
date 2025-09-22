import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import LoadingOverlay from 'react-loading-overlay';

var app;

@inject('store') @observer
class StationExplorerStationInfo extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {
        let porEnd = (app.getLocation_explorer.edate && app.getLocation_explorer.edate.slice(0,4)==='9999') ? 'present' : app.getLocation_explorer.edate;
        let sid_and_network = app.getLocation_explorer.sid;
        let sid = sid_and_network.split(" ")[0];
        let pedonURL = "https://wcc.sc.egov.usda.gov/nwcc/pedon?sitenum="+sid

        return (
            <div id="station_info">
              <LoadingOverlay
                active={app.explorer_dataIsLoading}
                spinner
                background={'rgba(255,255,255,1.0)'}
                color={'rgba(34,139,34,1.0)'}
                spinnerSize={'10vw'}
              >
                <Typography variant="h6">
                  Station Information
                </Typography>
                <Typography component="span" variant="body2" gutterBottom>
                  <ul style={{"padding":0,"margin":0,"listStyleType":"none"}}>
                    <li><b>Name:</b> {app.getLocation_explorer.name}, {app.getLocation_explorer.state}</li>
                    <li><b>Network:</b> {(app.getLocation_explorer.network===17) ? 'SCAN' : 'Tribal SCAN'}</li>
                    <li><b>Latitude, Longitude:</b> {app.getLocation_explorer.ll[1].toFixed(2)}, {app.getLocation_explorer.ll[0].toFixed(2)}</li>
                    <li><b>Elevation:</b> {app.getLocation_explorer.elev} feet</li>
                    <li><b>Period of Record:</b> {app.getLocation_explorer.sdate} to {porEnd}</li>
                    <li><b>Soil Characterization:</b> <a href={pedonURL} target="_blank" rel="noopener noreferrer">View reports from the NSSC</a></li>
                  </ul>
                </Typography>
              </LoadingOverlay>
            </div>
        );
    }
}

export default withRouter(StationExplorerStationInfo);
