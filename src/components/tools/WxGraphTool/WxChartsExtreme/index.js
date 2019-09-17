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
//import Button from '@material-ui/core/Button';
//import domtoimage from 'dom-to-image';
//import { saveAs } from 'file-saver';

//Components
//import TimeFrameButtonGroup from '../TimeFrameButtonGroup'
import DownloadCharts from '../DownloadCharts'

// Styles
import '../../../../styles/WxCharts.css';

var app;

@inject('store') @observer
class WxChartsExtreme extends Component {

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
        dataForChart = app.wxgraph_getClimateSummary['extremes']

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

        return (
          <div id="wx-charts">
          <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
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

            <Grid item container direction="row" justify="center" alignItems="center" spacing="1">
              <Grid item>
                <Typography variant="subtitle2">
                  Number of Days > {app.wxgraph_getTempThreshold}°F
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      interval={'preserveEnd'}
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name={"Num Days > "+app.wxgraph_getTempThreshold+"°F"} dataKey="cnt_t" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing="1">
              <Grid item>
                <Typography variant="subtitle2">
                  Number of Days > {app.wxgraph_getPrecipThreshold} inches
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataForChart} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      interval={'preserveEnd'}
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip/>
                    <Bar name={"Num Days > "+app.wxgraph_getPrecipThreshold+" inches"} dataKey="cnt_p" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>

          </Grid>
        </div>

        );

    }
}

export default WxChartsExtreme;

