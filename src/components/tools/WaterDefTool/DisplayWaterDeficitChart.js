///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

const DisplayWaterDeficitChart = ({data,depth}) => {

        const options = {
          title: {
            text: 'Water Deficit (0 - '+depth.toString()+'cm)'
          },
          tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
              xDateFormat:"%b %d, %Y", shape: 'rect',
              crosshairs: { width:1, color:"#ff0000", snap:true }},
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          legend: false,
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
          yAxis: {
              title:{ text:"Water Deficit (cm)",style:{"font-size":"14px", color:"#000000"}},
              minRange: data.fc_ref - data.pwp_ref,
              min:0,
              plotLines: [{
                  color: 'black',
                  dashStyle: 'dash',
                  value: data.fc_ref - data.fc_ref,
                  width: 2,
                  zIndex: 100,
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
                  label:{
                      text:'Plant Stress',
                      style: {
                        color: 'red',
                        fontWeight: 'bold'
                      }
                  }
                },{
                  color: 'black',
                  dashStyle: 'dash',
                  value: data.fc_ref - data.pwp_ref,
                  width: 2,
                  label:{text:'Wilting Point'}
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
          }]
        }

        return (
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              options={options}
            />
        );

}

DisplayWaterDeficitChart.propTypes = {
  data: PropTypes.array.isRequired,
  depth: PropTypes.number.isRequired,
};

export default DisplayWaterDeficitChart;
