///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import StationExplorerSelect from '../../components/StationExplorerSelect';

// Styles
//import '../../styles/StationExplorerTable.css';

var app;

@inject('store') @observer
class StationExplorerTable extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let loc = app.getLocation_explorer

        return (
            <div id="feature_infos">
              <Grid container spacing="16">
                <Grid item container>
                  <Grid item>
                    <Typography variant="h6">
                      <StationExplorerSelect names={app.getLocations} />
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing="16">
                  <Grid item>
                    <Typography variant="subtitle2">
                      Station Information
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <ul style={{"padding":0,"margin":0,"list-style-type":"none"}}>
                        <li>Latitude, Longitude: {app.getLocation_explorer.ll[1]}, {app.getLocation_explorer.ll[0]}</li>
                        <li>Elevation: XXX</li>
                        <li>Period of Record: XXXX-XXXX</li>
                        <li>Soil Characteristics: XXX</li>
                      </ul>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2">
                      Latest Observations (@ YYYY-MM-DD HH:MM)
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <ul style={{"padding":0,"margin":0,"list-style-type":"none"}}>
                        <li>Temperature: XXX</li>
                        <li>Precipitation: XXX</li>
                        <li>Relative Humidity: XXX</li>
                        <li>Solar Radiation: XXX</li>
                        <li>Wind Speed: XXX</li>
                        <li>Soil Moisture: XX(2in), XX(4in), XX(8in), XX(20in), XX(40in)</li>
                        <li>Soil Temperature: XX(2in), XX(4in), XX(8in), XX(20in), XX(40in)</li>
                      </ul>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </div>
        );
    }
}

export default StationExplorerTable;
