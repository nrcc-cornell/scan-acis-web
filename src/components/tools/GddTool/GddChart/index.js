///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend } from 'recharts';

//Components
import GddChartTitle from '../GddChartTitle'
import MessageMissing from '../MessageMissing'

// Styles
import '../../../../styles/GddChart.css';

//let formatXAxisForDate = (tickItem) => {
//    return moment(tickItem).format('MMM DD')
//}

var app;

@inject('store') @observer
class GddChart extends Component {

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
        if (type==='gdd') {
            return {
                'typeLabel':'Growing Degree Days',
                'dataInfo': [
                    {'key':'min_por','label':'Period extremes','color':'#342E37'},
                    {'key':'max_minus_min','label':'Period extremes','color':'#342E37'},
                    {'key':'obs','label':'Season to date','color':'green'},
                    {'key':'recent','label':'15-yr ave','color':'blue'},
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
                  //color: active ? "#AAA" : "#000"
                  color: active ? "#AAA" : color
                };

                if (dataKey!=='min_por') {
                  return (
                    <span
                      className="legend-item-wxgraph"
                      onClick={() => this.onClickLegend(dataKey)}
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
                } else {
                  return (false)
                }
              })}
            </div>
        );
    };


    render() {

    let chartInfo_gdd = this.getChartInfo('gdd')

    const renderCustomTooltip = (props) => {
      const { payload, label } = props
      return (
          <div className="customized-tooltip">
            {
                moment(label,"YYYY-MM-DD").format("MMM D, YYYY")
            }
            {
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
            {
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
          </div>
      )
    }

        let formatXAxisForDate = (tickItem) => {
            return moment(tickItem).format('MMM D')
        }

    const renderCustomLegend_old = (props) => {
      const { payload } = props
      return (
        <div className="customized-legend">
          {
            payload.map((entry,index) => {
              const { dataKey, color, value } = entry
              let style = {}
              style = { color: color }
              if (dataKey==='obs' || dataKey==='ave' || dataKey==='recent') {
                return (
                  <span key={index} className="legend-item" style={style}>
                    <Surface width={10} height={10} viewBox={{x:0,y:0,width:10,height:10}}>
                      <Symbols cx={5} cy={5} type="circle" size={50} fill={color} />
                    </Surface>
                    <span>{value}</span>
                  </span>
                )
              } else {
                return (
                  <span key={index} className="tooltip-item"></span>
                )
              }
            })
          }
          {
            payload.map((entry,index) => {
              const { dataKey, color, value } = entry
              let style = {}
              style = { color: color }
              if (dataKey==='min_por') {
                return (
                  <span key={index} className="legend-item" style={style}>
                    <Surface width={10} height={10} viewBox={{x:0,y:0,width:10,height:10}}>
                      <Symbols cx={5} cy={5} type="square" size={50} fill={color} />
                    </Surface>
                    <span>{value}</span>
                  </span>
                )
              } else {
                return (
                  <span key={index} className="tooltip-item"></span>
                )
              }
            })
          }
        </div>
      )
    }

        return (
            <div id="gdd-chart">
            <GddChartTitle/>
            <MessageMissing/>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={app.gddtool_getClimateSummary}>
                {chartInfo_gdd.dataInfo && this.state.disabled &&
                    chartInfo_gdd.dataInfo
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
                          } else if (info.key==='recent') {
                            return <Line name={info.label} type="monotone" dataKey={info.key} stroke={info.color} fill={info.color} dot={false} isAnimationActive={false}/>
                          } else if (info.key==='ave') {
                            return <Line name={info.label} type="monotone" dataKey={info.key} stroke={info.color} fill={info.color} dot={false} isAnimationActive={false}/>
                          } else {
                            return (false)
                          }
                        }
                      )
                }
                <CartesianGrid stroke="#ccc" />
                <Tooltip
                    labelFormatter={(name) => moment(name,"YYYY-MM-DD").format("MMM D, YYYY")}
                    content={renderCustomTooltip}
                    cursor={{ stroke: 'red', strokeWidth: 1 }}
                />
                {chartInfo_gdd.dataInfo && this.state.disabled &&
                  <Legend
                    verticalAlign="top"
                    align="center"
                    payload={chartInfo_gdd.dataInfo.map(info => ({
                      dataKey: info.key,
                      dataLabel: info.label,
                      color: info.color
                    }))}
                    content={this.renderCustomizedLegend}
                  />
                }
                <XAxis dataKey="date" tickFormatter={formatXAxisForDate} label={{ value: "Date in "+app.getPlantingYear, position: "insideBottom", dy: 10}} />
                <YAxis label={{ value: 'Acc GDD (base '+app.gddtool_getBase+'°F)', angle: -90, position:'insideLeft', dy: 60, offset: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>

            </div>
        );

    }
}

export default GddChart;

