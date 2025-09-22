///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { parseISO, isBefore, isAfter } from 'date-fns';

import { windchill as calculateWindChill, heatindex as calculateHeatIndex } from '../windheatModels';
import { getDateRangeForState } from './windheatHistoricalDateRanges';

// Components
import LoadStationData from './LoadStationData';
import VarPopover from '../../../VarPopover';
import VarPicker from '../../../VarPicker';
import DisplayCharts from './DisplayCharts';
import DisplayTables from './DisplayTables';

const styles = theme => ({});

const climatologyOptions = [{
  value: 'season',
  label: 'Local Season',
  titleType: 'range',
  titleText: null,
  start: null,
  end: null
},{
  value: 'annual',
  label: 'Annual',
  titleType: 'range',
  titleText: 'Jan. - Dec.',
  start: '01-01',
  end: '12-31'
},{
  value: 'winter',
  label: 'Winter',
  titleType: 'range',
  titleText: 'Dec. - Feb.',
  start: '12-01',
  end: '02-29'
},{
  value: 'spring',
  label: 'Spring',
  titleType: 'range',
  titleText: 'Mar. - May',
  start: '03-01',
  end: '05-31'
},{
  value: 'summer',
  label: 'Summer',
  titleType: 'range',
  titleText: 'Jun. - Aug.',
  start: '06-01',
  end: '08-31'
},{
  value: 'fall',
  label: 'Fall',
  titleType: 'range',
  titleText: 'Sept. - Nov.',
  start: '09-01',
  end: '11-30'
},{
  value: '01',
  label: 'January',
  titleType: 'single',
  titleText: null,
  start: '01-01',
  end: '01-31'
},{
  value: '02',
  label: 'February',
  titleType: 'single',
  titleText: null,
  start: '02-01',
  end: '02-29'
},{
  value: '03',
  label: 'March',
  titleType: 'single',
  titleText: null,
  start: '03-01',
  end: '03-31'
},{
  value: '04',
  label: 'April',
  titleType: 'single',
  titleText: null,
  start: '04-01',
  end: '04-30'
},{
  value: '05',
  label: 'May',
  titleType: 'single',
  titleText: null,
  start: '05-01',
  end: '05-31'
},{
  value: '06',
  label: 'June',
  titleType: 'single',
  titleText: null,
  start: '06-01',
  end: '06-30'
},{
  value: '07',
  label: 'July',
  titleType: 'single',
  titleText: null,
  start: '07-01',
  end: '07-31'
},{
  value: '08',
  label: 'August',
  titleType: 'single',
  titleText: null,
  start: '08-01',
  end: '08-31'
},{
  value: '09',
  label: 'September',
  titleType: 'single',
  titleText: null,
  start: '09-01',
  end: '09-30'
},{
  value: '10',
  label: 'October',
  titleType: 'single',
  titleText: null,
  start: '10-01',
  end: '10-31'
},{
  value: '11',
  label: 'November',
  titleType: 'single',
  titleText: null,
  start: '11-01',
  end: '11-30'
},{
  value: '12',
  label: 'December',
  titleType: 'single',
  titleText: null,
  start: '12-01',
  end: '12-31'
}];

var app;

const calc_hourly_indices = (d, missingValue, noValue) => {
    // d: data from acis call
    let oseries=[]
    if (!d) {return oseries}
    for (let iday=0; iday<d.length; iday++) {
        const heatindex = [];
        const windchill = [];
        for (let ihr=0; ihr<d[iday][1].length; ihr++) {
            const t = (d[iday][1][ihr]===missingValue) ? missingValue : parseFloat(d[iday][1][ihr])
            const rh = (d[iday][2][ihr]===missingValue) ? missingValue : parseFloat(d[iday][2][ihr])
            const w = (d[iday][3][ihr]===missingValue) ? missingValue : parseFloat(d[iday][3][ihr])
            heatindex.push(calculateHeatIndex(t,rh,missingValue, noValue));
            windchill.push(calculateWindChill(t,w, missingValue, noValue));
        }
        oseries.push({
            'date': d[iday][0],
            'windchill': windchill,
            'heatindex': heatindex,
        })
    }
    return oseries
}

