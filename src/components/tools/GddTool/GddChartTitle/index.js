///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//Components
import DownloadCharts from '../DownloadCharts'

// Styles
//import '../../../../styles/GddChartTitle.css';

var app;

@inject('store') @observer
class GddChartTitle extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let downloadFilename = (app.getLocation) ?
            app.getLocation.name+'_GDD.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        //let loc = app.getLocation
        let base_label = (app.gddtool_getBase==='50' && app.gddtool_getIsMethod8650) ? "86/50 method" : "base "+app.gddtool_getBase+"°F"

        return (
            <div className="gdd-chart-title">
              <Grid item container justify="center" alignItems="center" spacing={0}>
                <Grid item>
                  <Typography variant="h6">
                    <span>{'Accumulated GDD ('+base_label+') since '+app.getPlantingDate.format("YYYY-MM-DD")+''}</span>
                  </Typography>
                </Grid>
                <Grid item>
                    <DownloadCharts fname={downloadFilename} />
                </Grid>
              </Grid>

              <Grid item container justify="center" alignItems="center" spacing={0}>
                  <Grid item>
                     <Typography variant="subtitle1">
                         {(app.getLocation) ? app.getLocation.name+', '+app.getLocation.state : ''}
                     </Typography>
                  </Grid>
              </Grid>
            </div>
        );

    }
}

export default GddChartTitle;

