///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Components
import VarPopover from './VarPopover'
import VarPicker from './VarPicker'
import WindHeatCharts from './WindHeatCharts'
import WindHeatTables from './WindHeatTables'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
});

var app;

@inject('store') @observer
class CurrentView extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('windheat')
        if (!app.getLocations || !app.getLocation) {
            // get all stations, set selected station, and download data for selected tool
            app.downloadStationInfo()
        } else {
            // stations are already set, just download data for selected tool
            app.windheat_downloadData()
        }
    }

    render() {
        //const { classes } = this.props;

        let display;
        if (app.getOutputType==='chart') { display = <WindHeatCharts /> }
        if (app.getOutputType==='table') { display = <WindHeatTables /> }
        let display_VarPicker;
        if (app.getOutputType==='chart') { display_VarPicker = <VarPicker /> }
        if (app.getOutputType==='table') { display_VarPicker = <VarPicker /> }
        let display_VarPopover;
        if (app.getOutputType==='chart') { display_VarPopover = <VarPopover /> }
        if (app.getOutputType==='table') { display_VarPopover = <VarPopover /> }

        if (app.getOutputType==='chart') {

          return (
            <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                <Hidden smDown>
                    <Grid item container className="nothing" direction="column" md={3}>
                        <Grid item>
                            {display_VarPicker}
                        </Grid>
                    </Grid>
                </Hidden>
                    <Grid item container className="nothing" direction="column" xs={12} md={9}>
                        <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
                          <Hidden mdUp>
                            <Grid item>
                              {display_VarPopover}
                            </Grid>
                          </Hidden>
                        </Grid>
                        <Grid item>
                            <LoadingOverlay
                              active={app.windheat_dataIsLoading}
                              spinner
                              background={'rgba(255,255,255,1.0)'}
                              color={'rgba(34,139,34,1.0)'}
                              spinnerSize={'10vw'}
                              >
                                {display}
                            </LoadingOverlay>
                        </Grid>
                    </Grid>
            </Grid>
          );

        } else {

          return (
            <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                    <Grid item container className="nothing" direction="column" xs={12}>
                        <Grid item>
                            <LoadingOverlay
                              active={app.windheat_dataIsLoading}
                              spinner
                              background={'rgba(255,255,255,1.0)'}
                              color={'rgba(34,139,34,1.0)'}
                              spinnerSize={'10vw'}
                              >
                                {display}
                            </LoadingOverlay>
                        </Grid>
                    </Grid>
            </Grid>
          );

        }
    }
}

export default withStyles(styles)(CurrentView);
