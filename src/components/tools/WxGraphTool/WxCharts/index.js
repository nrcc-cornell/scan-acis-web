///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
//import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend, Brush, ReferenceLine } from 'recharts';
import { ResponsiveContainer, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Grid from '@material-ui/core/Grid';

//Components
//import TimeFrameButtonGroup from '../TimeFrameButtonGroup'

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

        //let data = app.wxgraph_getClimateSummary
        let dataForChart
        if (app.wxgraph_getTimeFrame==='por' && app.wxgraph_getExtSwitch) {
            dataForChart = app.wxgraph_getClimateSummary['extremes']
        } else {
            dataForChart = app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame]
        }

        // regular graphs
        if (!app.wxgraph_getExtSwitch) {

        return (
          <div id="wx-charts">
          <Grid container justify="left" alignItems="flexStart">

            <Grid item xs={12} md={9}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['airtemp']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: app.wxgraph_getVarLabels['airtemp_label'], angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis label={{ value: app.wxgraph_getVarUnits['airtemp_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Line type='monotone' name={app.wxgraph_getVarLabels['airtemp_label']} dataKey='avgt' stroke='#8884d8' fill='#8884d8' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} md={9}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['rainfall']) ? "" : "isHidden"}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: app.wxgraph_getVarLabels['rainfall_label'], angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis label={{ value: app.wxgraph_getVarUnits['rainfall_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name={app.wxgraph_getVarLabels['rainfall_label']} dataKey="pcpn" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} md={9}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['soiltemp']) ? "" : "isHidden"}>
                  <AreaChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: app.wxgraph_getVarLabels['soiltemp_label'], angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis label={{ value: app.wxgraph_getVarUnits['soiltemp_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Area type='monotone' name={app.wxgraph_getVarLabels['soiltemp_label']} dataKey='soilt' stroke='#82ca9d' fill='#82ca9d' />
                  </AreaChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} md={9}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['soilmoist']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: app.wxgraph_getVarLabels['soilmoist_label'], angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis label={{ value: app.wxgraph_getVarUnits['soilmoist_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Line type='monotone' name={app.wxgraph_getVarLabels['soilmoist_label']} dataKey='soilm' stroke='#8884d8' fill='#8884d8' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} md={9}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['humidity']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: app.wxgraph_getVarLabels['humidity_label'], angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis label={{ value: app.wxgraph_getVarUnits['humidity_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Line type='monotone' name={app.wxgraph_getVarLabels['humidity_label']} dataKey='humid' stroke='#82ca9d' fill='#82ca9d' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} md={9}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['solarrad']) ? "" : "isHidden"}>
                  <AreaChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: app.wxgraph_getVarLabels['solarrad_label'], angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis label={{ value: app.wxgraph_getVarUnits['solarrad_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Area type='monotone' name={app.wxgraph_getVarLabels['solarrad_label']} dataKey='solar' stroke='#82ca9d' fill='#82ca9d' />
                  </AreaChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} md={9}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['wind']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: app.wxgraph_getVarLabels['wind_label'], angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis label={{ value: app.wxgraph_getVarUnits['wind_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Line type='monotone' name={app.wxgraph_getVarLabels['wind_label']} dataKey='wind' stroke='#8884d8' fill='#8884d8' />
                  </LineChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} md={9}>
                <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['leafwet']) ? "" : "isHidden"}>
                  <LineChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      label={{ value: app.wxgraph_getVarLabels['leafwet_label'], angle: 0, position: 'top' }}
                      interval={(app.wxgraph_getTimeFrame==='two_days') ? 11 : 'preserveEnd'}
                    />
                    <YAxis label={{ value: app.wxgraph_getVarUnits['leafwet_units'], angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Line type='monotone' name={app.wxgraph_getVarLabels['leafwet_label']} dataKey='leafwet' stroke='#82ca9d' fill='#82ca9d' />
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
          <Grid container justify="left" alignItems="flexStart">

            <Grid item xs={12} md={9}>
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

            <Grid item xs={12} md={9}>
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

            <Grid item xs={12} md={9}>
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

            <Grid item xs={12} md={9}>
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

            <Grid item xs={12} md={9}>
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

            <Grid item xs={12} md={9}>
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

            <Grid item xs={12} md={9}>
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

