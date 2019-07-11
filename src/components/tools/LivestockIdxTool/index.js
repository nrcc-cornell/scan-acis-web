///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import { withStyles } from '@material-ui/core/styles';
//import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
//import Hidden from '@material-ui/core/Hidden';
//import Typography from '@material-ui/core/Typography';

// Components
import LivestockTypeButtonGroup from './LivestockTypeButtonGroup'
import LivestockIdxCharts from './LivestockIdxCharts'
import LivestockIdxTables from './LivestockIdxTables'

// Styles
import '../../../styles/WxGraphTool.css';

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
class LivestockIdxTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('livestock')
        if (!app.getLocations || !app.getLocation) {
            // get all stations, set selected station, and download data for selected tool
            app.downloadStationInfo()
        } else {
            // stations are already set, just download data for selected tool
            app.livestock_downloadData()
        }
    }

    render() {
        //const { classes } = this.props;

        let display;
        if (app.getOutputType==='chart') { display = <LivestockIdxCharts /> }
        if (app.getOutputType==='table') { display = <LivestockIdxTables /> }

        return (
            <Grid container direction="row" justify="center" alignItems="flex-start">
                    <Grid item container className="nothing" direction="column" xs={12}>
                        <Grid item container direction="row" justify="center" alignItems="center" spacing="1">
                          <Grid item>
                            <LivestockTypeButtonGroup/>
                          </Grid>
                        </Grid>
                        <Grid item>
                            <LoadingOverlay
                              active={app.livestock_dataIsLoading}
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

export default withStyles(styles)(LivestockIdxTool);
