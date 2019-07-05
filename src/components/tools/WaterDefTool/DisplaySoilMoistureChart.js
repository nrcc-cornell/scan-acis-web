///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

const DisplaySoilMoistureChart = ({data}) => {

        let createSeries = (d,col) => {
            //d: 2-d array, with date in first column
            //col: column number to use
            let i
            let oseries = [];
            if (d) {
                for (i=0; i<d.length; i++) {
                    oseries.push([d[i][0],parseFloat(d[i][col])])
                };
            }
            return oseries;
        }

        const options = {
          title: {
            text: 'Soil Moisture'
          },
          tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
              xDateFormat:"%b %d, %Y", shape: 'rect',
              crosshairs: { width:1, color:"#ff0000", snap:true }},
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
          yAxis: {
              title:{ text:"Soil Moisture (%)", style:{"font-size":"14px", color:"#000000"}},
            },
          series: [{
            name:'Soil Moisture (2in)',
            type: 'line',
            color: '#134960',
            data: createSeries(data,1),
          },{
            name:'Soil Moisture (4in)',
            type: 'line',
            color: '#1A6180',
            data: createSeries(data,2),
          },{
            name:'Soil Moisture (8in)',
            type: 'line',
            color: '#2692BF',
            data: createSeries(data,3),
          },{
            name:'Soil Moisture (20in)',
            type: 'line',
            color: '#2DAADF',
            data: createSeries(data,4),
          },{
            name:'Soil Moisture (40in)',
            type: 'line',
            color: '#33C2FF',
            data: createSeries(data,5),
          }]
        }

        return (
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              containerProps = {{ className: 'chartContainer' }}
              options={options}
            />
        );

}

DisplaySoilMoistureChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default DisplaySoilMoistureChart;
