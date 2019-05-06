///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
//import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// to save charts in specific id
import Button from '@material-ui/core/Button';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

//Components
//import TimeFrameButtonGroup from '../TimeFrameButtonGroup'
import DownloadCharts from '../DownloadCharts'

// Styles
import '../../../../styles/WxCharts.css';

var app;

@inject('store') @observer
class WxCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

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

        // regular graphs
        if (!app.wxgraph_getExtSwitch) {

        return (
          <div id="wx-charts">
          <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
            <Grid item>
              <Typography variant="subtitle1">
                {superChartTitle}
              </Typography>
            </Grid>
            <Grid item>
              <DownloadCharts fname={downloadFilename} />
            </Grid>
          </Grid>
          <Grid container justify="center" alignItems="center">

            <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
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
                        label={{ value: app.wxgraph_getVarUnits['airtemp_units'], angle: -90, position:'insideLeft', offset: 10 }}
                        domain = {(app.wxgraph_getTimeFrame==='two_months') ? calcDomain(dataForChart,['avgt','mint','maxt'],[1,1],1) : calcDomain(dataForChart,['avgt'],[1,1],1)}
                    />
                    <Tooltip/>
                    {app.wxgraph_getTimeFrame==='two_months' && <Area type='monotone' name='Air Temp Range' dataKey='temprange' stroke='' fill='#D3D3D3' />}
                    <Line type='monotone' name='Air Temp Ave' dataKey='avgt' stroke='#8884d8' fill='#8884d8'/>
                  </ComposedChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
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
                        label={{ value: app.wxgraph_getVarUnits['rainfall_units'], angle: -90, position:'insideBottomLeft', offset: 10 }}
                        domain = {[0,'auto']}
                    />
                    <Tooltip/>
                    <Bar name='Total Precip' dataKey="pcpn" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('soiltemp','Soil Temperature')}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={200} className={(app.wxgraph_getVars['soiltemp']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['soilt2in','soilt4in','soilt8in','soilt20in','soilt40in']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['soiltemp_units'], angle: -90, position:'insideLeft', offset: 10 }}
                        domain = {calcDomain(dataForChart,['soilt40in','soilt20in','soilt8in','soilt4in','soilt2in'],[1,1],1)}
                    />
                    <Tooltip/>
                    <Legend verticalAlign="top" height={36}/>
                    <Line type='monotone' name='SoilT @ 40"' dataKey='soilt40in' dot={false} stroke='#581845' />
                    <Line type='monotone' name='SoilT @ 20"' dataKey='soilt20in' dot={false} stroke='#900C3F' />
                    <Line type='monotone' name='SoilT @ 8"' dataKey='soilt8in' dot={false} stroke='#C70039' />
                    <Line type='monotone' name='SoilT @ 4"' dataKey='soilt4in' dot={false} stroke='#FF5733' />
                    <Line type='monotone' name='SoilT @ 2"' dataKey='soilt2in' dot={false} stroke='#FFC300' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('soilmoist','Soil Moisture')}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={200} className={(app.wxgraph_getVars['soilmoist']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['soilm2in','soilm4in','soilm8in','soilm20in','soilm40in']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['soilmoist_units'], angle: -90, position:'insideLeft', offset: 10 }}
                        domain = {calcDomain(dataForChart,['soilm40in','soilm20in','soilm8in','soilm4in','soilm2in'],[1,1],1)}
                    />
                    <Tooltip/>
                    <Legend verticalAlign="top" height={36}/>
                    <Line type='monotone' name='SoilM @ 40"' dataKey='soilm40in' dot={false} stroke='#134960' />
                    <Line type='monotone' name='SoilM @ 20"' dataKey='soilm20in' dot={false} stroke='#1A6180' />
                    <Line type='monotone' name='SoilM @ 8"' dataKey='soilm8in' dot={false} stroke='#2692BF' />
                    <Line type='monotone' name='SoilM @ 4"' dataKey='soilm4in' dot={false} stroke='#2DAADF' />
                    <Line type='monotone' name='SoilM @ 2"' dataKey='soilm2in' dot={false} stroke='#33C2FF' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('humidity',app.wxgraph_getVarLabels['humidity_label'])}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['humidity']) ? "" : "isHidden"}>
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
                        label={{ value: app.wxgraph_getVarUnits['humidity_units'], angle: -90, position:'insideLeft', offset: 10 }}
                        domain = {[0,100]}
                    />
                    <Tooltip/>
                    <Line type='monotone' name='Relative Humidity' dataKey='humid' stroke='#82ca9d' fill='#82ca9d' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
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
                        label={{ value: app.wxgraph_getVarUnits['solarrad_units'], angle: -90, position:'insideBottomLeft', offset: 10 }}
                        domain = {calcDomain(dataForChart,['solar'],[0,1],0)}
                    />
                    <Tooltip/>
                    <Area type='monotone' name='Solar Radiation' dataKey='solar' stroke='#82ca9d' fill='#82ca9d' />
                  </AreaChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('wind',app.wxgraph_getVarLabels['wind_label'])}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={160} className={(app.wxgraph_getVars['wind']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: createDataMessage(dataForChart,['windspdave','windspdmax']), offset: 30, angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis
                        label={{ value: app.wxgraph_getVarUnits['wind_units'], angle: -90, position:'insideLeft', offset: 10 }}
                        domain = {calcDomain(dataForChart,['windspdave','windspdmax'],[0,1],0)}
                    />
                    <Tooltip/>
                    <Legend verticalAlign="top" height={36}/>
                    <Line type='monotone' name='Wind Speed (ave)' dataKey='windspdave' stroke='#8884d8' />
                    <Line type='monotone' name='Wind Speed (max)' dataKey='windspdmax' dot={false} stroke='#000000' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('wind',app.wxgraph_getVarLabels['winddir_label'])}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={160} className={(app.wxgraph_getVars['wind']) ? "" : "isHidden"}>
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
                        label={{ value: app.wxgraph_getVarUnits['winddir_units'], angle: -90, position:'insideLeft', offset: 10 }}
                        domain = {calcDomain(dataForChart,['winddirave'],[0,1],0)}
                    />
                    <Tooltip/>
                    <Line type='monotone' name='Wind Direction' dataKey='winddirave' stroke='#8884d8' fill='#8884d8' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing="8">
              <Grid item>
                <Typography variant="subtitle2">
                  {createChartTitle('leafwet',app.wxgraph_getVarLabels['leafwet_label'])}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['leafwet']) ? "" : "isHidden"}>
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
                        label={{ value: app.wxgraph_getVarUnits['leafwet_units'], angle: -90, position:'insideLeft', offset: 10 }}
                        domain = {calcDomain(dataForChart,['leafwet'],[0,1],0)}
                    />
                    <Tooltip/>
                    <Line type='monotone' name='Leaf Wetness' dataKey='leafwet' stroke='#8884d8' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

          </Grid>
        </div>

        );

        // extreme graphs
        } else {

        return (
          <div id="wx-charts">
          <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
            <Grid item>
              <Typography variant="subtitle1">
                {superChartTitle}
              </Typography>
            </Grid>
            <Grid item>
              <DownloadCharts fname={downloadFilename} />
            </Grid>
          </Grid>
          <Grid container justify="left" alignItems="flexStart">

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['airtemp']) ? "" : "isHidden"}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: 'Number of days > 100°F', angle: 0, position: 'top' }}
                      interval={'preserveEnd'}
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name="Count > 100°F" dataKey="cnt_t_gt_100" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['rainfall']) ? "" : "isHidden"}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: 'Number of days > 90°F', angle: 0, position: 'top' }}
                      interval={'preserveEnd'}
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name="Count > 90°F" dataKey="cnt_t_gt_90" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['soiltemp']) ? "" : "isHidden"}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: 'Number of days > 80°F', angle: 0, position: 'top' }}
                      interval={'preserveEnd'}
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name="Count > 80°F" dataKey="cnt_t_gt_80" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['soilmoist']) ? "" : "isHidden"}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: 'Number of days > 4 inches', angle: 0, position: 'top' }}
                      interval={'preserveEnd'}
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name="Count > 4 inches" dataKey="cnt_p_gt_4" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['humidity']) ? "" : "isHidden"}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: 'Number of days > 3 inches', angle: 0, position: 'top' }}
                      interval={'preserveEnd'}
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name="Count > 3 inches" dataKey="cnt_p_gt_3" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['solarrad']) ? "" : "isHidden"}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: 'Number of days > 2 inches', angle: 0, position: 'top' }}
                      interval={'preserveEnd'}
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name="Count > 2 inches" dataKey="cnt_p_gt_2" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['wind']) ? "" : "isHidden"}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: 'Number of days > 1 inch', angle: 0, position: 'top' }}
                      interval={'preserveEnd'}
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name="Count > 1 inch" dataKey="cnt_p_gt_1" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

          </Grid>
        </div>

        );

        }

    }
}

export default WxCharts;