function calcSeasonYear(currentIsoDate, seasonStartMMDD, seasonEndMMDD) {
  const cDate = parseISO(currentIsoDate);
  const cYear = cDate.getFullYear();
  
  // Temporarily defined season start and end to validate them
  //    - season start must be before (not equal to) end
  //    - the season must be shorter than one full year (eg. if start is 3/5/2024 then end can be 3/4/2025 but not 3/5/2025 or later )
  let sDate = parseISO(`${cYear}-${seasonStartMMDD}`);
  let eDate = parseISO(`${cYear}-${seasonEndMMDD}`);

  const seasonCrossesNewYear = isBefore(eDate, sDate);

  // There are three cases where the season year needs to be adjusted from the current year:
  //    - Case 1: current date is outside of a season and prior to season start date for year (eg. current = 3/1/2024, start = 4/1, end = 5/1), subtract one year
  //    - Case 2: current date is equal to season start and season wraps new year (eg. current = 10/1/2024, start = 10/1, end = 4/1), add one year
  //    - Case 3: current date is after season start and season wraps new year (eg. current = 10/1/2024, start = 9/1, end = 4/1), add one year
  if (seasonCrossesNewYear && !isAfter(sDate, cDate)) {
    // Case 2 + 3, because !isAfter === (isBefore || isSameDay)
    return cYear + 1;
  } else if (!seasonCrossesNewYear && isBefore(cDate, sDate)) {
    // Case 1
    return cYear - 1;
  } else {
    return cYear;
  }
}

const calc_frequencies = (data, locationInfo, climatologyStr) => {
    const MISSING = 'M';
    const NO_VALUE = '--';
    
    // indicesHourly: hourly index values by day
    const indicesHourly = calc_hourly_indices(data, MISSING, NO_VALUE);
    
    const windchillThresholds = {
        'idx_type':'windchill',
        'agg_fn': (arr) => Math.min(...arr.filter(v => typeof v === 'number')),
        'categories': {
            'alert':[-20,-10],
            'danger':[-35,-20],
            'extreme_danger': [-50,-35],
            'emergency':[-1000000, -50]
        }
    };
    const heatindexThresholds = {
        'idx_type':'heatindex',
        'agg_fn': (arr) => Math.max(...arr.filter(v => typeof v === 'number')),
        'categories': {
            'caution':[80,90],
            'extreme_caution':[90,103],
            'danger':[103,125],
            'extreme_danger':[125,1000000]
        }
    };
    const [ windchillFrequencies, heatindexFrequencies ] = [windchillThresholds, heatindexThresholds].map(t => {
        // get date range to calculate from
        let { start, end } = climatologyOptions.find(({ value }) => value === climatologyStr);
        if (start === null || end === null) {
          ({ start, end } = getDateRangeForState(locationInfo.state, t['idx_type']));
        }

        // construct list of all hours and days annually
        let start_idx = null;
        let is_end = false;
        let temp_hourly_array=[]
        let temp_daily_array=[]
        let temp_dates_hourly = []
        let temp_dates_daily = []
        let indicesHourly_byYear=[]
        let indicesDaily_byYear=[]
        for (let iday = 0; iday < indicesHourly.length; iday++) {
            const today = indicesHourly[iday]['date'].slice(5);
            if (today === start) {
              start_idx = iday;
            }
            
            if (start_idx !== null) {
                // Handles leap end date of leap day
                const today_is_end = today === end || (end === '02-29' && today === '02-28' && indicesHourly[iday + 1]['date'].slice(5) !== end);

                if (today_is_end) {
                    // In the final day
                    is_end = true;
                } else if (!today_is_end && is_end) {
                    // Past final day, add results to object and reset temp data
                    const year = calcSeasonYear(indicesHourly[iday - 1]['date'], start, end);
                    // write array of hourly values to output array
                    indicesHourly_byYear.push({'year': String(year), 'idx':temp_hourly_array, 'dates': temp_dates_hourly, 'isComplete': true})
                    indicesDaily_byYear.push({'year': String(year), 'idx':temp_daily_array, 'dates': temp_dates_daily, 'isComplete': true})
                    // set end idx to last idx and reset annual array of indices and reset is_end flag
                    temp_hourly_array=[]
                    temp_daily_array=[]
                    temp_dates_hourly=[]
                    temp_dates_daily=[]
                    is_end = false;
                    start_idx = null;
                }

                if (today === start) {
                    start_idx = iday;
                }
                
                if (start_idx !== null) {
                    // in a season, get day data
                    temp_dates_hourly.push(...indicesHourly[iday][t['idx_type']].map(_ => indicesHourly[iday]['date']));
                    temp_dates_daily.push(indicesHourly[iday]['date']);
                    temp_hourly_array.push(...indicesHourly[iday][t['idx_type']])
                    temp_daily_array.push(t['agg_fn'](indicesHourly[iday][t['idx_type']]))
                }
            }
        }
        // final year: write array of hourly values to output array if there is an incomplete season
        if (start_idx !== null) {
            const year = String(parseInt(indicesHourly_byYear[indicesHourly_byYear.length - 1]['year'], 10) + 1);
            indicesHourly_byYear.push({'year': year, 'idx':temp_hourly_array, 'dates': temp_dates_hourly, 'isComplete': false})
            indicesDaily_byYear.push({'year': year, 'idx':temp_daily_array, 'dates': temp_dates_daily, 'isComplete': false})
        }

        // determine frequency of occurrences above specified thresholds
        let outArrays={ hours: [], days: [] };
        let missThresh = 2.5 // percent of data allowed to be missing in year
        for (let iyr = 0; iyr < indicesHourly_byYear.length; iyr++) {
            // Calculate missing data percentage
            const numObservations = indicesHourly_byYear[iyr]['idx'].length;
            const numMissing = indicesHourly_byYear[iyr]['idx'].filter(v => v === MISSING).length;
            const percentMissing = numMissing / numObservations * 100;

            [['hours', indicesHourly_byYear],['days', indicesDaily_byYear]].forEach(([timescale, indices_byYear]) => {
                // object for this year. It will hold the year and all frequencies
                const outObject = { 'year': indices_byYear[iyr]['year'], 'isComplete': indices_byYear[iyr]['isComplete'], 'isMissing': missThresh <= percentMissing, 'percentMissing': percentMissing, 'categories': {} }
                
                const filteredValues = indices_byYear[iyr]['idx'].filter(v => !([Infinity, -Infinity, MISSING, NO_VALUE].includes(v)));
                //loop through all given thresholds
                for (let prop in t['categories']) {
                    outObject['categories'][prop] = filteredValues.filter(v => v>=t['categories'][prop][0] && v<t['categories'][prop][1]).length
                }
                // output array, will contain frequencies for each year
                outArrays[timescale].push(outObject);
            })
        }
        return outArrays;
    });
    return { windchill: windchillFrequencies, heatindex: heatindexFrequencies };
}

