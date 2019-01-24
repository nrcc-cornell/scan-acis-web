///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
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

    const renderCustomTooltip = (props) => {
      const { payload, label } = props
      return (
          <div className="customized-tooltip">
            {
                moment(label,"YYYY-MM-DD").format("MMM D, YYYY")
            }
            {
                payload.map((entry) => {
                    const { dataKey, color, value, name } = entry
                    let style = {}
                    style = { color: color }
                    return (
                        <span className="tooltip-item">
                        <br/>
                        <span style={style}>{name} : </span>
                        <span>{(isNaN(value)) ? '--' : value}</span>
                        </span>
                    )
                })
            }
          </div>
      )
    }

        let formatXAxisForDate = (tickItem) => {
            if (app.wxgraph_getTimeFrame==='two_hours') {
                return moment(tickItem).format('MMM D')
            } else if (app.wxgraph_getTimeFrame==='two_months') {
                return moment(tickItem).format('MMM D')
            } else if (app.wxgraph_getTimeFrame==='two_years') {
                return moment(tickItem).format('MMM \'YY')
            } else if (app.wxgraph_getTimeFrame==='por') {
                return moment(tickItem).format('YYYY')
            } else {
                return moment(tickItem).format('MMM D')
            }
        }

        let data = app.wxgraph_getClimateSummary

        return (
          <div id="wx-charts">
          <Grid container justify="left" alignItems="flexStart">
            <Grid item xs={12} md={9}>

      <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['airtemp']) ? "" : "isHidden"}>
        <LineChart data={app.wxgraph_getClimateSummary} syncId="anyId"
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} label={{ value: app.wxgraph_getVarLabels['airtemp_label'], angle: 0, position: 'top' }}/>
          <YAxis label={{ value: app.wxgraph_getVarUnits['airtemp_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Line type='monotone' dataKey='avgt' stroke='#8884d8' fill='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={9}>

      <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['rainfall']) ? "" : "isHidden"}>
        <BarChart data={data} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} label={{ value: app.wxgraph_getVarLabels['rainfall_label'], angle: 0, position: 'top' }}/>
          <YAxis label={{ value: app.wxgraph_getVarUnits['rainfall_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Bar dataKey="pcpn" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={9}>

      <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['soiltemp']) ? "" : "isHidden"}>
        <AreaChart data={data} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} label={{ value: app.wxgraph_getVarLabels['soiltemp_label'], angle: 0, position: 'top' }}/>
          <YAxis label={{ value: app.wxgraph_getVarUnits['soiltemp_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Area type='monotone' dataKey='soilt' stroke='#82ca9d' fill='#82ca9d' />
        </AreaChart>
      </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={9}>

      <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['soilmoist']) ? "" : "isHidden"}>
        <LineChart data={data} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} label={{ value: app.wxgraph_getVarLabels['soilmoist_label'], angle: 0, position: 'top' }}/>
          <YAxis label={{ value: app.wxgraph_getVarUnits['soilmoist_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Line type='monotone' dataKey='soilm' stroke='#8884d8' fill='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={9}>

      <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['humidity']) ? "" : "isHidden"}>
        <LineChart data={data} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} label={{ value: app.wxgraph_getVarLabels['humidity_label'], angle: 0, position: 'top' }}/>
          <YAxis label={{ value: app.wxgraph_getVarUnits['humidity_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Line type='monotone' dataKey='humid' stroke='#82ca9d' fill='#82ca9d' />
        </LineChart>
      </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={9}>

      <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['solarrad']) ? "" : "isHidden"}>
        <AreaChart data={data} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} label={{ value: app.wxgraph_getVarLabels['solarrad_label'], angle: 0, position: 'top' }}/>
          <YAxis label={{ value: app.wxgraph_getVarUnits['solarrad_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Area type='monotone' dataKey='solar' stroke='#82ca9d' fill='#82ca9d' />
        </AreaChart>
      </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={9}>

      <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['wind']) ? "" : "isHidden"}>
        <LineChart data={data} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} label={{ value: app.wxgraph_getVarLabels['wind_label'], angle: 0, position: 'top' }}/>
          <YAxis label={{ value: app.wxgraph_getVarUnits['wind_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Line type='monotone' dataKey='wind' stroke='#8884d8' fill='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={9}>

      <ResponsiveContainer width="100%" height={100} className={(app.wxgraph_getVars['leafwet']) ? "" : "isHidden"}>
        <LineChart data={data} syncId="anyId"
              margin={{top: 0, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} label={{ value: app.wxgraph_getVarLabels['leafwet_label'], angle: 0, position: 'top' }}/>
          <YAxis label={{ value: app.wxgraph_getVarUnits['leafwet_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Tooltip/>
          <Line type='monotone' dataKey='leafwet' stroke='#82ca9d' fill='#82ca9d' />
        </LineChart>
      </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={9}>

      <ResponsiveContainer width="100%" height={50}>
        <LineChart data={app.wxgraph_getClimateSummary} syncId="anyId"
              margin={{top: 30, right: 30, left: 0, bottom: 20}}>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} />
          <YAxis label={{ value: app.wxgraph_getVarUnits['airtemp_units'], angle: -90, position:'insideLeft', offset: 20 }} />
          <Brush dataKey="date" tickFormatter={formatXAxisForDate} height={20} />
        </LineChart>

      </ResponsiveContainer>

            </Grid>
        </Grid>
      </div>

        );

    }
}

export default WxCharts;

