import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import HighchartsReact from 'highcharts-react-official'

HighchartsMore(Highcharts)
Exporting(Highcharts)
ExportData(Highcharts)

export default class WindroseEmpty extends Component { 
  constructor(props) {
    super(props)
    // Any of these options can be overridden via this.props.options
    this.options = {
      chart: {
        polar:true,
        type:"column",
      },
      plotOptions: {
        series: {
          stacking:"normal",
          shadow:false,
          groupPadding:0,
          pointPlacement:"on"
        }
      },
      credits: { enabled: false },
      xAxis: { 
        type:"category",
        tickmarkPlacement:"on"
      },
      yAxis: { 
        min:0,
        endOnTick:false,
        showFirstLabel: false,
        showLastLabel:true,
        reversedStacks:false,
        labels: "percent",
      },
      legend: {
        align:"right",
        verticalAlign:"middle",
        layout:"vertical",
        title: {
          text: ""
        }
      },
      exporting: { enabled: false },
      // Following are expected, but not required, to be provided via this.props.options
      title: {
        text:"",
      },
      subtitle: {
        text:""
      },
      // This must be provided via this.props.options.series
      series: null
    }
  }

  render() {
    const options = {...this.options}
    return (
      <div style={{margin: "0 0"}}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
      </div>
    )
  }
} 
