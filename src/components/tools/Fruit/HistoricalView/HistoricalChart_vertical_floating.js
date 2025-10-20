import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Surface, Symbols } from 'recharts';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DownloadCharts from '../DownloadCharts';

import '../../../../styles/FruitHistoricalChart.css';

var app;

@inject('store') @observer
class HistoricalChart extends Component {



  // MM-DD on y-axis
  // Year on x-axis
  // Find dates each threshold and first frost occur per year
  // Convert dates to timestamp in specific year
  // Plot as stacked bar chart with frost date as small line crossing bar, this should appear to truncate bar
  // Each section is given threshold range from last date to satisfaction date with specific color
  // Missing years should be grayed out and marked with an asterisk in x-label
  // Account for leap years by having the y-axis be a leap year




  constructor(props) {
      super(props);
      app = this.props.store.app;
  }

  createXAxisLabel = () => {
    const someMissing = this.props.data.some(d => d.isMissing);
    const someIncomplete = this.props.data.some(d => !d.isComplete);
    let labels = [];
    if (this.props.data && this.props.data.length > 0) {
      if (someMissing) labels.push('⁰ : Missing data');
      if (someIncomplete) labels.push('*: Year-to-date');
    }
    return labels.length === 0 ? null : { value: labels.join('  '), position: 'insideBottomRight', offset: 0 }
  }
    
  yearIsComplete = (y) => {
    const yearData = this.props.data.find(d => d.year === y);
    return yearData ? yearData.isComplete : false;
  }

  yearIsMissing = (y) => {
    const yearData = this.props.data.find(d => d.year === y);
    return yearData ? yearData.isMissing : false;
  }

  formatXAxisForDate = (tickItem) => {
    let tickYear = moment(tickItem).add(1,'days').format('YYYY');
    let date = moment(tickItem).add(1,'days').format('YYYY');
    
    const dateAdditions = [];
    if (this.yearIsMissing(tickYear)) dateAdditions.push('⁰');
    if (!this.yearIsComplete(tickYear)) dateAdditions.push('*');

    return date + dateAdditions.join('');
  }

  renderCustomTooltip = (props) => {
    const { payload, label } = props
    if (!payload || payload.length === 0) return '';
    return (
        <div className="customized-tooltip-fruit">
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
              const catInfo = this.props.chartInfo.dataInfo.find(obj => obj.label === name);
              if (catInfo) {
                const fillColor = payload.isMissing ? catInfo.missingColor : catInfo.color;
                return (
                    <span key={index} className="tooltip-item">
                    <br/>
                    <span style={{ color: fillColor }}>{name} : </span>
                    <span>{(isNaN(value)) ? '--' : value}</span>
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

  renderCustomizedLegend = ({ payload }) => {
    return (
      <div className="customized-legend-fruit">
        {payload.map((entry, i) => {
          const { dataKey, dataLabel, color } = entry;
          const active = this.props.disabled.includes(dataKey);
          const style = {
            color: active ? "#AAA" : color
          };

          return (
            <span
              key={i}
              className="legend-item"
              onClick={() => this.props.onClickLegend(dataKey)}
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

  getFormattedDays(startDate, endDate) {
    const dayList = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      dayList.push(`${month}/${day}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dayList;
  }

  render() {
    const dates = this.getFormattedDays(new Date('2025-04-01', '2025-12-31'));
    let superChartTitle = (this.props.stnName) ? this.props.chartInfo.chartTitle : 'Loading Data ...';
    let downloadFilename = (this.props.stnName) ? this.props.stnName+'_'+this.props.chartInfo.typeLabel+'.png' : 'scan_data.png';
    downloadFilename = downloadFilename.split(' ').join('-');
    
    return (
      <div id="historical-fruit-chart">
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
                {this.props.stnName}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container direction="row" justifyContent="center" alignItems="center" xs={12}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={this.props.data} syncId="anyId" margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                  {this.props.chartInfo.dataInfo && this.props.disabled &&
                    this.props.chartInfo.dataInfo
                      .filter(info => !this.props.disabled.includes(info.key))
                      .map(info => 
                        <Bar name={info.label} stackId="a" key={info.key} dataKey={(d) => d['categories'][info.key]}>
                          {this.props.data.map((d, i) => <Cell key={`cell-${i}`} fill={d.isMissing ? info.missingColor : info.color} />)}
                        </Bar>
                      )
                  }
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis
                    dataKey="year"
                    tickFormatter={this.formatXAxisForDate}
                    interval={'preserveEnd'}
                    minTickGap={-10}
                    label={this.createXAxisLabel()}
                  />
                  <YAxis label={{ value: 'MM-DD', angle: -90, position:'insideLeft', offset: 20 }} />
                  {this.props.data.length === 0 ? '' : <Tooltip
                    cursor={{ stroke: 'red', strokeWidth: 2, fill: 'transparent' }}
                    content={this.renderCustomTooltip}
                  />}
                  {this.props.chartInfo.dataInfo && this.props.disabled &&
                    <Legend
                      payload={this.props.chartInfo.dataInfo.map(info => ({
                        dataKey: info.key,
                        dataLabel: info.label,
                        color: info.color
                      }))}
                      content={this.renderCustomizedLegend}
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
}

export default HistoricalChart;

