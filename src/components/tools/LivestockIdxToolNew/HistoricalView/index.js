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
import LoadStationData from './LoadStationData';
import VarPopover from './VarPopover'
import VarPicker from './VarPicker'
import DisplayCharts from './DisplayCharts'
import DisplayTables from './DisplayTables'

// Styles
//import '../../../styles/WxGraphTool.css';

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
class HistoricalView extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('livestock')
        this.state = {
          data: null,
          data_is_loading: false,
          //disabled: ['mild_discomfort'],
          disabled: [],
        }
    }

    componentDidMount() {
        this.initStateForLoading()
        LoadStationData({
            sid:this.props.station
        })
          .then(response => {
            console.log('Historical View : LoadStationData response');
            console.log(response);
            this.setState({
              data:response.data.data,
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
                      data:response.data.data,
                      data_is_loading:false,
                    })
                  });
        }
    }

    // temperature humidity index
    //THI from https://www.progressivedairy.com/topics/herd-health/how-do-i-determine-how-do-i-calculate-temperature-humidity-index-thi
    calc_thi = (t,rh) => {
        // t: temperature (degF)
        // rh: relative humidity (%)
        return t-(0.55-(0.55*rh/100.))*(t-58)
    }

    calc_cattle_breathing_rate = (t,rh,s,w) => {
        // t: temperature (degF)
        // rh: relative humidity (%)
        // s: solar radiation (Wm-2)
        // w: wind speed (mph)
        let breathing_rate = (2.83*t) + (0.58*rh) - (0.76*w) + (0.039*s) - 196.4
        breathing_rate = (breathing_rate<40) ? 40 : parseInt(breathing_rate,10)
        return breathing_rate
    }

    calc_hourly_indices = (d) => {
        // d: data from acis call
        console.log('calc_hourly_indices: d')
        console.log(d)
        let iday,ihr
        let t,rh,s,w
        let thi,cbr
        let oseries=[]
        let thi_array=[]
        let cbr_array=[]
        if (!d) {return oseries}
        for (iday=0; iday<d.length; iday++) {
            thi_array = []
            cbr_array = []
            for (ihr=0; ihr<d[iday][1].length; ihr++) {
                t = (d[iday][1][ihr]==='M') ? null : parseFloat(d[iday][1][ihr])
                rh = (d[iday][2][ihr]==='M') ? null : parseFloat(d[iday][2][ihr])
                s = (d[iday][3][ihr]==='M') ? null : parseFloat(d[iday][3][ihr])
                w = (d[iday][4][ihr]==='M') ? null : parseFloat(d[iday][4][ihr])
                thi = (t && rh) ? this.calc_thi(t,rh) : null
                cbr = (t && rh && s && w) ? this.calc_cattle_breathing_rate(t,rh,s,w) : null
                if (thi) {thi_array.push(thi)}
                if (cbr) {cbr_array.push(cbr)}
            }
            oseries.push({
              'date': d[iday][0],
              'thi': thi_array,
              'cbr': cbr_array,
            })
        }
        return oseries
    }

    get_heat_index_thresholds = (livestock_type) => {
        // for a given livestock type, return the index type used,
        // along with any important thresholds
        // 'cbr' is 'cattle breathing rate' in breaths per minute
        // 'thi' is 'temperature humidity index'
        if (livestock_type==='cattle') {
            return {'idx_type':'cbr','alert':[90,110],'danger':[110,130],'emergency':[130,1000000]}
        } else if (livestock_type==='cow') {
            return {'idx_type':'thi','mild_discomfort':[68,72],'discomfort':[72,75],'alert':[75,79],'danger':[79,84],'emergency':[84,1000000]}
        } else if (livestock_type==='biganimal') {
            return {'idx_type':'thi','moderate':[72,74],'severe':[74,78],'very severe':[78,1000000]}
        } else if (livestock_type==='smallanimal') {
            return {'idx_type':'thi','moderate':[82,84],'severe':[84,86],'very severe':[86,1000000]}
        } else {
            return {}
        }
    }

    calc_heat_index_frequencies = () => {
        // t: object containing category names and index thresholds
        // e.g. {'idx_type':'thi','alert':75,'danger':79,'emergency':84}
        let t = this.get_heat_index_thresholds(app.livestock_getLivestockType)
        // heatIdxHourly: hourly heat index values by day
        let heatIdxHourly = this.calc_hourly_indices(this.state.data)
        console.log('calc_heat_index_frequencies: heatIdxHourly')
        console.log(heatIdxHourly)
        // construct list of all hours annually
        let iday,iyr
        let year=null
        let year_today
        let temp_array=[]
        let heatIdxHourly_byYear=[]
        for (iday=0; iday<heatIdxHourly.length; iday++) {
            year_today = heatIdxHourly[iday]['date'].split('-')[0]
            // if just starting the loop, assigned year
            if (!year) { year = year_today }
            //
            if (year_today===year) {
                //same year - append arrays
                temp_array.push(...heatIdxHourly[iday][t['idx_type']])
            } else {
                // write array of hourly values to output array
                heatIdxHourly_byYear.push({'year':year, 'idx':temp_array})
                // reinit year and annual array of indices
                year = year_today
                temp_array=[]
                
            }
        }
        // final year: write array of hourly values to output array
        heatIdxHourly_byYear.push({'year':year, 'idx':temp_array})

        // determine frequency of occurrences above specified thresholds
        let prop,filteredArr,outObject
        let outArray=[]
        let missThresh = 240 // allowed number of hours to be missing in year
        let validThresh = parseInt(365.*24.,10) - missThresh
        for (iyr=0; iyr<heatIdxHourly_byYear.length; iyr++) {
            // object for this year. It will hold the year and all frequencies
            outObject = {'year':heatIdxHourly_byYear[iyr]['year']}
            // If there are not enough valid hours, skip this year
            if (heatIdxHourly_byYear[iyr]['idx'].length < validThresh) { continue }
            //loop through all given thresholds
            for (prop in t) {
                filteredArr = []
                if (prop!=='idx_type' && Object.prototype.hasOwnProperty.call(t, prop)) {
                    filteredArr = heatIdxHourly_byYear[iyr]['idx'].filter(v => v>=t[prop][0] && v<t[prop][1])
                    outObject[prop] = filteredArr.length
                }
            }
            // output array, will contain frequencies for each year
            outArray.push(outObject)
        }

        console.log('calc_heat_index_frequencies')
        console.log(outArray)
        return outArray
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
          data: null,
        })
    }

    dataIsLoading = () => {
        return this.state.data_is_loading
    }

    getIdxTypeLabel = (type) => {
        if (type==='cattle') {
            return 'Cattle'
        } else if (type==='cow') {
            return 'Dairy Cow'
        } else if (type==='biganimal') {
            return 'Big Animal'
        } else if (type==='smallanimal') {
            return 'Small Animal'
        } else {
            return ''
        }

    }

    getChartInfo = (type) => {
        if (type==='cattle') {
            return {
                'typeLabel':'Cattle',
                'dataInfo': [
                    {'key':'emergency','label':'Emergency','color':'#581845'},
                    {'key':'danger','label':'Danger','color':'#900C3F'},
                    {'key':'alert','label':'Alert','color':'#C70039'},
                ]
            }
        } else if (type==='cow') {
            return {
                'typeLabel':'Dairy Cow',
                'dataInfo': [
                    {'key':'emergency','label':'Emergency','color':'#581845'},
                    {'key':'danger','label':'Danger','color':'#900C3F'},
                    {'key':'alert','label':'Alert','color':'#C70039'},
                    {'key':'discomfort','label':'Discomfort','color':'#FF5733'},
                    {'key':'mild_discomfort','label':'Mild Discomfort','color':'#FFC300'},
                ]
            }
        } else if (type==='biganimal') {
            return {
                'typeLabel':'Big Animal',
                'dataInfo': [
                    {'key':'very severe','label':'Very Severe','color':'#581845'},
                    {'key':'severe','label':'Severe','color':'#900C3F'},
                    {'key':'moderate','label':'Moderate','color':'#C70039'},
                ]
            }
        } else if (type==='smallanimal') {
            return {
                'typeLabel':'Small Animal',
                'dataInfo': [
                    {'key':'very severe','label':'Very Severe','color':'#581845'},
                    {'key':'severe','label':'Severe','color':'#900C3F'},
                    {'key':'moderate','label':'Moderate','color':'#C70039'},
                ]
            }
        } else {
            return []
        }
    }

    render() {
        //const { classes } = this.props;

        let display;
        if (this.props.outputtype==='chart') {
            display = <DisplayCharts
                        data={this.calc_heat_index_frequencies()}
                        stnName={this.props.stnname}
                        loading={this.state.data_is_loading}
                        chartTitle={'Extreme Heat Index Frequencies ('+this.getIdxTypeLabel(app.livestock_getLivestockType)+', hours)'}
                        chartInfo={this.getChartInfo(app.livestock_getLivestockType)}
                        disabled={this.state.disabled}
                        onClickLegend={this.handleClickLegend}
                      />
        }
        if (this.props.outputtype==='table') {
            display = <DisplayTables
                        data={this.calc_heat_index_frequencies()}
                        stnName={this.props.stnname}
                        loading={this.state.data_is_loading}
                        tableTitle={'Extreme Heat Index Frequencies ('+this.getIdxTypeLabel(app.livestock_getLivestockType)+', hours)'}
                        tableInfo={this.getChartInfo(app.livestock_getLivestockType)}
                      />
        }

        let display_VarPicker;
        display_VarPicker = <VarPicker />

        let display_VarPopover;
        display_VarPopover = <VarPopover
                               contents={display_VarPicker}
                             />

        return (
            <Grid container direction="row" justify="flex-start" alignItems="flex-start" xs={12}>
                <Hidden smDown>
                    <Grid item container className="nothing" direction="column" justify="flex-start" alignItems="flex-start" md={3}>
                        <Grid item>
                            {display_VarPicker}
                        </Grid>
                    </Grid>
                </Hidden>
                    <Grid item container className="nothing" direction="column" xs={12} md={9}>
                        <Grid item container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                          <Hidden mdUp>
                            <Grid item>
                              {display_VarPopover}
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
                                {display}
                            </LoadingOverlay>
                        </Grid>
                    </Grid>
            </Grid>
        );

    }
}

export default withStyles(styles)(HistoricalView);
