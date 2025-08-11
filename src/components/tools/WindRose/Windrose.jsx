import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import HighchartsReact from 'highcharts-react-official'

HighchartsMore(Highcharts)
Exporting(Highcharts)
ExportData(Highcharts)

export default class Windrose extends Component { 
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
        labels: {
          format: this.props.userParams.pctcnt === "percent" ? "{value}%" : "{value}"
        },
      },
      legend: {
        align:"right",
        verticalAlign:"middle",
        layout:"vertical",
        title: {
          text: "Wind speed" + (this.props.userParams.wsunits ? (" (" + this.props.userParams.wsunits + ")") : "")
        }
      },
      exporting: {
        menuItemDefinitions: {
          // Custom definition
          downloadCSV: {
            text: 'Download as CSV table'
          },
          downloadXLS: {
            text: 'Download as XLS table'
          }
        },
        buttons: {
          contextButton: {
            menuItems: [
              "printChart",
              "separator",
              "downloadPNG",
              "downloadJPEG",
              "downloadPDF",
              "downloadSVG",
              "separator",
              "downloadCSV",
              "downloadXLS",
    //              "viewData",
              "openInCloud"
            ]
          }
        }
      },
      credits: {
        href: "https://www.rcc-acis.org",
        text: "Powered by ACIS"
      },
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
    const fc = this.props.userParams.pctcnt.charAt(0).toUpperCase() + this.props.userParams.pctcnt.slice(1)
    const wsunits = this.props.userParams.wsunits
    const dirunits = this.props.userParams.directbincnt === 36 ? " degrees" : ""
    const res = this.props.userParams.pctcnt === "percent" ? 1 : 0
    const suffix = this.props.userParams.pctcnt === "percent" ? "%" : ""
    this.options.tooltip = {
      formatter: function() {
        return fc + " of hours with wind speed " + this.series.name + " " + wsunits + 
          " and wind direction is from " + this.point.name + dirunits + ": " + this.y.toFixed(res) + suffix
      }
    }
    const options = {...this.options, ...this.props.options}
    console.log('windrose series')
    console.log(options)
    return (
      <div style={{margin: "0 0"}}>
        {options.series &&
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        }
      </div>
    )
  }
} 
