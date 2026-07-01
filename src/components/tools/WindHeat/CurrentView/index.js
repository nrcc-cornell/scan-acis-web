import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Components
import VarPopover from '../../../VarPopover'
import VarPicker from '../../../VarPicker'
import WindHeatCharts from './WindHeatCharts'
import WindHeatTables from './WindHeatTables'

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
      const options = app.getOutputType === 'chart' ? [{
        title: 'Temperature Measure',
        name: 'windheat',
        options: [
            { label: 'Wind Chill', value: 'windchill' },
            { label: 'Heat Index', value: 'heatindex' }
        ],
        selected: app.windheat_windheatType,
        onChange: app.windheat_setwindheatTypeFromRadioGroup,
        type: 'radio'
      }] : [];

      return (
        <Grid container direction="row" alignItems="flex-start">
          <Hidden smDown>
            <Grid item container className="nothing" direction="column" md={2}>
              <Grid item>
                <VarPicker options={options} />
              </Grid>
            </Grid>
          </Hidden>
          <Grid item container className="nothing" direction="column" xs={12} md={10}>
            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Hidden mdUp>
                <Grid item>
                  <VarPopover>
                    <VarPicker options={options} />
                  </VarPopover>
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
                {app.getOutputType==='chart' ? <WindHeatCharts /> : <WindHeatTables />}
              </LoadingOverlay>
            </Grid>
          </Grid>
        </Grid>
      );
    }
}

export default CurrentView;
