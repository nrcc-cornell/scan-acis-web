///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import { withStyles } from '@material-ui/core/styles';
//import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Components
import TimeFrameButtonGroup from './TimeFrameButtonGroup'
//import ExtremeSwitch from './ExtremeSwitch'
import VarPopover from './VarPopover'
import VarPicker from './VarPicker'
import WxCharts from './WxCharts'
import WxTables from './WxTables'
import ExtremeSwitch from './ExtremeSwitch'

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
class WxGraphTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('wxgrapher')
        if (!app.getLocations || !app.getLocation) {
            // get all stations, set selected station, and download data for selected tool
            app.downloadStationInfo
        } else {
            // stations are already set, just download data for selected tool
            app.wxgraph_downloadData()
        }
    }

    render() {
        const { classes } = this.props;

        let display;
        if (app.getOutputType==='chart') { display = <WxCharts /> }
        if (app.getOutputType==='table') { display = <WxTables /> }
        let display_VarPicker;
        if (app.getOutputType==='chart') { display_VarPicker = <VarPicker /> }
        if (app.getOutputType==='table') { display_VarPicker = null }
        let display_ExtremeSwitch;
        if (app.getOutputType==='chart') { display_ExtremeSwitch = <ExtremeSwitch /> }
        if (app.getOutputType==='table') { display_ExtremeSwitch = null }
        let display_VarPopover;
        if (app.getOutputType==='chart') { display_VarPopover = <VarPopover /> }
        if (app.getOutputType==='table') { display_VarPopover = null }

        if (app.getOutputType==='chart') {

          return (
            <Grid container direction="row" justify="center" alignItems="flex-start">
                <Hidden smDown>
                    <Grid item container className="nothing" direction="column" md={3}>
                        <Grid item>
                            {display_ExtremeSwitch}
                        </Grid>
                        <Grid item>
                            {display_VarPicker}
                        </Grid>
                    </Grid>
                </Hidden>
                    <Grid item container className="nothing" direction="column" xs={12} md={9}>
                        <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
                          <Hidden mdUp>
                            <Grid item>
                              {display_VarPopover}
                            </Grid>
                          </Hidden>
                          <Grid item>
                            <TimeFrameButtonGroup/>
                          </Grid>
                        </Grid>
                        <Grid item>
                            <LoadingOverlay
                              active={app.wxgraph_dataIsLoading}
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
            <Grid container direction="row" justify="center" alignItems="flex-start">
                    <Grid item container className="nothing" direction="column" xs={12}>
                        <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
                          <Grid item>
                            <TimeFrameButtonGroup/>
                          </Grid>
                        </Grid>
                        <Grid item>
                            <LoadingOverlay
                              active={app.wxgraph_dataIsLoading}
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

export default withStyles(styles)(WxGraphTool);
