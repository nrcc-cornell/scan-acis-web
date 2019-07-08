///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
          years: [2016,2017,2018,2019],
          year: moment().year(),
          depth_top: 0, // inches
          depth_bottom: 12, // inches
          data_precip: null,
          data_soil_moisture: null,
          data_soil_parameters: null,
          data_water_deficit: null,
          units: 'inches', //cm or inches
        }
    }

    componentDidMount() {
        LoadStationData({sid:this.props.station, period:[this.state.year.toString()+'-01-01',this.state.year.toString()+'-12-31']})
          .then(response => {
            this.setState({
              data_soil_moisture: this.formatDataForHighcharts(response,'soilm'),
              data_precip: this.formatDataForHighcharts(response,'precip'),
            })
          });
        LoadSoilParameters({sid:this.props.station})
          .then(response => {
            this.setState({
              data_soil_parameters: response,
            })
          });
    }

    componentDidUpdate(prevProps,prevState) {
      if (prevState.year!==this.state.year ||
          prevProps.station!==this.props.station) {
        LoadStationData({sid:this.props.station, period:[this.state.year.toString()+'-01-01',this.state.year.toString()+'-12-31']})
          .then(response => {
            this.setState({
              data_soil_moisture: this.formatDataForHighcharts(response,'soilm'),
              data_precip: this.formatDataForHighcharts(response,'precip'),
            })
          });
      }
      if (prevProps.station!==this.props.station) {
        LoadSoilParameters({sid:this.props.station})
          .then(response => {
            this.setState({
              data_soil_parameters: response,
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
        if (v==='precip') {
            for (i=0; i<d.length; i++) {
                prcp = (d[i][1]==='M' || parseFloat(d[i][1])<0.0) ? null : ((d[i][1]==='T') ? 0.00 : parseFloat(d[i][1])).toFixed(2)
                oseries.push([moment.utc(d[i][0],'YYYY-MM-DD').valueOf(),parseFloat(d[i][1])])
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

    convert_in_to_cm = (v) => { return v*2.54 }

    render() {

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
                />
              }
              {(!this.state.data_soil_parameters || !this.state.data_soil_moisture || this.state.depth_top===null || this.state.depth_bottom===null) &&
                <DisplayWaterDeficitChart
                  data={[]}
                  depthRangeTop={this.state.depth_top}
                  depthRangeBottom={this.state.depth_bottom}
                  units={this.state.units}
                />
              }
            </Grid>
            <Grid item>
              {this.state.data_soil_moisture &&
                <DisplaySoilMoistureChart
                  data={this.state.data_soil_moisture}
                />
              }
            </Grid>
            <Grid item>
              {this.state.data_precip &&
                <DisplayPrecipChart
                  data={this.state.data_precip}
                />
              }
            </Grid>
          </div>
        );
    }
}

export default WaterDefTool;
