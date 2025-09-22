///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
//import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Surface, Symbols } from 'recharts';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// to save charts in specific id
//import Button from '@material-ui/core/Button';
//import domtoimage from 'dom-to-image';
//import { saveAs } from 'file-saver';

//Components
//import TimeFrameButtonGroup from '../TimeFrameButtonGroup'
import DownloadCharts from '../../DownloadCharts'

// Styles
import '../../../../../styles/WxCharts.css';

var app;

@inject('store') @observer
class WxCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.state = {
            disabled: ['soilt40in','soilt2in','soilm40in','soilm2in'],
        }
    }

    onClickLegend = (dataKey) => {
        // dataKey : key in legend of chart
        if (this.state.disabled.includes(dataKey)) {
          this.setState({
            disabled: this.state.disabled.filter(obj => obj !== dataKey)
          });
        } else {
          this.setState({ disabled: this.state.disabled.concat([dataKey]) });
        }
    }

    getChartInfo = (type) => {
        if (type==='soilt') {
            return {
                'typeLabel':'Soil Temperature',
                'dataInfo': [
                    {'key':'soilt2in','label':'SoilT @ 2"','color':'#FFC300'},
                    {'key':'soilt4in','label':'SoilT @ 4"','color':'#FF5733'},
                    {'key':'soilt8in','label':'SoilT @ 8"','color':'#C70039'},
                    {'key':'soilt20in','label':'SoilT @ 20"','color':'#900C3F'},
                    {'key':'soilt40in','label':'SoilT @ 40"','color':'#581845'},
                ]
            }
        } else if (type==='soilm') {
            return {
                'typeLabel':'Soil Moisture',
                'dataInfo': [
                    {'key':'soilm2in','label':'SoilM @ 2"','color':'#33C2FF'},
                    {'key':'soilm4in','label':'SoilM @ 4"','color':'#2DAADF'},
                    {'key':'soilm8in','label':'SoilM @ 8"','color':'#2692BF'},
                    {'key':'soilm20in','label':'SoilM @ 20"','color':'#1A6180'},
                    {'key':'soilm40in','label':'SoilM @ 40"','color':'#134960'},
                    //{'key':'soilm2in','label':'SoilM @ 2"','color':'#006837'},
                    //{'key':'soilm4in','label':'SoilM @ 4"','color':'#31a354'},
                    //{'key':'soilm8in','label':'SoilM @ 8"','color':'#41b6c4'},
                    //{'key':'soilm20in','label':'SoilM @ 20"','color':'#2c7fb8'},
                    //{'key':'soilm40in','label':'SoilM @ 40"','color':'#253494'},
                ]
            }
        } else if (type==='wind') {
            return {
                'typeLabel':'Wind Speed',
                'dataInfo': [
                    {'key':'windspdave','label':'Wind Speed (ave)','color':'#33C2FF'},
                    {'key':'windspdmax','label':'Wind Speed (max)','color':'#134960'},
                ]
            }
        } else {
            return []
        }
    }

    renderCustomTooltip = (props) => {
      const { payload, label } = props
      return (
          <div className="customized-tooltip-wxgraph">
            {
                label
            }
            {
                payload.map((entry,index) => {
                    const { dataKey, color, value, name } = entry
                    let style = {}
                    style = { color: color }
                    if (dataKey==='temprange') {
                      return (
                        <span key={index} className="tooltip-item">
                        <br/>
                        <span style={style}>{name} : </span>
                        <span>{(isNaN(value[0])) ? '--' : value[0]} - {(isNaN(value[1])) ? '--' : value[1]}</span>
                        </span>
                      )
                    } else {
                      return (
                        <span key={index} className="tooltip-item">
                        <br/>
                        <span style={style}>{name} : </span>
                        <span>{(isNaN(value)) ? '--' : value}</span>
                        </span>
                      )
                    }
                })
            }
          </div>
      )
    }

    renderCustomizedLegend = ({ payload }) => {
        return (
            <div className="customized-legend-wxgraph">
              {payload.map(entry => {
                const { dataKey, dataLabel, color } = entry;
                const active = this.state.disabled.includes(dataKey);
                const style = {
                  marginRight: 10,
                  //color: active ? "#AAA" : "#000"
                  color: active ? "#AAA" : color
                };

                return (
                  <span
                    className="legend-item-wxgraph"
                    onClick={() => this.onClickLegend(dataKey)}
                    align="center"
                    style={style}
                  >
                    <Surface width={10} height={10} viewBox="0 0 10 10">
                      <Symbols cx={5} cy={5} type="square" size={100} fill={color} />
                      {active && (
                        <Symbols
                          cx={5}
                          cy={5}
                          type="square"
                          size={25}
                          fill={"#FFF"}
                        />
                      )}
                    </Surface>
                    <span>&nbsp;{dataLabel}</span>
                  </span>
                );
              })}
            </div>
        );
    };

    render() {

        let formatXAxisForDate = (tickItem) => {
            let t = moment(tickItem)
            if (app.wxgraph_getTimeFrame==='two_days') {
                if (t.hour()===0) {
                    return t.format('MMM D')
                } else {
                    return t.format('HH:mm')
                }
            } else if (app.wxgraph_getTimeFrame==='two_months') {
                return moment(tickItem).format('MMM D')
            } else if (app.wxgraph_getTimeFrame==='two_years') {
                return moment(tickItem).format('MMM \'YY')
            } else if (app.wxgraph_getTimeFrame==='por') {
                return moment(tickItem).add(1,'days').format('YYYY')
            } else {
                return moment(tickItem).format('MMM D')
            }
        }

        let calcDomain = (data,keys,apply,buffer) => {
            // calculate the data extremes, used in recharts domain
            // data: array of data (array of dictionaries)
            // keys: keys to determine collective min and max (array of strings)
            // apply: which extreme should be calculated? [1,1]: both, [0,1]: max only, [1,0]: min only
            // buffer: should max/min be buffered for better appearance? (boolean)
            let minValue, maxValue
            let values = []
            keys.forEach(function (key) {
                data.forEach(function (d) {
                    if (d[key] || d[key]===0.0) { values.push(d[key]) }
                })
            })
            if (apply[0]) {
                minValue = Math.min(...values)
                minValue = (minValue || minValue===0.0) ? (buffer) ? minValue-1 : minValue : 'auto'
            } else {
                minValue = 'auto'
            }
            if (apply[1]) {
                maxValue = Math.max(...values)
                maxValue = (maxValue || maxValue===0.0) ? (buffer) ? maxValue+1 : maxValue : 'auto'
            } else {
                maxValue = 'auto'
            }
            return [minValue, maxValue]
        }

        //let data = app.wxgraph_getClimateSummary
        let dataForChart
        if (app.wxgraph_getTimeFrame==='por' && app.wxgraph_getExtSwitch) {
            dataForChart = app.wxgraph_getClimateSummary['extremes']
        } else {
            dataForChart = app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame]
        }

        // If there is not valid data for a variable, display message
        let createDataMessage = (dataSrc,kList) => {
            let dataMessage="No Data Available"
            kList.forEach(function (k) {
                dataSrc.forEach(function (d) {
                    if (d[k]) { dataMessage="" }
                });
            });
            return dataMessage
        }

        let createTempRange = (dataSrc) => {
            // create new data object with 'temprange' dataKey
            let rangeData = []
            dataSrc.forEach(function (d) {
                rangeData.push({
                    'date':d['date'],
                    'avgt':d['avgt'],
                    'maxt':d['maxt'],
                    'mint':d['mint'],
                    'temprange':[d['mint'],d['maxt']]
                })
            })
            return rangeData
        }

        let createChartTitle = (varName,text) => {
            let title = (app.wxgraph_getVars[varName]) ? text : ""
            return title
        }

        let firstDate = (app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame] && app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame][0]) ?
            app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame][0]['date'] :
            ''
        let lastDate = (app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame] && app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame][0]) ?
            app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame][app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame].length-1]['date'] :
            ''

        let superChartTitle = (app.getLocation) ?
            //'Data for '+app.getLocation.name+', '+app.getLocation.state+', ending '+app.getGrapherDate.format('MM/DD/YYYY') :
            app.getLocation.name+', '+app.getLocation.state+', from '+firstDate+' to '+lastDate :
            'Loading Data ...'

        let downloadFilename = (app.getLocation) ?
            app.getLocation.name+'_'+firstDate+'_'+lastDate+'.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        let chartInfo_soilt = this.getChartInfo('soilt')
        let chartInfo_soilm = this.getChartInfo('soilm')
        let chartInfo_wind = this.getChartInfo('wind')

        return (
          <div id="wx-charts">
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="subtitle1">
                {superChartTitle}
              </Typography>
            </Grid>
            <Grid item>
              <DownloadCharts fname={downloadFilename} />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" alignItems="center">

            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('airtemp','Air Temperature')}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={160} className={(app.wxgraph_getVars['airtemp']) ? "" : "isHidden"}>
                  <ComposedChart data={createTempRange(dataForChart)} syncId="anyId"
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['avgt']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['airtemp_units'], angle: -90, position:'insideLeft', offset: 25 }}
                        domain = {(app.wxgraph_getTimeFrame==='two_months') ? calcDomain(dataForChart,['avgt','mint','maxt'],[1,1],1) : calcDomain(dataForChart,['avgt'],[1,1],1)}
                    />
                    <Tooltip
                        content={this.renderCustomTooltip}
                    />
                    {app.wxgraph_getTimeFrame==='two_months' && <Area type='monotone' name='Air Temp Range' dataKey='temprange' stroke='' fill='#D3D3D3' />}
                    <Line type='monotone' name='Air Temp Ave' dataKey='avgt' stroke='#8884d8' fill='#8884d8'/>
                  </ComposedChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('rainfall','Total Precipitation')}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['rainfall']) ? "" : "isHidden"}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['pcpn']), offset:30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['rainfall_units'], angle: -90, position:'insideBottomLeft', offset: 25 }}
                        domain = {[0,'auto']}
                    />
                    <Tooltip
                        content={this.renderCustomTooltip}
                    />
                    <Bar name='Total Precip' dataKey="pcpn" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('soiltemp','Soil Temperature')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption">
                  {createChartTitle('soiltemp','(click legend to toggle depths)')}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={200} className={(app.wxgraph_getVars['soiltemp']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    {chartInfo_soilt.dataInfo && this.state.disabled &&
                        chartInfo_soilt.dataInfo
                          .filter(info => !this.state.disabled.includes(info.key))
                          .map(info =>
                            <Line type='monotone' dot={false} name={info.label} key={info.key} dataKey={info.key} stroke={info.color} />
                          )
                    }
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['soilt2in','soilt4in','soilt8in','soilt20in','soilt40in']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['soiltemp_units'], angle: -90, position:'insideLeft', offset: 25 }}
                        domain = {calcDomain(dataForChart,['soilt40in','soilt20in','soilt8in','soilt4in','soilt2in'],[1,1],1)}
                    />
                    <Tooltip
                        content={this.renderCustomTooltip}
                    />
                    {chartInfo_soilt.dataInfo && this.state.disabled &&
                      <Legend
                        verticalAlign="top"
                        height={36}
                        payload={chartInfo_soilt.dataInfo.map(info => ({
                          dataKey: info.key,
                          dataLabel: info.label,
                          color: info.color
                        }))}
                        content={this.renderCustomizedLegend}
                      />
                    }
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('soilmoist','Soil Moisture')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption">
                  {createChartTitle('soilmoist','(click legend to toggle depths)')}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={200} className={(app.wxgraph_getVars['soilmoist']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    {chartInfo_soilm.dataInfo && this.state.disabled &&
                        chartInfo_soilm.dataInfo
                          .filter(info => !this.state.disabled.includes(info.key))
                          .map(info =>
                            <Line type='monotone' dot={false} name={info.label} key={info.key} dataKey={info.key} stroke={info.color} />
                          )
                    }
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['soilm2in','soilm4in','soilm8in','soilm20in','soilm40in']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['soilmoist_units'], angle: -90, position:'insideLeft', offset: 25 }}
                        domain = {calcDomain(dataForChart,['soilm40in','soilm20in','soilm8in','soilm4in','soilm2in'],[1,1],1)}
                    />
                    <Tooltip
                        content={this.renderCustomTooltip}
                    />
                    {chartInfo_soilm.dataInfo && this.state.disabled &&
                      <Legend
                        verticalAlign="top"
                        height={36}
                        payload={chartInfo_soilm.dataInfo.map(info => ({
                          dataKey: info.key,
                          dataLabel: info.label,
                          color: info.color
                        }))}
                        content={this.renderCustomizedLegend}
                      />
                    }
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            {app.wxgraph_getVars['humidity'] && app.wxgraph_getTimeFrame==='two_days' &&
            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('humidity',app.wxgraph_getVarLabels['humidity_label'])}
                </Typography>
              </Grid>
            </Grid>
            }

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['humidity'] && app.wxgraph_getTimeFrame==='two_days') ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['humid']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['humidity_units'], angle: -90, position:'insideLeft', offset: 25 }}
                        domain = {[0,100]}
                    />
                    <Tooltip
                        content={this.renderCustomTooltip}
                    />
                    <Line type='monotone' name='Relative Humidity' dataKey='humid' stroke='#82ca9d' fill='#82ca9d' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('solarrad',app.wxgraph_getVarLabels['solarrad_label'])}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['solarrad']) ? "" : "isHidden"}>
                  <AreaChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['solar']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['solarrad_units'], angle: -90, position:'insideBottomLeft', offset: 25 }}
                        domain = {calcDomain(dataForChart,['solar'],[1,1],0)}
                    />
                    <Tooltip
                        content={this.renderCustomTooltip}
                    />
                    <Area type='monotone' name='Solar Radiation' dataKey='solar' stroke='#82ca9d' fill='#82ca9d' />
                  </AreaChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('wind',app.wxgraph_getVarLabels['wind_label'])}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption">
                  {createChartTitle('wind','(click legend to toggle variables)')}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={160} className={(app.wxgraph_getVars['wind']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    {chartInfo_wind.dataInfo && this.state.disabled &&
                        chartInfo_wind.dataInfo
                          .filter(info => !this.state.disabled.includes(info.key))
                          .map(info =>
                            <Line type='monotone' dot={false} name={info.label} key={info.key} dataKey={info.key} stroke={info.color} />
                          )
                    }
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['windspdave','windspdmax']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['wind_units'], angle: -90, position:'insideLeft', offset: 25 }}
                        domain = {calcDomain(dataForChart,['windspdave','windspdmax'],[1,1],0)}
                    />
                    <Tooltip
                        content={this.renderCustomTooltip}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        payload={chartInfo_wind.dataInfo.map(info => ({
                          dataKey: info.key,
                          dataLabel: info.label,
                          color: info.color
                        }))}
                        content={this.renderCustomizedLegend}
                    />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            {app.wxgraph_getVars['winddir'] && app.wxgraph_getTimeFrame==='two_days' &&
            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('winddir',app.wxgraph_getVarLabels['winddir_label'])}
                </Typography>
              </Grid>
            </Grid>
            }

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={160} className={(app.wxgraph_getVars['winddir'] && app.wxgraph_getTimeFrame==='two_days') ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['winddirave']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['winddir_units'], angle: -90, position:'insideLeft', offset: 25 }}
                        domain = {calcDomain(dataForChart,['winddirave'],[1,1],0)}
                    />
                    <Tooltip
                        content={this.renderCustomTooltip}
                    />
                    <Line type='monotone' name='Wind Direction' dataKey='winddirave' stroke='#8884d8' fill='#8884d8' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            {app.wxgraph_getVars['leafwet'] && app.wxgraph_getTimeFrame==='two_days' && app.getLocation.sid.split(' ')[1]==='19' &&
            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('leafwet',app.wxgraph_getVarLabels['leafwet_label'])}
                </Typography>
              </Grid>
            </Grid>
            }

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['leafwet'] && app.wxgraph_getTimeFrame==='two_days' && app.getLocation.sid.split(' ')[1]==='19') ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['leafwet']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['leafwet_units'], angle: -90, position:'insideLeft', offset: 25 }}
                        domain = {calcDomain(dataForChart,['leafwet'],[1,1],0)}
                    />
                    <Tooltip
                        content={this.renderCustomTooltip}
                    />
                    <Line type='monotone' name='Leaf Wetness' dataKey='leafwet' stroke='#8884d8' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

          </Grid>
        </div>

        );

    }
}

export default WxCharts;