@inject('store') @observer
class HistoricalView extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('windheat')
        this.year = new Date().getFullYear()
        this.doy = Math.round((Date.now() - Date.parse(new Date().getFullYear(), 0, 0)) / 86400000)
        this.state = {
          rawData: null,
          data: null,
          data_is_loading: false,
          timescale: 'hours',
          climatology: 'season',
          disabled: [],
        }
    }

    componentDidMount() {
        this.initStateForLoading()
        LoadStationData({
            sid:this.props.station
        })
          .then(response => {
            this.setState({
              rawData: response.data.data,
              data: calc_frequencies(response.data.data, app.location_explorer, this.state.climatology),
              data_is_loading:false,
            })
          });
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.station!==this.props.station) {
                this.initStateForLoading()
                LoadStationData({
                    sid:this.props.station
                })
                  .then(response => {
                    this.setState({
                      rawData: response.data.data,
                      data: calc_frequencies(response.data.data, app.location_explorer, this.state.climatology),
                      data_is_loading:false,
                    })
                  });
        }
    }

    handleChangeTimescale = (value) => {
      this.setState({
        timescale: value
      })
    }

    handleChangeClimatology = (value) => {
      this.setState({
        climatology: value,
        data: calc_frequencies(this.state.rawData, app.location_explorer, value),
      })
    }

    handleClickLegend = (dataKey) => {
        // dataKey : key in legend of chart
        if (this.state.disabled.includes(dataKey)) {
          this.setState({
            disabled: this.state.disabled.filter(obj => obj !== dataKey)
          });
        } else {
          this.setState({ disabled: this.state.disabled.concat([dataKey]) });
        }
    }

    initStateForLoading = () => {
        this.setState({
          data_is_loading: true,
          rawData: null,
          data: null,
        })
    }

    dataIsLoading = () => {
        return this.state.data_is_loading
    }

    getIdxTypeLabel = (type) => {
        if (type==='windchill') {
            return 'Wind Chill'
        } else if (type==='heatindex') {
            return 'Heat Index'
        } else {
            return ''
        }
    }

    getChartInfo = (type) => {
        if (type==='windchill') {
            return {
                'typeLabel':'Wind Chill',
                'dataInfo': [
                    {'key':'emergency','label':'Emergency','color':'#4A005A','missingColor': '#1F1F1F'},
                    {'key':'extreme_danger','label':'Extreme Danger','color':'#613684','missingColor': '#434343'},
                    {'key':'danger','label':'Danger','color':'#5B73C2','missingColor': '#676767'},
                    {'key':'alert','label':'Alert','color':'#A6D5FF','missingColor': '#AFAFAF'},
                ]
            }
        } else if (type==='heatindex') {
            return {
                'typeLabel':'Heat Index',
                'dataInfo': [
                    {'key':'extreme_danger','label':'Extreme Danger','color':'#CC0003','missingColor': '#1F1F1F'},
                    {'key':'danger','label':'Danger','color':'#FB6600','missingColor': '#434343'},
                    {'key':'extreme_caution','label':'Extreme Caution','color':'#FDD015','missingColor': '#676767'},
                    {'key':'caution','label':'Caution','color':'#FFFF99','missingColor': '#AFAFAF'},
                ]
            }
        } else {
            return []
        }
    }

    constructTitle = () => {
      let title = '';
      
      const type = this.getIdxTypeLabel(app.windheat_getWindHeatType);
      const timescale = this.state.timescale;
      const climatologyOption = climatologyOptions.find(({ value }) => value === this.state.climatology);
      
      if (climatologyOption) {
        if (climatologyOption.titleType === 'single') {
          title = `${type} Frequencies in ${climatologyOption.label} (${timescale})`;
        } else if (climatologyOption.titleType === 'range') {
          const titleText = climatologyOption.titleText || getDateRangeForState(app.location_explorer.state, app.windheat_getWindHeatType).text;
          title = `${climatologyOption.label} (${titleText}) ${type} Frequencies (${timescale})`;
        }
      }

      return title;
    } 

    render() {
        const options = [{
          title: 'Temperature Measure',
          name: 'windheat',
          options: [
              { label: 'Wind Chill', value: 'windchill' },
              { label: 'Heat Index', value: 'heatindex' }
          ],
          selected: app.windheat_windheatType,
          onChange: app.windheat_setwindheatTypeFromRadioGroup,
          type: 'radio'
        },{
          title: 'Timescale',
          name: 'timescale',
          options: [
              { label: 'Hours', value: 'hours' },
              { label: 'Days', value: 'days' }
          ],
          selected: this.state.timescale,
          onChange: this.handleChangeTimescale,
          type: 'radio'
        },{
          title: 'Climatology',
          name: 'climatology',
          options: climatologyOptions,
          selected: this.state.climatology,
          onChange: this.handleChangeClimatology,
          type: 'selector'
        }];

        return (
          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" style={{ width: '100%' }}>
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
                  active={this.dataIsLoading()}
                  spinner
                  background={'rgba(255,255,255,1.0)'}
                  color={'rgba(34,139,34,1.0)'}
                  spinnerSize={'10vw'}
                >
                    {this.props.outputtype==='chart' ? (
                      <DisplayCharts
                        data={(this.state.data === null || !app.windheat_getWindHeatType) ? [] : this.state.data[app.windheat_getWindHeatType][this.state.timescale]}
                        stnName={this.props.stnname}
                        loading={this.state.data_is_loading}
                        chartTitle={this.constructTitle()}
                        chartInfo={this.getChartInfo(app.windheat_getWindHeatType)}
                        disabled={this.state.disabled}
                        onClickLegend={this.handleClickLegend}
                        timescale={this.state.timescale}
                      />
                    ) : (
                      <DisplayTables
                        data={this.state.data ? this.state.data[app.windheat_getWindHeatType][this.state.timescale] : []}
                        stnName={this.props.stnname}
                        loading={this.state.data_is_loading}
                        tableTitle={this.constructTitle()}
                        tableInfo={this.getChartInfo(app.windheat_getWindHeatType)}
                      />
                    )}
                </LoadingOverlay>
              </Grid>
            </Grid>
          </Grid>
        );

    }
}

export default withStyles(styles)(HistoricalView);


// Change out the VarPicker and VarPopover here (Historical view of windheat), then everywhere else