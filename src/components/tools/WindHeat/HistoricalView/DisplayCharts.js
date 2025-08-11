import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Surface, Symbols } from 'recharts';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

//Components
import DownloadCharts from '../DownloadCharts'

// Styles
import '../../../../styles/WindHeatCharts.css';

const DisplayCharts = ({data,stnName,loading,chartTitle,chartInfo,disabled,onClickLegend,timescale}) => {
        const chartData = data.map(d => ({
          ...d,
          categories: Object.keys(d.categories).reduce((acc, catName) => {
            const catInfo = chartInfo.dataInfo.find(obj => obj.key === catName);
            acc[catName] = { value: d.categories[catName], fill: d.isMissing ? catInfo.missingColor : catInfo.color}
            return acc;
          }, {})
        }));

        const someMissing = chartData.some(d => d.isMissing);
        const someIncomplete = chartData.some(d => !d.isComplete);
        const createXAxisLabel = () => {
          let labels = [];
          if (data && data.length > 0) {
            if (someMissing) labels.push('⁰ : Missing data');
            if (someIncomplete) labels.push('*: Year-to-date');
          }
          return labels.length === 0 ? null : { value: labels.join('  '), position: 'insideBottomRight', offset: 0 }
        }
  
        let yearIsComplete = (y) => {
          const yearData = data.find(d => d.year === y);
          return yearData ? yearData.isComplete : false;
        }

        let yearIsMissing = (y) => {
          const yearData = data.find(d => d.year === y);
          return yearData ? yearData.isMissing : false;
        }

        let formatXAxisForDate = (tickItem) => {
          let tickYear = moment(tickItem).add(1,'days').format('YYYY');
          let date = moment(tickItem).add(1,'days').format('YYYY');
          
          const dateAdditions = [];
          if (yearIsMissing(tickYear)) dateAdditions.push('⁰');
          if (!yearIsComplete(tickYear)) dateAdditions.push('*');

          return date + dateAdditions.join('');
        }

        let renderCustomTooltip = (props) => {
          const { payload, label } = props
          if (!payload || payload.length === 0) return '';
          return (
              <div className="customized-tooltip-windheat">
                {
                  label
                }
                <React.Fragment>
                  <br/>
                  <span style={{ color: 'rgb(90,90,90)', fontSize: '12px', fontStyle: 'italic' }}>(Missing Data: {Math.round(payload[0].payload.percentMissing * 10) / 10}%)</span>
                </React.Fragment>
                {
                  payload.map((entry,index) => {
                    const { payload, value, name } = entry
                    const catInfo = chartInfo.dataInfo.find(obj => obj.label === name);
                    const fillColor = payload.categories[catInfo.key].fill;
                    return (
                        <span key={index} className="tooltip-item">
                        <br/>
                        <span style={{ color: fillColor }}>{name} : </span>
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
            <div className="customized-legend-windheat">
              {payload.map((entry, i) => {
                const { dataKey, dataLabel, color } = entry;
                const active = disabled.includes(dataKey);
                const style = {
                  color: active ? "#AAA" : color
                };

                return (
                  <span
                    key={i}
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
            chartTitle :
            'Loading Data ...'

        let downloadFilename = (stnName) ?
            stnName+'_'+firstDate+'_'+lastDate+'.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        return (
          <div id="windheat-charts">

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
                  <BarChart data={chartData} syncId="anyId"
                        margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                    {chartInfo.dataInfo && disabled &&
                        chartInfo.dataInfo
                          .filter(info => !disabled.includes(info.key))
                          .map(info => 
                            <Bar name={info.label} stackId="a" key={info.key} dataKey={(d) => d['categories'][info.key].value}>
                              {chartData.map((d, i) => <Cell key={`cell-${i}`} fill={d.categories[info.key].fill} />)}
                            </Bar>
                          )
                    }
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                      dataKey="year"
                      tickFormatter={formatXAxisForDate}
                      interval={'preserveEnd'}
                      minTickGap={-10}
                      label={createXAxisLabel()}
                    />
                    <YAxis label={{ value: timescale.slice(0,1).toUpperCase() + timescale.slice(1), angle: -90, position:'insideLeft', offset: 20 }} />
                    {chartData.length === 0 ? '' : <Tooltip
                      cursor={{ stroke: 'red', strokeWidth: 2, fill: 'transparent' }}
                      content={renderCustomTooltip}
                    />}
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

