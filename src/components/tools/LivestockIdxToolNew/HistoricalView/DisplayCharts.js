///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Surface, Symbols } from 'recharts';
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
import '../../../../styles/LivestockCharts.css';

const DisplayCharts = ({data,stnName,loading,chartTitle,chartInfo,disabled,onClickLegend,timescale}) => {

        let year = new Date().getFullYear()

        let yearHasValidData = (y) => {
            if (data[data.length-1]['year']===y && data[data.length-1]['idx_type']!==null) {
                return true
            } else {
                return false
            }
        }

        let formatXAxisForDate = (tickItem) => {
            //let t = moment(tickItem)
            let tickYear = moment(tickItem).add(1,'days').format('YYYY')
            if (tickYear===year.toString() && yearHasValidData(year.toString())) {
                return moment(tickItem).add(1,'days').format('YYYY')+'*'
            } else {
                return moment(tickItem).add(1,'days').format('YYYY')
            }
        }

        let renderCustomTooltip = (props) => {
          const { payload, label } = props
          return (
              <div className="customized-tooltip-livestock">
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

        let renderCustomizedLegend = ({ payload }) => {
          return (
            <div className="customized-legend-livestock">
              {payload.map(entry => {
                const { dataKey, dataLabel, color } = entry;
                const active = disabled.includes(dataKey);
                const style = {
                  //marginRight: 10,
                  //color: active ? "#AAA" : "#000"
                  color: active ? "#AAA" : color
                };

                return (
                  <span
                    className="legend-item"
                    onClick={() => onClickLegend(dataKey)}
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

        let firstDate = (data && data[0]) ? data[0]['year'] : ''
        let lastDate = (data && data[0]) ? data[data.length-1]['year'] : ''

        let superChartTitle = (stnName) ?
            //stnName+', from '+firstDate+' to '+lastDate :
            chartTitle :
            'Loading Data ...'

        let downloadFilename = (stnName) ?
            stnName+'_'+firstDate+'_'+lastDate+'.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        return (
          <div id="livestock-charts">

          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h6">
                {superChartTitle}
              </Typography>
            </Grid>
            <Grid item>
              <DownloadCharts fname={downloadFilename} />
            </Grid>
          </Grid>

          <Grid container justifyContent="left" alignItems="flexStart">
            <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle2">
                  {stnName}
                </Typography>
              </Grid>
            </Grid>

            <Grid item container direction="row" justifyContent="center" alignItems="center" xs={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    {chartInfo.dataInfo && disabled &&
                        chartInfo.dataInfo
                          .filter(info => !disabled.includes(info.key))
                          .map(info => 
                            <Bar name={info.label} stackId="a" key={info.key} dataKey={info.key} fill={info.color} />
                          )
                    }
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="year"
                      tickFormatter={formatXAxisForDate}
                      interval={'preserveEnd'}
                      label={(yearHasValidData(year.toString())) ?
                          { value:"* year-to-date", position:'insideBottomRight', offset: 0 } :
                          null }
                    />
                    <YAxis label={{ value: timescale, angle: -90, position:'insideLeft', offset: 20 }} />
                    <Tooltip
                      cursor={{ stroke: 'red', strokeWidth: 2, fill: 'transparent' }}
                      content={renderCustomTooltip}
                    />
                    {chartInfo.dataInfo && disabled &&
                      <Legend
                        payload={chartInfo.dataInfo.map(info => ({
                          dataKey: info.key,
                          dataLabel: info.label,
                          color: info.color
                        }))}
                        content={renderCustomizedLegend}
                      />
                    }
                  </BarChart>
                </ResponsiveContainer>
                <Grid item>
                  <Typography variant="caption">
                    {'(click legend to toggle categories)'}
                  </Typography>
                </Grid>
            </Grid>
          </Grid>

        </div>

        );

}

DisplayCharts.propTypes = {
  timescale: PropTypes.string.isRequired,
};

export default DisplayCharts;

