///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

const DisplayPrecipChart = ({data,stnName}) => {

        const afterRender = (chart) => {
            //let textX = chart.plotLeft + (chart.plotWidth  * 0.5);
            let textY = chart.plotTop  + (chart.plotHeight * 0.5);
            if (Array.isArray(data)) {
                if (data.length===0) {
                    chart.renderer.text('No data to display', chart.plotLeft+40, textY).css({ color:"#ff0000", fontSize:"16px"}).add()
                }
            }
        };

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
            text: 'Precipitation'
          },
          subtitle: {
            text: 'Station: '+stnName
          },
          tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
              xDateFormat:"%b %d, %Y", shape: 'rect',
              crosshairs: { width:1, color:"#ff0000", snap:true }},
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
          yAxis: {
              title:{ text:"Precipitation (inches)", style:{"font-size":"14px", color:"#000000"}},
            },
          series: [{
            name:'Precipitation',
            type: 'column',
            color: 'green',
            data: createSeries(data,1),
          }]
        }

        return (
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              containerProps = {{ className: 'chartContainer' }}
              options={options}
              callback={afterRender}
            />
        );

}

DisplayPrecipChart.propTypes = {
  data: PropTypes.array.isRequired,
  stnName: PropTypes.string.isRequired,
};

export default DisplayPrecipChart;
