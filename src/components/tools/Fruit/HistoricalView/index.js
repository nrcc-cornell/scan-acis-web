import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import HistoricalChart from './HistoricalChart'
import HistoricalTable from './HistoricalTable'
import ViewBase from '../ViewBase';

var app;

// const fruitInfo = {
//   pawpaw: [{
//     value: 'veryEarly',
//     label: 'Very Early',
//     range: [2400,2499]
//   },{
//     value: 'early',
//     label: 'Early',
//     range: [2500,2599]
//   },{
//     value: 'middle',
//     label: 'Middle',
//     range: [2600,2699]
//   },{
//     value: 'late',
//     label: 'Late',
//     range: [2700,2799]
//   },{
//     value: 'veryLate',
//     label: 'Very Late',
//     range: [2800,2899]
//   }],
//   blueberryGrowth: [{
//     value: 'budding',
//     label: 'Budding',
//     range: [0,389]
//   },{
//     value: 'flowering',
//     label: 'Flowering',
//     range: [390,599]
//   },{
//     value: 'fruiting',
//     label: 'Fruiting',
//     range: [600,Infinity]
//   }],
//   blueberryHarvest: [{
//     value: 'underripe',
//     label: 'Fruit Underripe',
//     range: [0,999]
//   },{
//     value: 'optimal',
//     label: 'Optimal Harvest Period',
//     range: [1000,1300]
//   },{
//     value: 'overripe',
//     label: 'Fruit Overripe',
//     range: [1300,Infinity]
//   }]
// };

@inject('store') @observer
class HistoricalView extends Component {
    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.state = {
          disabled: []
        }
    }

    getChartInfo = (type) => {
      if (type==='pawpaw') {
        return {
          'typeLabel':'Pawpaw',
          'chartTitle': 'Timing of Peak Ripeness for Pawpaw Fruit Varieties',
          'dataInfo': [
            {key: 'transparent', label: '', color: 'transparent', missingColor: 'transparent'},
            {key: 'veryEarly', label: 'Very Early Variety', color: '#A6D5FF', missingColor: '#c9c9c9ff' },
            {key: 'early', label: 'Early Variety', color: '#5B73C2', missingColor: '#919191ff' },
            {key: 'middle', label: 'Middle Variety', color: '#613684', missingColor: '#676767' },
            {key: 'late', label: 'Late Variety', color: '#C70039', missingColor: '#434343' },
            {key: 'veryLate', label: 'Very Late Variety', color: '#581845', missingColor: '#1F1F1F' }
          ]
        }
      } else if (type==='blueberryGrowth') {
        return {
          'typeLabel':'Lowbush Blueberry Growth',
          'chartTitle': 'Timing of Lowbush Blueberry Growth Stages',
          'dataInfo': [
            {key: 'transparent', label: '', color: 'transparent', missingColor: 'transparent'},
            // { key: 'budding', label: 'Budding', color: '#8AD58F', missingColor: '#919191ff' },
            { key: 'flowering', label: 'Flowering', color: '#47BC4E', missingColor: '#676767' },
            { key: 'fruiting', label: 'Fruiting', color: '#205924', missingColor: '#434343' }
          ]
        }
      } else if (type==='blueberryHarvest') {
        return {
          'typeLabel':'Lowbush Blueberry Harvest',
          'chartTitle': 'Timing of Lowbush Blueberry Optimal Harvest Period',
          'dataInfo': [
            {key: 'transparent', label: '', color: 'transparent', missingColor: 'transparent'},
            // { key: 'underripe', label: 'Fruit Underripe', color: '#C70039', missingColor: '#919191ff' },
            { key: 'optimal', label: 'Optimal Harvest Period', color: '#47BC4E', missingColor: '#676767' },
            // { key: 'overripe', label: 'Fruit Overripe', color: '#581845', missingColor: '#434343' }
          ]
        }
      } else {
        return []
      }
    }

    handleClickLegend = (dataKey) => {
      // dataKey : key in legend of chart
      if (this.state.disabled.includes(dataKey)) {
        this.setState({
          disabled: this.state.disabled.filter(obj => obj !== dataKey)
        });
      } else {
        this.setState({ disabled: this.state.disabled.concat([dataKey]) });
      }
    }

    render() {
      const options = [{
        title: 'Fruit',
        name: 'fruit-name',
        options: [
            { label: 'Pawpaw', value: 'pawpaw' },
            { label: 'Lowbush Blueberry Growth', value: 'blueberryGrowth' },
            { label: 'Lowbush Blueberry Harvest', value: 'blueberryHarvest' }
        ],
        selected: app.getToolName,
        onChange: app.fruittool_setFruitFromRadioGroup,
        type: 'radio'
      },{
        title: 'GDD Base (°F)',
        btnAriaLabel: 'update growing degree day base',
        value: app.fruittool_getBase,
        onChange: app.fruittool_setBaseManually,
        type: 'number'
      }];

      const data = app.fruittool_getHistoricalSummary;
      const info = this.getChartInfo(app.getToolName);

      return (
        <ViewBase
          options={options}
          chart={<HistoricalChart
            data={data}
            chartInfo={info}
            stnName={this.props.stnname}
            disabled={this.state.disabled}
          />}
          table={<HistoricalTable
            data={data}
            tableInfo={info}
          />}
        />
      );
    }
}

export default HistoricalView;

