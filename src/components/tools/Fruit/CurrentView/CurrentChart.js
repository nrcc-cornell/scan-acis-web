import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend, ReferenceLine, Label, ReferenceArea, Bar, LabelList } from 'recharts';

//Components
import FruitChartTitle from '../FruitChartTitle'

// Styles
import '../../../../styles/FruitChart.css';

const Disclaimer = (props) => {
  const { isMissingData } = props;
  return (
    <foreignObject x="70" y="8" width="200" height="50">
      <div style={{ backgroundColor: 'rgb(255,165,165)', border: '1px solid rgb(255,72,72)', borderRadius: '5px', padding: '5px', width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '12px' }}><b>WARNING</b>: This year is missing ~{Math.round(isMissingData.percentMissing)}% ({isMissingData.missing} days) of daily data.</p>
      </div>
    </foreignObject>
  );
}

var app;

@inject('store') @observer
class CurrentChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
              active: "",
              disabled: [],
            }
        app = this.props.store.app;
    }

    onClickLegend = (dataKey) => {
        // dataKey : key in legend of chart
        if (this.state.disabled.includes(dataKey)) {
          if (dataKey!=='max_minus_min') {
            this.setState({
              disabled: this.state.disabled.filter(obj => obj !== dataKey)
            });
          } else {
            this.setState({
              disabled: this.state.disabled.filter(obj => obj !== dataKey && obj !== 'min_por')
            });
          }
        } else {
          if (dataKey!=='max_minus_min') {
            this.setState({ disabled: this.state.disabled.concat([dataKey]) });
          } else {
            // must include 'min_por' with 'max_minus_min'
            this.setState({ disabled: this.state.disabled.concat([dataKey,'min_por']) });
          }
        }
    }

    getChartInfo = (type) => {
        if (type==='fruit') {
            return {
                'typeLabel':'Growing Degree Days',
                'dataInfo': [
                    {'key':'min_por','label':'Period extremes','color':'#342E37'},
                    {'key':'max_minus_min','label':'Period extremes','color':'#342E37'},
                    {'key':'obs','label':'Season to date','color':'green'},
                    {'key':'ave','label':'Period ave','color':'purple'},
                ]
            }
        } else {
            return []
        }
    }

    renderCustomizedLegend = ({ payload }) => {
        return (
            <div className="customized-legend">
              {payload.map(entry => {
                const { dataKey, dataLabel, color } = entry;
                const active = this.state.disabled.includes(dataKey);
                const style = {
                  marginRight: 10,
                  color: active ? "#AAA" : color
                };

                if (dataKey!=='min_por') {
                  return (
                    <span
                      key={dataKey}
                      className="legend-item-wxgraph"
                      onClick={() => this.onClickLegend(dataKey)}
                      align="center"
                      style={style}
                    >
                      <Surface width={10} height={10}>
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
                } else {
                  return (false)
                }
              })}
            </div>
        );
    };

    renderCustomLabel = ({ viewBox }, label, useOffset) => {
      return (
        <g>
          <foreignObject y={viewBox.y - 9} x={viewBox.x + (useOffset ? 112 : 12)} height='20' width={viewBox.width}>
              <div style={{ width: 'fit-content', color: '#5e6c77ff' }}>
                <span>{label}</span>
                <div style={{
                  backgroundColor: 'white',
                  height: '7px',
                  width: '103%',
                  position: 'relative',
                  bottom: '10px',
                  zIndex: -1
                }}></div>
              </div>
          </foreignObject>
        </g>
      );
    };

    renderCustomTooltip = (props) => {
      const { payload, label } = props
      console.log(payload);
      const springFreezesPayload = payload.find(p => ('springFreezes' in p.payload));
      console.log(springFreezesPayload);
      return (
          <div className="customized-tooltip-fruittool">
            {
                moment(label,"YYYY-MM-DD").format("MMM D, YYYY")
            }
            {payload &&
                payload.map((entry,index) => {
                    const { dataKey, color, value, name } = entry
                    let style = {}
                    style = { color: color }
                    if (dataKey==='obs' || dataKey==='ave' || dataKey==='recent') {
                      return (
                        <span key={index} className="tooltip-item">
                        <br/>
                        <span style={style}>{name} : </span>
                        <span>{(isNaN(value)) ? '--' : value}</span>
                        </span>
                      )
                    } else {
                      return (
                        <span key={index} className="tooltip-item"></span>
                      )
                    }
                })
            }
            {payload &&
                payload.map((entry,index) => {
                    const { dataKey, color } = entry
                    let style = {}
                    style = { color: color }
                    if (dataKey==='min_por') {
                      let v1 = (isNaN(payload[0].value)) ? '--' : payload[0].value
                      let v2 = (isNaN(payload[0].value) || isNaN(payload[1].value)) ? '--' : payload[0].value + payload[1].value
                      return (
                        <span key={index} className="tooltip-item">
                        <br/>
                        <span style={style}>Period of record : </span>
                        <span>{v1} - {v2}</span>
                        </span>
                      )
                    } else {
                      return (
                        <span key={index} className="tooltip-item"></span>
                      )
                    }
                })
            }

            {app.getToolName === 'blueberryGrowth' && springFreezesPayload && springFreezesPayload.payload.springFreezes.num !== 0 && (
              <span className="tooltip-item">
                <br/>
                <span>Date of Last Spring Freeze for : </span>
                <span>{springFreezesPayload.payload.springFreezes.label}</span>
              </span>
            )}
          </div>
      )
    }

    formatXAxisForDate = (tickItem) => {
        return moment(tickItem).format('MMM D')
    }

    render() {
        let chartInfo_fruit = this.getChartInfo('fruit')
        let data = app.fruittool_getClimateSummary;

        if (app.getToolName !== 'pawpaw') {
          const highestLineGdds = Math.max(...this.props.horizontalLines.map(vl => vl.gdds));
          const minPOR = data.findIndex(d => d.min_por >= highestLineGdds);
          const obs = data.findIndex(d => d.obs >= highestLineGdds);
          if (obs > 0 && minPOR > 0) {
            const endIdx = Math.max(minPOR, obs) + 15;
            if (endIdx < data.length - 1) {
              data = data.slice(0,endIdx);
            }
          }
        }

        const isMissingData = app.fruittool_selectedYearMissing;
        const firstFallFreeze = app.fruittool_getSelectedYearFirstFreeze;
        return (
            <div id="fruit-chart">
            <FruitChartTitle/>

            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                {chartInfo_fruit.dataInfo && this.state.disabled &&
                    chartInfo_fruit.dataInfo
                      .filter(info => !this.state.disabled.includes(info.key))
                      .map(info => {
                          if (info.key==='min_por') {
                            return <Area
                              stackId="1"
                              name={info.label}
                              dataKey={info.key}
                              stroke={info.color}
                              fill="#FFF"
                            />
                          } else if (info.key==='max_minus_min') {
                            return <Area
                              stackId="1"
                              name={info.label}
                              dataKey={info.key}
                              stroke={info.color}
                              fill="#F0F0F0"
                            />
                          } else if (info.key==='obs') {
                            return <Line name={info.label} type="monotone" dataKey={info.key} stroke={info.color} fill={info.color} dot={true} r={1} isAnimationActive={false}/>
                          } else if (info.key==='ave') {
                            return <Line name={info.label} type="monotone" dataKey={info.key} stroke={info.color} fill={info.color} dot={false} isAnimationActive={false}/>
                          } else {
                            return (false)
                          }
                        }
                      )
                }

                {app.getToolName === 'blueberryGrowth' ? (
                  [
                    <CartesianGrid
                      stroke="#ccc"
                      horizontalCoordinatesGenerator={(props) => [props.offset.top]}
                      verticalCoordinatesGenerator={(props) => [props.width - props.offset.right]}
                    />,
                    <YAxis yAxisId={1} domain={[-10,0]} hide={true} />,
                    <Bar
                      yAxisId={1}
                      dataKey={(d) => d['springFreezes']['num']}
                      radius={[5,5,0,0]}
                      fill='#5b7ff7'
                    >
                      <LabelList dataKey={(d) => d['springFreezes']['label']} position="insideEnd" angle={-90} fill='white' style={{ fontWeight: 'bold', fontSize: '14px' }} />
                    </Bar>
                  ]
                ) : (
                  <CartesianGrid stroke="#ccc" />
                )}
                <Tooltip
                    labelFormatter={(name) => moment(name,"YYYY-MM-DD").format("MMM D, YYYY")}
                    content={this.renderCustomTooltip}
                    cursor={{ stroke: 'red', strokeWidth: 1 }}
                />
                {chartInfo_fruit.dataInfo && this.state.disabled &&
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    payload={chartInfo_fruit.dataInfo.map(info => ({
                      dataKey: info.key,
                      dataLabel: info.label,
                      color: info.color
                    })).toSorted((a,b) => a.dataLabel > b.dataLabel)}
                    content={this.renderCustomizedLegend}
                  />
                }
                <XAxis xAxisId={0} dataKey="date" tickFormatter={this.formatXAxisForDate} label={{ value: "Date in "+app.fruittool_getSelectedYear, position: "insideBottom", dy: 10}} />
                <YAxis label={{ value: 'Acc GDD (base '+app.fruittool_getBase+'°F)', angle: -90, position:'insideLeft', dy: 60, offset: 10 }} />
                
                <ReferenceLine x={firstFallFreeze} stroke="#176fb2" strokeDasharray="6 4" strokeWidth={2}>
                  <Label value="First Freeze" angle={-90} position="insideTopRight" offset={14} style={{ fill: '#176fb2' }} />
                </ReferenceLine>
                {firstFallFreeze &&
                  <ReferenceArea ifOverflow='hidden' x1={firstFallFreeze} x2={app.fruittool_getSelectedYear + '-12-31'} y1={0} y2={100000} fill="#176fb2" fillOpacity={0.1} strokeOpacity={0} />
                }

                {/* {app.getToolName === 'blueberryGrowth' && app.fruittool_getLastSpringFreezes.map(([x,year]) => (
                  <ReferenceLine x={x} stroke="#176fb2" strokeDasharray="3 3">
                    <Label value={year} angle={-90} position="insideTopRight" offset={14} style={{ fill: '#176fb2' }} />
                  </ReferenceLine>
                ))} */}

                {this.props.horizontalLines.map(({ label, gdds }, i) =>
                  <ReferenceLine y={gdds} stroke="#5e6c77ff" strokeDasharray="3 3" label={(v) => this.renderCustomLabel(v, label, i % 2 === 1)}/>
                )}

                {isMissingData.missing > 10 &&
                  <ReferenceArea shape={<Disclaimer isMissingData={isMissingData} />} />
                }
              </ComposedChart>
            </ResponsiveContainer>
            </div>
        );

    }
}

export default CurrentChart;

