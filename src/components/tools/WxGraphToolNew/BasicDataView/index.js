import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import moment from 'moment';

// Components
import VarPopover from '../../../VarPopover'
import VarPicker from '../../../VarPicker'
import WxCharts from './WxCharts'
import WxTables from './WxTables'

var app;

@inject('store') @observer
class BasicDataView extends Component {
  constructor(props) {
    super(props);
    app = this.props.store.app;
    app.setToolName('wxgrapher')
    if (!app.getLocations || !app.getLocation) {
      // get all stations, set selected station, and download data for selected tool
      app.downloadStationInfo()
    } else {
      // stations are already set, just download data for selected tool
      app.wxgraph_downloadData()
    }
  }

  render() {
    const variable_options = [
      ['airtemp', false],
      ['rainfall', false],
      ['soiltemp', false],
      ['soilmoist', false],
      ['humidity', true],
      ['solarrad', false],
      ['wind', false],
      ['winddir', true],
    ];
    if (app.getLocation.sid.split(' ')[1]==='19') variable_options.push(['leafwet', true]);

    const options = [{
      title: 'Length of data period',
      name: 'timeframe',
      options: [
          { label: '2 Days', value: 'two_days' },
          { label: '2 Months', value: 'two_months' },
          { label: '2 Years', value: 'two_years' },
          { label: 'Entire Record', value: 'por' }
      ],
      selected: app.wxgraph_getTimeFrame,
      onChange: app.wxgraph_setTimeFrameFromRadioGroup,
      type: 'radio'
    },{
      title: 'Ending Date',
      label: 'Ending Date',
      ariaLabel: 'time period ending date',
      minDate: app.getLocation ? moment(app.getLocation.sdate) : moment('1983-01-01'),
      maxDate: undefined,
      selected: app.getGrapherDate,
      onChange: app.setGrapherDate,
      type: 'date'
    },{
      title: 'Variables',
      type: 'checkbox',
      options: variable_options.map(([n,h]) => ({
        label: app.wxgraph_getVarLabels[`${n}_label`],
        value: n,
        checked: app.wxgraph_getVars[n],
        onChange: app.wxgraph_setVars(n),
        canBeDisabled: h
      })),
      children: [app.wxgraph_getTimeFrame ==='two_days' ? '' : <span key='hrly-only' style={{'color':'#AAA'}}>* hourly data only</span>],
      disabled: app.wxgraph_getTimeFrame !=='two_days'
    },{
      title: 'Temperature Units',
      name: 'units-temp',
      options: [
          { label: '°F', value: 'degreeF' },
          { label: '°C', value: 'degreeC' }
      ],
      selected: app.wxgraph_getUnitsTemp,
      onChange: app.wxgraph_setUnitsTempFromRadioGroup,
      type: 'radio'
    },{
      title: 'Precipitation Units',
      name: 'units-prcp',
      options: [
          { label: 'inches', value: 'inches' },
          { label: 'cm', value: 'cm' },
          { label: 'mm', value: 'mm' }
      ],
      selected: app.wxgraph_getUnitsPrcp,
      onChange: app.wxgraph_setUnitsPrcpFromRadioGroup,
      type: 'radio'
    }];


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
              active={app.wxgraph_dataIsLoading}
              spinner
              background={'rgba(255,255,255,1.0)'}
              color={'rgba(34,139,34,1.0)'}
              spinnerSize={'10vw'}
            >
              {app.getOutputType==='chart' ? <WxCharts /> : <WxTables />}
            </LoadingOverlay>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default BasicDataView;
