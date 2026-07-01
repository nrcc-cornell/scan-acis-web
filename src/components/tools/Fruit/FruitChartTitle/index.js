import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//Components
import DownloadCharts from '../DownloadCharts'

var app;

@inject('store') @observer
class FruitChartTitle extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {
        let fruitName;
        if (app.getToolName === 'pawpaw') {
          fruitName = 'Pawpaw Growth';
        } else if (app.getToolName === 'blueberryGrowth') {
          fruitName = 'Lowbush Blueberry Growth';
        } else {
          fruitName = 'Lowbush Blueberry Harvest';
        }

        let downloadFilename = (app.getLocation) ?
            app.getLocation.name+'_'+fruitName+'.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        let base_label = "base "+app.fruittool_getBase+"°F"

        return (
            <div className="fruit-chart-title">
              <Grid item container justifyContent="center" alignItems="center" spacing={0}>
                <Grid item>
                  <Typography variant="h6">
                    <span>{fruitName + ' and Accumulated GDD ('+base_label+') in '+app.fruittool_getSelectedYear}</span>
                  </Typography>
                </Grid>
                <Grid item>
                    <DownloadCharts fname={downloadFilename} />
                </Grid>
              </Grid>

              <Grid item container justifyContent="center" alignItems="center" spacing={0}>
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

export default FruitChartTitle;

