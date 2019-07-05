///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

//Styles
//import 'Charts.css'
import '../../../styles/WaterDefTool.css'

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

const DisplayWaterDeficitChart = ({data,depthRangeTop,depthRangeBottom,units}) => {

        const options = {
          title: {
            text: 'Soil Water Deficit (Depth: '+depthRangeTop.toString()+' - '+depthRangeBottom.toString()+' '+units+')'
          },
          tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
              xDateFormat:"%b %d, %Y", shape: 'rect',valueDecimals:2,
              crosshairs: { width:1, color:"#ff0000", snap:true }},
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          legend: false,
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
          yAxis: {
              title:{ text:"Water Deficit ("+units+")",style:{"font-size":"14px", color:"#000000"}},
              maxRange: data.fc_ref - data.pwp_ref,
              minRange: data.fc_ref - data.pwp_ref,
              max: data.fc_ref - data.pwp_ref,
              min:0,
              plotLines: [{
                  color: 'black',
                  dashStyle: 'dash',
                  value: data.fc_ref - data.fc_ref,
                  width: 2,
                  zIndex: 2,
                  label:{
                      text:'No Plant Stress',
                      style: {
                        color: 'green',
                        fontWeight: 'bold'
                      }
                  }
                },{
                  color: 'black',
                  dashStyle: 'dash',
                  value: (data.fc_ref - data.pwp_ref)/2.,
                  width: 2,
                  zIndex: 2,
                  label:{
                      text:'Plant Stress',
                      style: {
                        color: 'red',
                        fontWeight: 'bold'
                      },
                  }
                },{
                  color: 'black',
                  dashStyle: 'dash',
                  value: data.fc_ref - data.pwp_ref,
                  width: 2,
                  zIndex: 2,
                  label:{
                      text:'Wilting Point',
                      style: {
                        color: 'black',
                        fontWeight: 'bold'
                      },
                  }
                }]
            },
          series: [{
            name:'Water Deficit',
            type: 'line',
            color: 'black',
            zones: [{
              value: (data.fc_ref - data.pwp_ref)/2.,
              color: 'green'
            },{
              color: 'red'
            }],
            data: data.data_series,
            zIndex: 102,
          }]
        }

        return (
          <div id="waterdef-chart">
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              containerProps = {{ className: 'chartContainer' }}
              options={options}
            />
          </div>
        );

}

DisplayWaterDeficitChart.propTypes = {
  data: PropTypes.array.isRequired,
  depthRangeTop: PropTypes.number.isRequired,
  depthRangeBottom: PropTypes.number.isRequired,
  units: PropTypes.string.isRequired,
};

export default DisplayWaterDeficitChart;
