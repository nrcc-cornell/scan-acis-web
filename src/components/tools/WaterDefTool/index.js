import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

import LoadStationData from './LoadStationData';
import LoadSoilParameters from './LoadSoilParameters';
import WaterDeficitModel from './WaterDeficitModel';
import DisplayWaterDeficitChart from './DisplayWaterDeficitChart';
import DisplaySoilMoistureChart from './DisplaySoilMoistureChart';
import DisplayPrecipChart from './DisplayPrecipChart';
import DisplayTables from './DisplayTables';
import DownloadCharts from './DownloadCharts';
import WaterdefDoc from './WaterdefDoc';
import VarPicker from '../../VarPicker';
import VarPopover from '../../VarPopover';

const styles = theme => ({
  wrapper: {
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

    handleYearChange = (y) => {
        this.setState({
          year: y,
        })
    }

    handleDepthChange = (newValue) => {
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

        let downloadFilename = (app.getLocation) ?
            app.getLocation.name+'_WaterDeficit.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        const options = app.getOutputType === 'chart' ? [{
          title: 'Year',
          name: 'year',
          options: this.state.years.map(v => ({ label: v, value: v })),
          selected: this.state.year,
          onChange: this.handleYearChange,
          type: 'selector'
        },{
          title: 'Soil Depth (inches)',
          name: 'soildepth',
          options: [
            {value:   0, label:   '0'},
            {value:   6, label:   '6'},
            {value:  12, label:  '12'},
            {value:  18, label:  '18'},
            {value:  24, label:  '24'},
            {value:  30, label:  '30'},
            {value:  36, label:  '36'},
          ],
          selected: [this.state.depth_top,this.state.depth_bottom],
          onChange: this.handleDepthChange,
          props: {
            min: 0,
            max: 36,
            getAriaValueText: (v) => `Soil depth from ${v[0]} inches to ${v[1]} inches`
          },
          type: 'slider'
        }] : [];

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
                  <Grid item>
                    <Hidden mdUp>
                      <VarPopover>
                        <VarPicker options={options} />
                      </VarPopover>
                    </Hidden>
                  </Grid>

                  <Grid item>
                    {app.getOutputType==='chart' &&
                      <DownloadCharts fname={downloadFilename} />
                    }
                  </Grid>
                </Grid>
                <Grid item>
                  {/* begin charts */}
                  {app.getOutputType==='chart' &&
                  <div id="waterdef-charts">

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
                        data={{}}
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
                  }
                  {/* end charts */}

                  {/* begin tables */}
                  {app.getOutputType==='table' && this.state.data_soil_parameters && this.state.data_soil_moisture && this.state.depth_top!==null && this.state.depth_bottom!==null &&
                    <DisplayTables
                      data_wd = {
                          WaterDeficitModel({
                              soilm:this.state.data_soil_moisture,
                              soilp:this.state.data_soil_parameters,
                              depthRangeTop:Math.floor(parseInt(this.convert_in_to_cm(this.state.depth_top),10)),
                              depthRangeBottom:Math.ceil(parseInt(this.convert_in_to_cm(this.state.depth_bottom),10)),
                              unitsOutput:this.state.units
                          })
                      }
                    />
                  }
                  {/* end tables */}
                </Grid>
              </Grid>
            </Grid>

            <WaterdefDoc />
          </div>
        );
    }
}

export default withStyles(styles)(WaterDefTool);
