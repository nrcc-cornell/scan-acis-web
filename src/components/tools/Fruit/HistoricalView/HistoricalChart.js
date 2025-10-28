import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Surface,
  Symbols,
  Label,
  ComposedChart,
  Scatter,
  Rectangle,
  Dot
} from 'recharts';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DownloadCharts from '../DownloadCharts';

import '../../../../styles/FruitHistoricalChart.css';

var app;

const FREEZE_BAR_COLOR = "#0cb500";
const FREEZE_BAR_COLOR_WARNING = "red";
const FREEZE_BAR_COLOR_MISSING = "#5b5757";
const FreezeBar = (props) => {
  const { x, y, height, xAxis, yAxis, firstFreezeIdx, categories, isMissing } = props;
  if (firstFreezeIdx === null) return '';
  
  const horizLineX = xAxis.scale(categories.transparent);
  const vertLineX = x + 4;
  const vertLineHeight = yAxis.bandSize * 0.9;
  const vertLineY = y + (height*0.5) - (vertLineHeight*0.5);

  const catSum = Object.values(categories).reduce((a,b) => a+b,0);
  const isWarning = firstFreezeIdx === catSum;
  const fill = isWarning ? FREEZE_BAR_COLOR_WARNING : (isMissing ? FREEZE_BAR_COLOR_MISSING : FREEZE_BAR_COLOR);
  return (
    <React.Fragment>
      <Rectangle x={horizLineX + 2} y={y+3.5} width={vertLineX - horizLineX} height={2} fill={fill} />
      <Rectangle x={vertLineX} y={vertLineY} width={2} height={vertLineHeight} fill={fill} />
    </React.Fragment>
  );
};

const CustomCell = (props) => {
  const { x, y, width, height, radius, isMissing, info, categories, firstFreezeIdx } = props;
  let r = radius;
  if (info.isLast) {
    const catSum = Object.values(categories).reduce((a,b) => a+b, 0);
    if (catSum === firstFreezeIdx) {
      r = [0,0,0,0];
    }
  }
  const fill = info.isActive ? (isMissing ? info.missingColor : info.color) : 'transparent';
  return <Rectangle x={x} y={y} width={width} height={height} radius={r} fill={fill} />;
};

const CustomDot = (props) => {
  const { cx, cy, isActive, isMissing, info } = props;
  const fill = info.isActive ? (isMissing ? info.missingColor : info.color) : 'transparent';
  return <Dot cx={cx} cy={cy} r={4} fill={fill} />;
};

