///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
//import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

import LoadStationData from './LoadStationData';
import LoadSoilParameters from './LoadSoilParameters';
import YearSelect from './YearSelect';
//import DepthSelect from './DepthSelect';
import DepthRangeSelect from './DepthRangeSelect';
import WaterDeficitModel from './WaterDeficitModel';
import DisplayWaterDeficitChart from './DisplayWaterDeficitChart';
import DisplaySoilMoistureChart from './DisplaySoilMoistureChart';
import DisplayPrecipChart from './DisplayPrecipChart';

// Styles
//import '../../../styles/WaterDefTool.css';

const styles = theme => ({
  wrapper: {
    //margin: theme.spacing(1),
    position: 'relative',
  },
  mapProgress: {
    color: green[500],
    position: 'absolute',
    zIndex: 1000,
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
});

var app;

@inject('store') @observer
class WaterDefTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('waterdef')
        this.state = {
          //years: null,
          //year: null,
          years: [moment().year()],
          year: moment().year(),
          depth_top: 0, // inches
          depth_bottom: 12, // inches
          data_precip: null,
          precip_is_loading: false,
          data_soil_moisture: null,
          soilm_is_loading: false,
          data_soil_parameters: null,
          soilp_is_loading: false,
          data_water_deficit: null,
          units: 'inches', //cm or inches
        }
    }

    componentDidMount() {
        this.initStateForLoading()
        LoadStationData({sid:this.props.station, period:[this.state.year.toString()+'-01-01',this.state.year.toString()+'-12-31']})
          .then(response => {
            console.log(response);
            let yearStart = (response.data.meta && response.data.meta.valid_daterange && response.data.meta.valid_daterange[1][0]) ? parseInt(response.data.meta.valid_daterange[1][0].split('-')[0],10) : moment().year()
            let yearEnd = (response.data.meta && response.data.meta.valid_daterange && response.data.meta.valid_daterange[1][1]) ? parseInt(response.data.meta.valid_daterange[1][1].split('-')[0],10) : moment().year()
            let yearArr = Array.from({length: yearEnd-yearStart+1}, (v, k) => k+yearStart)
            this.setState({
              years: yearArr,
              year: yearEnd,
              data_precip: this.formatDataForHighcharts(response.data.data,'precip'),
              data_soil_moisture: this.formatDataForHighcharts(response.data.data,'soilm'),
              precip_is_loading: false,
              soilm_is_loading: false,
            })
          });
        LoadSoilParameters({sid:this.props.station})
          .then(response => {
            this.setState({
              data_soil_parameters: response,
              soilp_is_loading: false,
            })
          });
    }

    componentDidUpdate(prevProps,prevState) {
      if (prevProps.station!==this.props.station) {
        this.initStateForLoading()
        LoadStationData({sid:this.props.station, period:[this.state.year.toString()+'-01-01',this.state.year.toString()+'-12-31']})
          .then(response => {
            let yearStart = (response.data.meta && response.data.meta.valid_daterange && response.data.meta.valid_daterange[1][0]) ? parseInt(response.data.meta.valid_daterange[1][0].split('-')[0],10) : moment().year()
            let yearEnd = (response.data.meta && response.data.meta.valid_daterange && response.data.meta.valid_daterange[1][1]) ? parseInt(response.data.meta.valid_daterange[1][1].split('-')[0],10) : moment().year()
            let yearArr = Array.from({length: yearEnd-yearStart+1}, (v, k) => k+yearStart)
            this.setState({
              years: yearArr,
              year: yearArr.includes(this.state.year) ? this.state.year : yearEnd,
              data_precip: this.formatDataForHighcharts(response.data.data,'precip'),
              data_soil_moisture: this.formatDataForHighcharts(response.data.data,'soilm'),
              precip_is_loading: false,
              soilm_is_loading: false,
            })
          });
        LoadSoilParameters({sid:this.props.station})
          .then(response => {
            this.setState({
              data_soil_parameters: response,
              soilp_is_loading: false,
            })
          });
      }
      if (prevState.year!==this.state.year) {
        this.initStateForLoading()
        LoadStationData({sid:this.props.station, period:[this.state.year.toString()+'-01-01',this.state.year.toString()+'-12-31']})
          .then(response => {
            this.setState({
              data_precip: this.formatDataForHighcharts(response.data.data,'precip'),
              data_soil_moisture: this.formatDataForHighcharts(response.data.data,'soilm'),
              precip_is_loading: false,
              soilm_is_loading: false,
            })
          });
        LoadSoilParameters({sid:this.props.station})
          .then(response => {
            this.setState({
              data_soil_parameters: response,
              soilp_is_loading: false,
            })
          });
      }
    }

    formatDataForHighcharts = (d,v) => {
        // d: data from acis call
        // v: variable to convert from string/missing to float/null
        let i
        let prcp,sm2,sm4,sm8,sm20,sm40
        let oseries=[]
        if (!d) {return oseries}
        if (v==='precip') {
            for (i=0; i<d.length; i++) {
                prcp = (d[i][1]==='M' || parseFloat(d[i][1])<0.0) ? null : ((d[i][1]==='T') ? 0.00 : parseFloat(d[i][1])).toFixed(2)
                oseries.push([moment.utc(d[i][0],'YYYY-MM-DD').valueOf(),prcp])
            };
        } else if (v==='soilm') {
            for (i=0; i<d.length; i++) {
                sm2 = (d[i][2]==='M' || parseFloat(d[i][2])<0.0) ? null : parseFloat(d[i][2]).toFixed(1)
                sm4 = (d[i][3]==='M' || parseFloat(d[i][3])<0.0) ? null : parseFloat(d[i][3]).toFixed(1)
                sm8 = (d[i][4]==='M' || parseFloat(d[i][4])<0.0) ? null : parseFloat(d[i][4]).toFixed(1)
                sm20 = (d[i][5]==='M' || parseFloat(d[i][5])<0.0) ? null : parseFloat(d[i][5]).toFixed(1)
                sm40 = (d[i][6]==='M' || parseFloat(d[i][6])<0.0) ? null : parseFloat(d[i][6]).toFixed(1)
                oseries.push([moment.utc(d[i][0],'YYYY-MM-DD').valueOf(),sm2,sm4,sm8,sm20,sm40])
            };
        } else {
            oseries = []
        }
        return oseries
    }

    handleYearChange = (e) => {
        this.setState({
          year: e.target.value,
        })
    }

    handleDepthChange = (e,newValue) => {
        this.setState({
          depth_top: newValue[0],
          depth_bottom: newValue[1],
        })
    }

    initStateForLoading = () => {
        this.setState({
          precip_is_loading: true,
          soilm_is_loading: true,
          soilp_is_loading: true,
          data_precip: null,
          data_soil_moisture: null,
          data_soil_parameters: null
        })
    }

    dataIsLoading = () => {
        return this.state.precip_is_loading && this.state.soilm_is_loading && this.state.soilp_is_loading
    }

    convert_in_to_cm = (v) => { return v*2.54 }

    render() {

        const { classes } = this.props;

        return (
          <div>
            <Grid item container direction="row" justify="space-evenly" alignItems="flex-start">
              <Grid item>
              {this.state.depth_top!==null && this.state.depth_bottom!==null &&
                <DepthRangeSelect
                  value={[this.state.depth_top,this.state.depth_bottom]}
                  onchange={this.handleDepthChange}
                />
              }
              </Grid>
              <Grid item>
              {this.state.year && this.state.years &&
                <YearSelect
                  value={this.state.year}
                  values={this.state.years}
                  onchange={this.handleYearChange}
                />
              }
              </Grid>
            </Grid>
            <Grid item>
              <div className={classes.wrapper}>
              {this.state.data_soil_parameters && this.state.data_soil_moisture && this.state.depth_top!==null && this.state.depth_bottom!==null &&
                <DisplayWaterDeficitChart
                  data={
                      WaterDeficitModel({
                          soilm:this.state.data_soil_moisture,
                          soilp:this.state.data_soil_parameters,
                          depthRangeTop:Math.floor(parseInt(this.convert_in_to_cm(this.state.depth_top),10)),
                          depthRangeBottom:Math.ceil(parseInt(this.convert_in_to_cm(this.state.depth_bottom),10)),
                          unitsOutput:this.state.units
                      })
                  }
                  depthRangeTop={this.state.depth_top}
                  depthRangeBottom={this.state.depth_bottom}
                  units={this.state.units}
                  stnName={this.props.stnname}
                  loading={this.state.soilp_is_loading || this.state.soilm_is_loading}
                />
              }
              {(!this.state.data_soil_parameters || !this.state.data_soil_moisture) &&
                <DisplayWaterDeficitChart
                  data={[]}
                  depthRangeTop={this.state.depth_top}
                  depthRangeBottom={this.state.depth_bottom}
                  units={this.state.units}
                  stnName={this.props.stnname}
                  loading={this.dataIsLoading()}
                />
              }
              {(this.state.soilp_is_loading || this.state.soilm_is_loading) &&
                <CircularProgress size={64} className={classes.mapProgress} />
              }
              </div>
            </Grid>
            <Grid item>
              <div className={classes.wrapper}>
              {this.state.data_soil_moisture &&
                <DisplaySoilMoistureChart
                  data={this.state.data_soil_moisture}
                  stnName={this.props.stnname}
                  loading={this.state.soilm_is_loading}
                />
              }
              {!this.state.data_soil_moisture &&
                <DisplaySoilMoistureChart
                  data={[]}
                  stnName={this.props.stnname}
                  loading={this.state.soilm_is_loading}
                />
              }
              {this.state.soilm_is_loading &&
                <CircularProgress size={64} className={classes.mapProgress} />
              }
              </div>
            </Grid>
            <Grid item>
              <div className={classes.wrapper}>
              {this.state.data_precip &&
                <DisplayPrecipChart
                  data={this.state.data_precip}
                  stnName={this.props.stnname}
                  loading={this.state.precip_is_loading}
                />
              }
              {!this.state.data_precip &&
                <DisplayPrecipChart
                  data={[]}
                  stnName={this.props.stnname}
                  loading={this.state.precip_is_loading}
                />
              }
              {this.state.precip_is_loading &&
                <CircularProgress size={64} className={classes.mapProgress} />
              }
              </div>
            </Grid>
          </div>
        );
    }
}

export default withStyles(styles)(WaterDefTool);
