///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
//import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend, Brush, ReferenceLine } from 'recharts';
import { ResponsiveContainer, AreaChart, LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//Components

// Styles
import '../../../../styles/WxCharts.css';

var app;

@inject('store') @observer
class LivestockIdxCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let dataForChart = app.livestock_getClimateSummary

        let formatXAxisForDate = (tickItem) => {
            let t = moment(tickItem)
            if (t.hour()===0) {
                return t.format('MMM D')
            } else {
                return t.format('HH:mm')
            }
        }

        let dataMax=-999;
        let dataMin=999;
        dataForChart.forEach(function (d) {
            if (isNaN(d.cattle)) { return };
            dataMax = (d.cattle>dataMax) ? d.cattle : dataMax
            dataMin = (d.cattle<dataMin) ? d.cattle : dataMin
        });

        //const dataMax = Math.max(...dataForChart.map(i => (i.cattle===NaN) ? 40 : i.cattle))
        //const dataMin = Math.min(...dataForChart.map(i => (i.cattle===NaN) ? 40 : i.cattle))
        //const dataMax = Math.max(...dataForChart.map(i => i.cattle))
        //const dataMin = Math.min(...dataForChart.map(i => i.cattle))
        const yMax = parseInt(Math.max(dataMax,150),10)
        const yMin = parseInt(Math.min(dataMin,30),10)

        return (
          <div id="wx-charts">

          <Grid item container justify="center" alignItems="center" spacing="8">
              <Grid item>
                 <Typography variant="h6">
                     Cattle Heat Index (Breathing Rate in Breaths/Min)
                 </Typography>
              </Grid>
          </Grid>

          <Grid container justify="left" alignItems="flexStart">
            <Grid item xs={12}>

      <ResponsiveContainer width="100%" height={300} className={""}>
        <AreaChart data={dataForChart} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisForDate}
            interval={11}
          />
          <YAxis tick={false} label={{ value: 'Cattle Heat Stress (Breaths/Min)', angle: -90, position:'insideLeft', offset: -100 }} domain={[yMin, yMax]}/>
          <Tooltip/>
          <ReferenceLine y={40} label={{position: "left", value:" 40 Normal", offset:-48}} stroke="black" isFront={true} />
          <ReferenceLine y={90} label={{position: "left", value:" 90 Alert", offset:-34}} stroke="yellow" isFront={true} />
          <ReferenceLine y={110} label={{position: "left", value:"110 Danger", offset:-48}} stroke="orange" isFront={true} />
          <ReferenceLine y={130} label={{position: "left", value:"130 Emergency", offset:-74}} stroke="red" isFront={true} />
          <Area type='monotone' name={'Cattle Heat Index'} dataKey='cattle' stroke='#D3D3D3' fill='#D3D3D3'/>
        </AreaChart>
      </ResponsiveContainer>
            </Grid>

                        <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
                          <Grid item>
                            <Typography variant="subtitle2">
                              Air Temperature
                            </Typography>
                          </Grid>
                        </Grid>

            <Grid item xs={12}>

      <ResponsiveContainer width="100%" height={100} className={(app.livestock_getVars['airtemp']) ? "" : "isHidden"}>
        <LineChart data={dataForChart} syncId="anyId"
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisForDate}
            interval={11}
          />
          <YAxis label={{ value: app.livestock_getVarUnits['airtemp_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Line type='monotone' name={app.livestock_getVarLabels['airtemp_label']} dataKey='avgt' stroke='#8884d8' fill='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
            </Grid>
                        <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
                          <Grid item>
                            <Typography variant="subtitle2">
                              Humidity
                            </Typography>
                          </Grid>
                        </Grid>
            <Grid item xs={12}>

      <ResponsiveContainer width="100%" height={100} className={(app.livestock_getVars['humidity']) ? "" : "isHidden"}>
        <LineChart data={dataForChart} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisForDate}
            interval={11}
          />
          <YAxis label={{ value: app.livestock_getVarUnits['humidity_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Line type='monotone' name={app.livestock_getVarLabels['humidity_label']} dataKey='humid' stroke='#82ca9d' fill='#82ca9d' />
        </LineChart>
      </ResponsiveContainer>
            </Grid>
                        <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
                          <Grid item>
                            <Typography variant="subtitle2">
                              Solar Radiation
                            </Typography>
                          </Grid>
                        </Grid>
            <Grid item xs={12}>

      <ResponsiveContainer width="100%" height={100} className={(app.livestock_getVars['solarrad']) ? "" : "isHidden"}>
        <AreaChart data={dataForChart} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisForDate}
            interval={11}
          />
          <YAxis label={{ value: app.livestock_getVarUnits['solarrad_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Area type='monotone' name={app.livestock_getVarLabels['solarrad_label']} dataKey='solar' stroke='#82ca9d' fill='#82ca9d' />
        </AreaChart>
      </ResponsiveContainer>
            </Grid>
                        <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
                          <Grid item>
                            <Typography variant="subtitle2">
                              Wind Speed
                            </Typography>
                          </Grid>
                        </Grid>
            <Grid item xs={12}>

      <ResponsiveContainer width="100%" height={100} className={(app.livestock_getVars['wind']) ? "" : "isHidden"}>
        <LineChart data={dataForChart} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisForDate}
            interval={11}
          />
          <YAxis label={{ value: app.livestock_getVarUnits['wind_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Line type='monotone' name={app.livestock_getVarLabels['wind_label']} dataKey='wind' stroke='#8884d8' fill='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
            </Grid>
        </Grid>
      </div>

        );

    }
}

export default LivestockIdxCharts;

