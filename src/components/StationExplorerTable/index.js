///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
//import Button from '@material-ui/core/Button';

import StationExplorerSelect from '../../components/StationExplorerSelect';
import StationExplorerInfo from '../../components/StationExplorerInfo';
//import StationExplorerClimateSummary from '../../components/StationExplorerClimateSummary';
//import StationExplorerLatestConditions from '../../components/StationExplorerLatestConditions';
import StationExplorerData from '../../components/StationExplorerData';

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

        //let loc = app.getLocation_explorer
        //let porEnd = (app.getLocation_explorer.edate && app.getLocation_explorer.edate.slice(0,4)==='9999') ? 'present' : app.getLocation_explorer.edate

        return (
            <div id="feature_infos">
              <Grid container spacing={2}>
                <Grid item container>
                  <Grid item>
                    <Typography variant="h6">
                      <StationExplorerSelect names={app.getLocations} />
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={2}>
                  <Grid item>
                      <StationExplorerInfo />
                  </Grid>
                  <Grid item>
                      <StationExplorerData />
                  </Grid>
                </Grid>
              </Grid>
            </div>
        );
    }
}

export default withRouter(StationExplorerTable);
