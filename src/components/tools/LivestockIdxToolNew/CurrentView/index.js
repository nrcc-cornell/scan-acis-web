import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Components
import VarPopover from '../../../VarPopover';
import VarPicker from '../../../VarPicker';
import LivestockIdxCharts from './LivestockIdxCharts';
import LivestockIdxTables from './LivestockIdxTables';

var app;

@inject('store') @observer
class CurrentView extends Component {

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
      const options = app.getOutputType === 'chart' ? [{
        title: 'Heat Index',
        name: 'livestock',
        options: [
            { label: 'Cattle', value: 'cattle' },
            { label: 'Dairy Cow', value: 'cow' },
            { label: 'Large Animal', value: 'biganimal' },
            { label: 'Small Animal', value: 'smallanimal' }
        ],
        selected: app.livestock_livestockType,
        onChange: app.livestock_setLivestockTypeFromRadioGroup,
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
                active={app.livestock_dataIsLoading}
                spinner
                background={'rgba(255,255,255,1.0)'}
                color={'rgba(34,139,34,1.0)'}
                spinnerSize={'10vw'}
                >
                  {app.getOutputType==='chart' ? <LivestockIdxCharts /> : <LivestockIdxTables />}
              </LoadingOverlay>
            </Grid>
          </Grid>
        </Grid>
      );
    }
}

export default CurrentView;
