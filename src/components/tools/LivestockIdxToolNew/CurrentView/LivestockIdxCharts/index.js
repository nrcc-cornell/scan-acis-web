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
import DownloadCharts from '../../DownloadCharts'

// Styles
import '../../../../../styles/WxCharts.css';

var app;

@inject('store') @observer
class LivestockIdxCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let dataForChart = app.livestock_getClimateSummary
        let typeToDisplay = app.livestock_getLivestockType

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
            if (!d[typeToDisplay]) { return };
            dataMax = (d[typeToDisplay]>dataMax) ? d[typeToDisplay] : dataMax
            dataMin = (d[typeToDisplay]<dataMin) ? d[typeToDisplay] : dataMin
        });

        const yMax = parseInt(Math.max(dataMax,150),10)
        const yMin = parseInt(Math.min(dataMin,30),10)

        let downloadFilename = (app.getLocation) ?
            app.getLocation.name+'_'+typeToDisplay+'.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        return (
          <div id="wx-charts">

          <Grid item container justify="center" alignItems="center" spacing={1}>
            {typeToDisplay==='cattle' &&
              <Grid item>
                 <Typography variant="h5">
                     Cattle Heat Index (Breathing Rate in Breaths/Min)
                 </Typography>
              </Grid>
            }
            {typeToDisplay==='cow' &&
              <Grid item>
                 <Typography variant="h5">
                     Dairy Cow Heat Index (THI)
                 </Typography>
              </Grid>
            }
            {typeToDisplay==='biganimal' &&
              <Grid item>
                 <Typography variant="h5">
                     Big Animal Heat Index (cattle, bison, sheep, goats, etc)
                 </Typography>
              </Grid>
            }
            {typeToDisplay==='smallanimal' &&
              <Grid item>
                 <Typography variant="h5">
                     Small Animal Heat Index (rabbits, poultry, etc)
                 </Typography>
              </Grid>
            }
            <Grid item>
              <DownloadCharts fname={downloadFilename} />
            </Grid>
          </Grid>

          <Grid item container justify="center" alignItems="center">
              <Grid item>
                 <Typography variant="subtitle1">
                     {(app.getLocation) ? app.getLocation.name+', '+app.getLocation.state : ''}
                 </Typography>
              </Grid>
          </Grid>

          <Grid container justify="flex-start" alignItems="flex-start">

        {typeToDisplay==='cattle' &&

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

        }

        {typeToDisplay==='cow' &&

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
          <YAxis tick={false} label={{ value: 'Dairy Cow Heat Stress (THI)', angle: -90, position:'insideLeft', offset: -100 }} domain={[60, 90]}/>
          <Tooltip/>
          <ReferenceLine y={68} label={{position: "left", value:" 68 Mild Discomfort", offset:-110}} stroke="black" isFront={true} />
          <ReferenceLine y={72} label={{position: "left", value:" 72 Discomfort", offset:-74}} stroke="yellow" isFront={true} />
          <ReferenceLine y={75} label={{position: "left", value:" 75 Alert", offset:-34}} stroke="orange" isFront={true} />
          <ReferenceLine y={79} label={{position: "left", value:" 79 Danger", offset:-48}} stroke="brown" isFront={true} />
          <ReferenceLine y={84} label={{position: "left", value:" 84 Emergency", offset:-74}} stroke="red" isFront={true} />
          <Area type='monotone' name={'Dairy Cow Heat Index'} dataKey='cow' stroke='#D3D3D3' fill='#D3D3D3'/>
        </AreaChart>
      </ResponsiveContainer>
            </Grid>

        }

        {typeToDisplay==='biganimal' &&

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
          <YAxis tick={false} label={{ value: 'Big Animal Heat Stress (THI)', angle: -90, position:'insideLeft', offset: -100 }} domain={[70, 84]}/>
          <Tooltip/>
          <ReferenceLine y={72} label={{position: "left", value:" 72 Moderate Heat Stress", offset:-140}} stroke="yellow" isFront={true} />
          <ReferenceLine y={74} label={{position: "left", value:" 74 Severe Heat Stress", offset:-122}} stroke="orange" isFront={true} />
          <ReferenceLine y={78} label={{position: "left", value:" 78 Very Severe Heat Stress", offset:-156}} stroke="brown" isFront={true} />
          <Area type='monotone' name={'Big Animal Heat Index'} dataKey='biganimal' stroke='#D3D3D3' fill='#D3D3D3'/>
        </AreaChart>
      </ResponsiveContainer>
            </Grid>

        }

        {typeToDisplay==='smallanimal' &&

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
          <YAxis tick={false} label={{ value: 'Big Animal Heat Stress (THI)', angle: -90, position:'insideLeft', offset: -100 }} domain={[80, 90]}/>
          <Tooltip/>
          <ReferenceLine y={82} label={{position: "left", value:" 82 Moderate Heat Stress", offset:-140}} stroke="yellow" isFront={true} />
          <ReferenceLine y={84} label={{position: "left", value:" 84 Severe Heat Stress", offset:-122}} stroke="orange" isFront={true} />
          <ReferenceLine y={86} label={{position: "left", value:" 86 Very Severe Heat Stress", offset:-156}} stroke="brown" isFront={true} />
          <Area type='monotone' name={'Small Animal Heat Index'} dataKey='smallanimal' stroke='#D3D3D3' fill='#D3D3D3'/>
        </AreaChart>
      </ResponsiveContainer>
            </Grid>

        }

                        <Grid item container direction="row" justify="center" alignItems="center" spacing={1}>
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
                        <Grid item container direction="row" justify="center" alignItems="center" spacing={1}>
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

        {typeToDisplay==='cattle' &&

                        <Grid item container direction="row" justify="center" alignItems="center" spacing={1}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Solar Radiation
                            </Typography>
                          </Grid>
                        </Grid>
        }

        {typeToDisplay==='cattle' &&

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

        }

        {typeToDisplay==='cattle' &&

                        <Grid item container direction="row" justify="center" alignItems="center" spacing={1}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Wind Speed
                            </Typography>
                          </Grid>
                        </Grid>

        }

        {typeToDisplay==='cattle' &&

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

        }

        </Grid>
      </div>

        );

    }
}

export default LivestockIdxCharts;

