///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';

import LoadStationData from './LoadStationData';
import YearSelect from './YearSelect';
import DepthSelect from './DepthSelect';
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
        this.depths = [20,50,100]
        this.state = {
          //years: null,
          //year: null,
          years: [2016,2017,2018,2019],
          year: moment().year(),
          //depth: this.depths.slice(-1)[0],
          depth: this.depths[0],
          data_precip: null,
          data_soil_moisture: null,
          data_water_deficit: null,
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
                sm2 = (d[i][1]==='M' || parseFloat(d[i][1])<0.0) ? null : parseFloat(d[i][1]).toFixed(1)
                sm4 = (d[i][2]==='M' || parseFloat(d[i][2])<0.0) ? null : parseFloat(d[i][2]).toFixed(1)
                sm8 = (d[i][3]==='M' || parseFloat(d[i][3])<0.0) ? null : parseFloat(d[i][3]).toFixed(1)
                sm20 = (d[i][4]==='M' || parseFloat(d[i][4])<0.0) ? null : parseFloat(d[i][4]).toFixed(1)
                sm40 = (d[i][5]==='M' || parseFloat(d[i][5])<0.0) ? null : parseFloat(d[i][5]).toFixed(1)
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

    handleDepthChange = (e) => {
        this.setState({
          depth: e.target.value,
        })
    }

    render() {

        return (
          <div>
            <Grid item container direction="row" justify="flex-start" alignItems="flex-start">
              <Grid item>
              {this.state.year && this.state.years &&
                <YearSelect
                  value={this.state.year}
                  values={this.state.years}
                  onchange={this.handleYearChange}
                />
              }
              </Grid>
              <Grid item>
              {this.state.depth && this.depths &&
                <DepthSelect
                  value={this.state.depth}
                  values={this.depths}
                  onchange={this.handleDepthChange}
                />
              }
              </Grid>
            </Grid>
            <Grid item>
              {this.state.data_soil_moisture && this.state.depth &&
                <DisplayWaterDeficitChart
                  data={WaterDeficitModel({soilm:this.state.data_soil_moisture,depthLimit:this.state.depth})}
                  depth={this.state.depth}
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
