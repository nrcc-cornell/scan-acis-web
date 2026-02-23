import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import HistoricalChart from './HistoricalChart'
import HistoricalTable from './HistoricalTable'
import ViewBase from '../ViewBase';

var app;

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
            {key: 'veryEarly', label: 'Very Early Variety', color: '#33C2FF', missingColor: '#c9c9c9ff' },
            {key: 'early', label: 'Early Variety', color: '#2DAADF', missingColor: '#919191ff' },
            {key: 'middle', label: 'Middle Variety', color: '#2692BF', missingColor: '#676767' },
            {key: 'late', label: 'Late Variety', color: '#1A6180', missingColor: '#434343' },
            {key: 'veryLate', label: 'Very Late Variety', color: '#134960', missingColor: '#1F1F1F' }
          ]
        }
      } else if (type==='blueberryGrowth') {
        return {
          'typeLabel':'Lowbush Blueberry Growth',
          'chartTitle': 'Timing of Lowbush Blueberry Growth Stages',
          'dataInfo': [
            {key: 'transparent', label: '', color: 'transparent', missingColor: 'transparent'},
            // { key: 'budding', label: 'Budding', color: '#8AD58F', missingColor: '#919191ff' },
            { key: 'flowering', label: 'Flowering', color: '#82ca9d', missingColor: '#676767' },
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
            { key: 'optimal', label: 'Optimal Harvest Period', color: '#82ca9d', missingColor: '#676767' },
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
      const data = app.fruittool_getHistoricalSummary;
      const info = this.getChartInfo(app.getToolName);

      return (
        <ViewBase
          options={this.props.options}
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

