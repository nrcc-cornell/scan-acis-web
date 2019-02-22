///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
import { ResponsiveContainer, ComposedChart, Brush, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend } from 'recharts';

//Components
import GddChartTitle from '../GddChartTitle'

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
              active: ""
            }
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
                    if (dataKey==='obs' || dataKey==='ave' || dataKey==='recent') {
                      return (
                        <span className="tooltip-item">
                        <br/>
                        <span style={style}>{name} : </span>
                        <span>{(isNaN(value)) ? '--' : value}</span>
                        </span>
                      )
                    } else {
                      return (
                        <span className="tooltip-item"></span>
                      )
                    }
                })
            }
            {
                payload.map((entry) => {
                    const { dataKey, color } = entry
                    let style = {}
                    style = { color: color }
                    if (dataKey==='min_por') {
                      let v1 = (isNaN(payload[0].value)) ? '--' : payload[0].value
                      let v2 = (isNaN(payload[0].value) || isNaN(payload[1].value)) ? '--' : payload[0].value + payload[1].value
                      return (
                        <span className="tooltip-item">
                        <br/>
                        <span style={style}>Period of record : </span>
                        <span>{v1} - {v2}</span>
                        </span>
                      )
                    } else {
                      return (
                        <span className="tooltip-item"></span>
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

    const renderCustomLegend = (props) => {
      const { payload } = props
      return (
        <div className="customized-legend">
          {
            payload.map((entry) => {
              const { dataKey, color, value } = entry
              let style = {}
              style = { color: color }
              if (dataKey==='obs' || dataKey==='ave' || dataKey==='recent') {
                return (
                  <span className="legend-item" style={style}>
                    <Surface width={10} height={10} viewBox="0 0 10 10">
                      <Symbols cx={5} cy={5} type="circle" size={50} fill={color} />
                    </Surface>
                    <span>{value}</span>
                  </span>
                )
              } else {
                return (
                  <span className="tooltip-item"></span>
                )
              }
            })
          }
          {
            payload.map((entry) => {
              const { dataKey, color, value } = entry
              let style = {}
              style = { color: color }
              if (dataKey==='min_por') {
                return (
                  <span className="legend-item" style={style}>
                    <Surface width={10} height={10} viewBox="0 0 10 10">
                      <Symbols cx={5} cy={5} type="square" size={50} fill={color} />
                    </Surface>
                    <span>{value}</span>
                  </span>
                )
              } else {
                return (
                  <span className="tooltip-item"></span>
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
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={app.gddtool_getClimateSummary}>
                <Area
                  stackId="1"
                  name="Period extremes"
                  dataKey={"min_por"}
                  stroke="#342E37"
                  fill="#FFF"
                />
                <Area
                  stackId="1"
                  name=" "
                  dataKey={"max_minus_min"}
                  stroke="#342E37"
                  fill="#F0F0F0"
                />
                <Line name="Season to date" type="monotone" dataKey="obs" stroke="green" fill="green" dot={true} r={1} />
                <Line name="15-yr ave" type="monotone" dataKey="recent" stroke="blue" dot={false} />
                <Line name="Period ave" type="monotone" dataKey="ave" stroke="purple" dot={false} />
                <CartesianGrid stroke="#ccc" />
                <Tooltip
                    labelFormatter={(name) => moment(name,"YYYY-MM-DD").format("MMM D, YYYY")}
                    content={renderCustomTooltip}
                    cursor={{ stroke: 'red', strokeWidth: 1 }}
                />
                <Legend verticalAlign="top" align="center" content={renderCustomLegend} />
                <XAxis dataKey="date" tickFormatter={formatXAxisForDate} />
                <YAxis />
                <Brush dataKey="date" tickFormatter={formatXAxisForDate} height={20} />
              </ComposedChart>
            </ResponsiveContainer>

            </div>
        );

    }
}

export default GddChart;