@inject('store') @observer
class HistoricalChart extends Component {
  constructor(props) {
      super(props);
      app = this.props.store.app;
      this.state = {
        disabled: [],
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
    
  yearIsMissing = (y) => {
    const yearData = this.props.data.find(d => d.year === y);
    return yearData ? yearData.isMissing : false;
  }

  
  idxToDate = (idx) => {
    const fruitSeasonStart = app.fruit_info[app.getToolName].seasonStart;
    const referenceDate = new Date(2025, fruitSeasonStart[0] - 1, fruitSeasonStart[1]);
    const date = new Date(
      referenceDate.getTime() + idx * 24 * 60 * 60 * 1000
    );
    return moment(date).format('M/D');
  };

  yAxisTickFormatter = (year) => {
    return year + (this.yearIsMissing(year) ? '⁰' : '');
  }

  createXAxisLabel = (data) => {
    let label = null;
    if (
      data &&
      data.length > 0 &&
      data.some(d => d.isMissing)
    ) {
      label = { value: '⁰ : Missing data', position: 'insideBottomLeft', offset: 0 };
    }
    return label;
  }

  getRadius = (index) => {
    const radius = 200;
    const cells = this.props.chartInfo.dataInfo;
    const firstVisibleCellIdx = cells.findIndex(c => c.color !== 'transparent');
    const numCells = cells.length;

    if (index < numCells && (numCells - firstVisibleCellIdx) !== 1 && firstVisibleCellIdx <= index) {
      if (index === firstVisibleCellIdx) {
        // First visible bar in stack
        return [radius, 0, 0, radius];
      } else if (index === numCells - 1) {
        // Last bar in stack
        return [0, radius, radius, 0];
      } else {
        // Middle bars
        return 0;
      }
    } else {
      // Only visible bar in stack, invisible bar, or "something weird happened" case
      return radius;
    }
  }

  renderCustomTooltip = (props) => {
    const { payload, label } = props
    if (!payload || payload.length === 0) return '';
    const freezeObj = payload.find(p => p.name === 'firstFreezeIdx');
    const freezeDate = (freezeObj && freezeObj.value) ? this.idxToDate(freezeObj.value) : '--';

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
              const catInfoIndex = this.props.chartInfo.dataInfo.findIndex(obj => obj.label === name);
              if (catInfoIndex >= 0) {
                const catInfo = this.props.chartInfo.dataInfo[catInfoIndex];
                const fillColor = payload.isMissing ? catInfo.missingColor : catInfo.color;

                let valueDate;
                if (isNaN(value) || value === 0) {
                  valueDate = '--';
                } else if (payload.isScatter){
                  valueDate = this.idxToDate(payload.categories[this.props.chartInfo.dataInfo[catInfoIndex].key]);
                } else {
                  let prevSum = 0;
                  let valueSum = 0;
                  for (let i = 0; i <= catInfoIndex; i++) {
                    prevSum = valueSum;
                    valueSum += payload.categories[this.props.chartInfo.dataInfo[i].key];
                  }
                  valueDate = this.idxToDate(prevSum) + ' - ' + this.idxToDate(valueSum);
                }

                return (
                    <span key={index} className="tooltip-item">
                      <br/>
                      <span style={{ color: fillColor }}>{name} : </span>
                      <span>{valueDate}</span>
                    </span>
                )
              } else {
                return '';
              }
            })
          }
          {app.getToolName === 'pawpaw' &&
            <React.Fragment>
              <span className="tooltip-item">
                <br/>
                <span style={{ color: 'red' }}>First Frost : </span>
                <span>{freezeDate}</span>
              </span>
            </React.Fragment>
          }
        </div>
    )
  }

  renderCustomizedLegend = ({ payload }) => {
    return (
      <div className="customized-legend-fruit">
        {payload.map((entry, i) => {
          const { dataKey, dataLabel, color } = entry;
          const active = !this.state.disabled.includes(dataKey);
          const c = active ? color : '#AAA';

          return (
            <div
              key={i}
              className="legend-item"
              align="center"
              onClick={() => this.onClickLegend(dataKey)}
              style={{ color: c }}
            >
              <Surface width={10} height={10} viewBox="0 0 10 10">
                <Symbols cx={5} cy={5} type="square" size={100} fill={c} />
                {!active && (
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
            </div>
          );
        })}

        {app.getToolName === 'pawpaw' &&
          <div
            key='freeze-bar-item'
            className="legend-item"
            align="center"
            onClick={() => this.onClickLegend('firstFreezeIdx')}
            style={{ color: this.state.disabled.includes('firstFreezeIdx') ? '#AAA' : FREEZE_BAR_COLOR }}
          >
            <Surface width={10} height={10} viewBox="0 0 10 10">
              <Symbols cx={5} cy={5} type="square" size={100} fill={FREEZE_BAR_COLOR} />
              {this.state.disabled.includes('firstFreezeIdx') && (
                <Symbols
                  cx={5}
                  cy={5}
                  type="square"
                  size={25}
                  fill={"#FFF"}
                />
              )}
            </Surface>
            <span>&nbsp;First Freeze</span>
          </div>
        }
      </div>
    );
  };

  render() {
    let superChartTitle = (this.props.stnName) ? this.props.chartInfo.chartTitle : 'Loading Data ...';
    let downloadFilename = (this.props.stnName) ? this.props.stnName+'_'+this.props.chartInfo.typeLabel+'.png' : 'scan_data.png';
    downloadFilename = downloadFilename.split(' ').join('-');

    const fruitSeasonStartMonth = app.fruit_info[app.getToolName].seasonStart[0];
    let ticks = fruitSeasonStartMonth === 4 ? [0,30,61,91,122,153,183,214,245,275] : [0,31,61,92,123,153,184,215,245];

    const firstToShow = this.props.data.findIndex(d => d.percentMissing < 25);
    const data = this.props.data.slice(firstToShow);

    let lastIdxOnX = ticks[ticks.length - 1];
    if (app.getToolName.includes('blueberry')) {
      const lastValues = data.map(d => {
        if (d.isScatter) {
          return Math.max(...Object.values(d.categories));
        } else {
          return Object.values(d.categories).reduce((a,b) => a+b,0);
        }
      });
      const lastVal = Math.max(...lastValues) + 31;
      if (lastVal < lastIdxOnX) {
        lastIdxOnX = lastVal;
      }
      ticks = ticks.filter(t => t <= lastIdxOnX);
    }
    return (
      <div id="fruit-chart">
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
              <ResponsiveContainer width="100%" height={600}>
                <ComposedChart
                  data={data}
                  // data={this.props.data.filter(d => ![0, null].includes(d.categories[this.props.chartInfo.dataInfo[1].key]))}
                  syncId="anyId"
                  margin={{top: 0, right: 30, left: 0, bottom: 0}}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  
                  <XAxis
                    type="number"
                    tickFormatter={this.idxToDate}
                    ticks={ticks}
                    domain={[ticks[0],lastIdxOnX]}
                    label={this.createXAxisLabel(data)}
                  />
                  <YAxis
                    dataKey="year"
                    type="category"
                    tickFormatter={this.yAxisTickFormatter}
                  >
                    <Label
                      value="Year"
                      angle={-90}
                      position="insideLeft"
                      offset={10}
                      style={{ textAnchor: 'middle' }}
                    />
                  </YAxis>

                  {app.getToolName === 'pawpaw' && this.state.disabled && !this.state.disabled.includes('firstFreezeIdx') &&
                    <Scatter dataKey="firstFreezeIdx" shape={<FreezeBar />} />
                  }

                  {this.props.chartInfo.dataInfo && this.state.disabled &&
                    this.props.chartInfo.dataInfo
                      .map((info, index) => {
                        const isActive = !this.state.disabled.includes(info.key);
                        if (app.getToolName === 'blueberryGrowth') {
                          return (
                            <Scatter
                              name={info.label}
                              key={info.key}
                              dataKey={(d) => d['categories'][info.key]}
                              shape={<CustomDot info={{...info, isActive}} />}
                            />
                          );
                        } else {
                          return (
                            <Bar
                              name={info.label}
                              stackId="a"
                              key={info.key}
                              dataKey={(d) => d['categories'][info.key]}
                              radius={this.getRadius(index)}
                              shape={<CustomCell info={{...info, isActive, isLast: index === this.props.chartInfo.dataInfo.length - 1}} />}
                            ></Bar>
                          );
                        }
                      })
                  }

                  {data.length === 0 ? '' : <Tooltip
                    cursor={{ stroke: 'red', strokeWidth: 2, fill: 'transparent' }}
                    content={this.renderCustomTooltip}
                  />}

                  {this.props.chartInfo.dataInfo && this.state.disabled &&
                    <Legend
                      payload={this.props.chartInfo.dataInfo.map(info => ({
                        dataKey: info.key,
                        dataLabel: info.label,
                        color: info.color
                      }))}
                      content={this.renderCustomizedLegend}
                    />
                  }
                </ComposedChart>
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

