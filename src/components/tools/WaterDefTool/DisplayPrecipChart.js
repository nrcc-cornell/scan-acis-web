///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

const DisplayPrecipChart = ({data}) => {

        const options = {
          title: {
            text: 'Precipitation'
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
            data: data,
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

DisplayPrecipChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default DisplayPrecipChart;
