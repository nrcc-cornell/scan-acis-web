import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import GddChart from './GddChart'
import GddTable from './GddTable'
import LoadingOverlay from 'react-loading-overlay';
import { Grid, Hidden } from '@material-ui/core';
import GddtoolDoc from './GddtoolDoc';
import VarPicker from '../../VarPicker';
import VarPopover from '../../VarPopover';

var app;

@inject('store') @observer
class GddTool extends Component {
    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('gddtool')
        if (!app.getLocations || !app.getLocation) {
            // get all stations, set selected station, and download data for selected tool
            app.downloadStationInfo()
        } else {
            // stations are already set, just download data for selected tool
            app.gddtool_downloadData()
        }
    }

    render() {
      const options = [{
        title: 'Planting/Budbreak Date',
        label: 'Planting/Budbreak',
        ariaLabel: 'planting or budbreak date',
        minDate: "1981-01-01",
        maxDate: app.latestSelectableYear.toString()+"-10-31",
        selected: app.getPlantingDate,
        onChange: app.setPlantingDate,
        type: 'date'
      },{
        title: 'GDD Base (°F)',
        btnAriaLabel: 'update growing degree day base',
        value: app.gddtool_getBase,
        onChange: app.gddtool_setBaseManually,
        type: 'number'
      }];

      return (
        <div>
          <Grid container direction="row" alignItems="flex-start">
              <Hidden smDown>
                <Grid item container className="nothing" direction="column" md={2}>
                  <Grid item>
                    <VarPicker options={options} />
                  </Grid>
                </Grid>
              </Hidden>
              <Grid item container className="nothing" direction="column" xs={12} md={10}>
                <Grid item container direction="row" justifyContent="space-around" alignItems="center" spacing={1}>
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
                    active={app.gddtool_dataIsLoading}
                    spinner
                    background={'rgba(255,255,255,1.0)'}
                    color={'rgba(34,139,34,1.0)'}
                    spinnerSize={'10vw'}
                  >
                    {app.getOutputType==='chart' ? (
                      <GddChart />
                    ) : (
                      <GddTable />
                    )}
                  </LoadingOverlay>
                </Grid>
              </Grid>
            </Grid>

            <GddtoolDoc />
        </div>
      );
        // return (
        //     <div style={{ width: '100%', overflow: 'hidden' }}>
        //       <Grid container justifyContent="center" alignItems="center" direction="column" spacing={3} style={{ marginTop: '8px' }}>
        //         <Grid item container justifyContent="center" alignItems="center" spacing={3}>
        //           <Grid item>
        //               <PlantingDatePicker />
        //           </Grid>
        //           <Grid item>
        //               <GddBaseInput />
        //           </Grid>
        //         </Grid>
        //         <Grid item>
        //           <LoadingOverlay
        //             active={app.gddtool_dataIsLoading}
        //             spinner
        //             background={'rgba(255,255,255,1.0)'}
        //             color={'rgba(34,139,34,1.0)'}
        //             spinnerSize={'10vw'}
        //           >
        //             {app.getOutputType==='chart' ? (
        //               <GddChart />
        //             ) : (
        //               <GddTable />
        //             )}
        //           </LoadingOverlay>
        //         </Grid>
        //       </Grid>

        //       <GddtoolDoc />
        //     </div>
        // );
    }
}

export default GddTool;

