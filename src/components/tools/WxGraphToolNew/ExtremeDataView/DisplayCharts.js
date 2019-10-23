///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import moment from 'moment';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
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

const DisplayCharts = ({data,stnName,loading,tmaxTitle,tminTitle,prcpTitle,tmaxSelected,tminSelected,prcpSelected}) => {

        console.log('DATA');
        console.log(data);

        let year = new Date().getFullYear()

        let yearHasValidData = (y,v) => {
            // year
            // variable type (cnt_x, cnt_n, cnt_p)
            if (data[data.length-1]['date']===y && data[data.length-1][v]!=='M') {
                return true
            } else {
                return false
            }
        }

        let formatXAxisForDate = (tickItem) => {
            let tickYear = moment(tickItem).add(1,'days').format('YYYY')
            if (tickYear===year.toString() && yearHasValidData(year.toString(),'cnt_x')) {
                return moment(tickItem).add(1,'days').format('YYYY')+'*'
            } else {
                return moment(tickItem).add(1,'days').format('YYYY')
            }
        }

        let renderCustomTooltip = (props) => {
          const { payload, label } = props
          return (
              <div className="customized-tooltip-wxgraph">
                {
                    label
                }
                {
                    payload.map((entry,index) => {
                        //const { dataKey, color, value, name } = entry
                        const { color, value, name } = entry
                        let style = {}
                        style = { color: color }
                        return (
                            <span key={index} className="tooltip-item">
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

        let firstDate = (data && data[0]) ? data[0]['date'] : ''
        let lastDate = (data && data[0]) ? data[data.length-1]['date'] : ''

        let superChartTitle = (stnName) ?
            stnName+', from '+firstDate+' to '+lastDate :
            'Loading Data ...'

        let downloadFilename = (stnName) ?
            stnName+'_'+firstDate+'_'+lastDate+'.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        return (
          <div id="wx-charts">

          { (tmaxSelected || tminSelected || prcpSelected) &&

          <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h6">
                {superChartTitle}
              </Typography>
            </Grid>
            <Grid item>
              <DownloadCharts fname={downloadFilename} />
            </Grid>
          </Grid>

          }
          { tmaxSelected &&

          <Grid container justify="left" alignItems="flexStart">
            <Grid item container direction="row" justify="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {tmaxTitle}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      interval={'preserveEnd'}
                      label={(data && yearHasValidData(year.toString(),'cnt_x')) ?
                          { value:"* year-to-date", position:'insideBottomRight', offset: 0 } :
                          null }
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip
                      cursor={{ stroke: '#AAA', strokeWidth: 2, fill: 'transparent' }}
                      content={renderCustomTooltip}
                    />
                    <Bar name="Number of days" dataKey="cnt_x" fill="#f25e5e" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>
          </Grid>

          }
          { tminSelected &&

          <Grid container justify="left" alignItems="flexStart">
            <Grid item container direction="row" justify="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {tminTitle}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      interval={'preserveEnd'}
                      label={(data && yearHasValidData(year.toString(),'cnt_n')) ?
                          { value:"* year-to-date", position:'insideBottomRight', offset: 0 } :
                          null }
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip
                      cursor={{ stroke: '#AAA', strokeWidth: 2, fill: 'transparent' }}
                      content={renderCustomTooltip}
                    />
                    <Bar name="Number of days" dataKey="cnt_n" fill="#5d5df0" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>
          </Grid>

          }
          { prcpSelected &&

          <Grid container justify="left" alignItems="flexStart">
            <Grid item container direction="row" justify="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {prcpTitle}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxisForDate}
                      interval={'preserveEnd'}
                      label={(data && yearHasValidData(year.toString(),'cnt_p')) ?
                          { value:"* year-to-date", position:'insideBottomRight', offset: 0 } :
                          null }
                    />
                    <YAxis label={{ value: 'days', angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip
                      cursor={{ stroke: '#AAA', strokeWidth: 2, fill: 'transparent' }}
                      content={renderCustomTooltip}
                    />
                    <Bar name="Number of days" dataKey="cnt_p" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
            </Grid>
          </Grid>

          }

        </div>

        );

}

export default DisplayCharts;

