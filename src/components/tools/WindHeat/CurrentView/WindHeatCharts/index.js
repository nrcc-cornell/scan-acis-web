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
import '../../../../../styles/WindHeatCharts.css';

var app;

@inject('store') @observer
class WindHeatCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let dataForChart = JSON.parse(JSON.stringify(app.windheat_getClimateSummary));
        let typeToDisplay = app.windheat_getWindHeatType

        let formatXAxisForDate = (tickItem) => {
            let t = moment(tickItem)
            if (t.hour()===0) {
                return t.format('MMM D')
            } else {
                return t.format('HH:mm')
            }
        }

        let renderCustomTooltip = (props) => {
          const { payload, label } = props
          return (
              <div className="customized-tooltip-windheat">
                {
                    label
                }
                {
                    payload.map((entry,index) => {
                        const { color, value, name, dataKey, payload } = entry
                        if ((dataKey.slice(0,4) === 'fcst' && payload.fcstAvgt !== '--') || ((dataKey.slice(0,4) !== 'fcst' && payload.avgt !== '--'))) {
                          let style = {}
                          style = { color: color }
                          return (
                              <span key={index} className="tooltip-item">
                              <br/>
                              <span style={style}>{name} : </span>
                              <span>{value}</span>
                              </span>
                          )
                        } else {
                          return '';
                        }
                    })
                }
              </div>
          )
        }

        let downloadFilename = (app.getLocation) ?
            app.getLocation.name+'_'+typeToDisplay+'.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        return (
          <div id="windheat-charts">

          <Grid item container justifyContent="center" alignItems="center" spacing={1}>
            {typeToDisplay==='windchill' &&
              <Grid item>
                 <Typography variant="h5">
                  Wind Chill
                 </Typography>
              </Grid>
            }
            {typeToDisplay==='heatstress' &&
              <Grid item>
                 <Typography variant="h5">
                     Heat Stress Index
                 </Typography>
              </Grid>
            }
            <Grid item>
              <DownloadCharts fname={downloadFilename} />
            </Grid>
          </Grid>

          <Grid item container justifyContent="center" alignItems="center">
            <Grid item>
              <Typography variant="subtitle1">
                {(app.getLocation) ? app.getLocation.name+', '+app.getLocation.state : ''}
              </Typography>
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-start" alignItems="flex-start">
            {typeToDisplay==='windchill' &&
              <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={300} className={""}>
                  <AreaChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <defs>
                      <pattern id="verticalStripes" width="10" height="10" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="5" height="10" fill="#636363ff" />
                        <rect x="5" y="0" width="5" height="10" fill="transparent" />
                      </pattern>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      interval={11}
                    />
                    <YAxis tick={false} label={{ value: 'Wind Chill (°F)', angle: -90, position:'insideLeft', offset: -100 }} domain={[-100, 40]}/>
                    <Tooltip
                      content={renderCustomTooltip}
                    />
                    <ReferenceLine y={0} label={{position: "left", value:"0 ", offset:4, fontSize:12, fontFamily:"Roboto"}} stroke="black" isFront={true} />
                    <ReferenceLine y={-10} label={{position: "left", value:"-10 ", offset:4, fontSize:12, fontFamily:"Roboto"}} stroke="#A6D5FF" isFront={true} />
                    <ReferenceLine y={-10} label={{position: "insideBottomLeft", value:" Alert ", offset:0, fontFamily:"Roboto"}} stroke="#A6D5FF" isFront={true} />
                    <ReferenceLine y={-20} label={{position: "left", value:"-20 ", offset:4, fontSize:12, fontFamily:"Roboto"}} stroke="#5B73C2" isFront={true} />
                    <ReferenceLine y={-20} label={{position: "insideBottomLeft", value:" Danger ", offset:0, fontFamily:"Roboto"}} stroke="#5B73C2" isFront={true} />
                    <ReferenceLine y={-35} label={{position: "left", value:"-35 ", offset:4, fontSize:12, fontFamily:"Roboto"}} stroke="#613684" isFront={true} />
                    <ReferenceLine y={-35} label={{position: "insideBottomLeft", value:" Extreme Danger ", offset:0, fontFamily:"Roboto"}} stroke="#613684" isFront={true} />
                    <ReferenceLine y={-50} label={{position: "left", value:"-50 ", offset:4, fontSize:12, fontFamily:"Roboto"}} stroke="#4A005A" isFront={true} />
                    <ReferenceLine y={-50} label={{position: "insideBottomLeft", value:" Emergency ", offset:0, fontFamily:"Roboto"}} stroke="#4A005A" isFront={true} />
                    <Area type='monotone' name={'Wind Chill'} dataKey='windchill' stroke='#D3D3D3' fill='#D3D3D3'/>
                    <Area type='monotone' name={'Wind Chill Forecast'} dataKey='fcstWindchill' stroke='#636363ff' fill='url(#verticalStripes)'/>
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>
            }

            {typeToDisplay==='heatstress' &&
              <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={300} className={""}>
                  <AreaChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <defs>
                      <pattern id="verticalStripes" width="10" height="10" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="5" height="10" fill="#636363ff" />
                        <rect x="5" y="0" width="5" height="10" fill="transparent" />
                      </pattern>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      interval={11}
                    />
                    <YAxis tick={false} label={{ value: 'Heat Stress Index (°F)', angle: -90, position:'insideLeft', offset: -100 }} domain={[60, 150]}/>
                    <Tooltip
                      content={renderCustomTooltip}
                    />
                    <ReferenceLine y={80} label={{position: "left", value:"80 ", offset:4, fontSize:12, fontFamily:"Roboto"}} stroke="#FFFF99" isFront={true} />
                    <ReferenceLine y={80} label={{position: "insideBottomLeft", value:" Caution ", offset:0, fontSize:16, fontFamily:"Roboto"}} stroke="#FFFF99" isFront={true} />
                    <ReferenceLine y={90} label={{position: "left", value:"90 ", offset:4, fontSize:12, fontFamily:"Roboto"}} stroke="#FDD015" isFront={true} />
                    <ReferenceLine y={90} label={{position: "insideBottomLeft", value:" Extreme Caution ", offset:0, fontSize:16, fontFamily:"Roboto"}} stroke="#FDD015" isFront={true} />
                    <ReferenceLine y={103} label={{position: "left", value:"103 ", offset:4, fontSize:12, fontFamily:"Roboto"}} stroke="#FB6600" isFront={true} />
                    <ReferenceLine y={103} label={{position: "insideBottomLeft", value:" Danger ", offset:0, fontSize:16, fontFamily:"Roboto"}} stroke="#FB6600" isFront={true} />
                    <ReferenceLine y={125} label={{position: "left", value:"125 ", offset:4, fontSize:12, fontFamily:"Roboto"}} stroke="#CC0003" isFront={true} />
                    <ReferenceLine y={125} label={{position: "insideBottomLeft", value:" Extreme Danger ", offset:0, fontSize:16, fontFamily:"Roboto"}} stroke="#CC0003" isFront={true} />
                    <Area type='monotone' name={'Heat Stress Index'} dataKey='heatstress' stroke='#D3D3D3' fill='#D3D3D3'/>
                    <Area type='monotone' name={'Heat Stress Index Forecast'} dataKey='fcstHeatstress' stroke='#636363ff' fill='url(#verticalStripes)'/>
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>
            }

            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  Air Temperature
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <ResponsiveContainer width="100%" height={100} className={(app.windheat_getVars['airtemp']) ? "" : "isHidden"}>
                <LineChart data={dataForChart} syncId="anyId"
                      margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxisForDate}
                    interval={11}
                  />
                  <YAxis label={{ value: app.windheat_getVarUnits['airtemp_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                  <Tooltip
                    content={renderCustomTooltip}
                  />
                  <Line type='monotone' name={app.windheat_getVarLabels['airtemp_label']} dataKey='avgt' stroke='#8884d8' fill='#8884d8' />
                  <Line type='monotone' name={app.windheat_getVarLabels['airtemp_label'] + ' Forecast'} dataKey='fcstAvgt' stroke='#0e0885ff' fill='#0e0885ff' strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>

            {typeToDisplay === 'heatstress' ? (
              <React.Fragment>
                <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography variant="subtitle2">
                      Humidity
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <ResponsiveContainer width="100%" height={100} className={(app.windheat_getVars['humidity']) ? "" : "isHidden"}>
                    <LineChart data={dataForChart} syncId="anyId"
                          margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxisForDate}
                        interval={11}
                      />
                      <YAxis label={{ value: app.windheat_getVarUnits['humidity_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                      <Tooltip
                        content={renderCustomTooltip}
                      />
                      <Line type='monotone' name={app.windheat_getVarLabels['humidity_label']} dataKey='humid' stroke='#82ca9d' fill='#82ca9d' />
                      <Line type='monotone' name={app.windheat_getVarLabels['humidity_label'] + ' Forecast'} dataKey='fcstHumid' stroke='#0d632eff' fill='#0d632eff' strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
              </React.Fragment>
            ) : ('')
            }

            {typeToDisplay==='windchill' ? (
              <React.Fragment>
                <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography variant="subtitle2">
                      Wind Speed
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <ResponsiveContainer width="100%" height={100} className={(app.windheat_getVars['wind']) ? "" : "isHidden"}>
                    <LineChart data={dataForChart} syncId="anyId"
                          margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxisForDate}
                        interval={11}
                      />
                      <YAxis label={{ value: app.windheat_getVarUnits['wind_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                      <Tooltip
                        content={renderCustomTooltip}
                      />
                      <Line type='monotone' name={app.windheat_getVarLabels['wind_label']} dataKey='wind' stroke='#d88484ff' fill='#d88484ff' />
                      <Line type='monotone' name={app.windheat_getVarLabels['wind_label'] + ' Forecast'} dataKey='fcstWind' stroke='#8f1313ff' fill='#8f1313ff' strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
              </React.Fragment>
            ) : ('')
            }
          </Grid>
      </div>

        );

    }
}

export default WindHeatCharts;

