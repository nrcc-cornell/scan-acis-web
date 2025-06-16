import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/WindHeatTool.css';

import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import HighchartsReact from 'highcharts-react-official'

HighchartsMore(Highcharts)
Exporting(Highcharts)
ExportData(Highcharts)

const DisplayWindChillChart = ({data, stnName}) => {
        let max = 0;
        let min = 0;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            const windChill = data[i][1];
            if (windChill < min) min = windChill;
            if (max < windChill) max = windChill;
          }
        }

        const afterRender = (chart) => {
            let textY = chart.plotTop  + (chart.plotHeight * 0.5);
            if (data.length===0) {
                chart.renderer.text('No data to display', chart.plotLeft+40, textY).css({ color:"#ff0000", fontSize:"16px"}).add()
            }
        };

        const options = {
          title: {
            text: 'Wind Chill (°F)'
          },
          subtitle: {
            text: 'Station: '+stnName
          },
          exporting: { enabled: false },
          tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
              xDateFormat:"%b %d, %Y", shape: 'rect',valueDecimals:2,
              crosshairs: { width:1, color:"#ff0000", snap:true }},
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          legend: false,
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
          yAxis: {
              title:{ text:"Temperature (°F)",style:{"font-size":"14px", color:"#000000"}},
              max,
              min,
            },
          series: [{
            name:'Wind Chill',
            type: 'line',
            color: 'black',
            data,
          }]
        }

        return (
          <div id="wind-chill-chart">
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              containerProps = {{ className: 'chartContainer' }}
              options={options}
              callback={afterRender}
            />
          </div>
        );

}

DisplayWindChillChart.propTypes = {
  data: PropTypes.object.isRequired,
  stnName: PropTypes.string.isRequired,
};

export default DisplayWindChillChart;
