import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import CurrentChart from './CurrentChart'
import CurrentTable from './CurrentTable'
import ViewBase from '../ViewBase';

var app;

@inject('store') @observer
class CurrentView extends Component {
    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    state = {
      pawpaw: [{
        value: 'kyChampion',
        label: 'KY Champion',
        checked: false,
        gdds: 2535
      },{
        value: 'middletown',
        label: 'Middletown',
        checked: true,
        gdds: 2823
      },{
        value: 'mitchell',
        label: 'Mitchell',
        checked: false,
        gdds: 2736
      },{
        value: 'nc1',
        label: 'NC-1',
        checked: false,
        gdds: 2620
      },{
        value: 'overleese',
        label: 'Overleese',
        checked: false,
        gdds: 2637
      },{
        value: 'paGolden',
        label: 'PA-Golden',
        checked: true,
        gdds: 2499
      },{
        value: 'potomac',
        label: 'Potomac',
        checked: false,
        gdds: 2720
      },{
        value: 'rappahannock',
        label: 'Rappahannock',
        checked: true,
        gdds: 2586
      },{
        value: 'shenandoah',
        label: 'Shenandoah',
        checked: true,
        gdds: 2697
      },{
        value: 'sunflower',
        label: 'Sunflower',
        checked: false,
        gdds: 2737
      },{
        value: 'susquehanna',
        label: 'Susquehanna',
        checked: false,
        gdds: 2703
      },{
        value: 'taylor',
        label: 'Taylor',
        checked: false,
        gdds: 2676
      },{
        value: 'taytwo',
        label: 'Taytwo',
        checked: false,
        gdds: 2648
      },{
        value: 'wabash',
        label: 'Wabash',
        checked: false,
        gdds: 2572
      },{
        value: 'wells',
        label: 'Wells',
        checked: false,
        gdds: 2751
      },{
        value: 'wilson',
        label: 'Wilson',
        checked: false,
        gdds: 2710
      }],
      blueberryGrowth: [{
        value: 'flowering',
        label: 'First Flowers',
        checked: true,
        gdds: 390
      },{
        value: 'fruiting',
        label: 'Begin Fruit Development',
        checked: true,
        gdds: 600
      }],
      blueberryHarvest: [{
        value: 'harvestable',
        label: 'Optimal Harvest Period',
        checked: true,
        gdds: 1000
      },{
        value: 'overripe',
        label: 'Fruit Overripe',
        checked: true,
        gdds: 1300
      }]
    };

    handleCheckboxChange(k,v) {
      const index = this.state.pawpaw.findIndex(obj => obj.value === k);
      const newPawpaw = JSON.parse(JSON.stringify(this.state.pawpaw));
      newPawpaw[index].checked = v;
      this.setState({
        pawpaw: newPawpaw,
      })
    }

    render() {
      const yearsInPeriod = app.fruittool_getClimateSummaryYearsInPOR;
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
        title: 'Year',
        name: 'year',
        options: app.fruittool_getYearOptions.map(v => ({ label: v, value: v })),
        selected: app.fruittool_selectedYear,
        onChange: app.fruittool_setSelectedYear,
        type: 'selector',
        children: [<div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}><span key='period-definition' style={{'color':'#797979ff'}}>* "Period": {yearsInPeriod[yearsInPeriod.length - 1]}-{yearsInPeriod[0]}</span></div>],
      },{
        title: 'GDD Base (°F)',
        btnAriaLabel: 'update growing degree day base',
        value: app.fruittool_getBase,
        onChange: app.fruittool_setBaseManually,
        type: 'number'
      }];

      if (app.getToolName === 'pawpaw') {
        options.push({
          title: 'Varieties',
          type: 'checkbox',
          options: this.state.pawpaw.map(({ value, label, checked }) => ({
            label,
            value,
            checked,
            onChange: (e) => this.handleCheckboxChange(value, e.target.checked)
          }))
        });
      // } else if (app.getToolName === 'blueberry') {
      //   options.push({
      //     title: 'Phenological Stage',
      //     type: 'checkbox',
      //     options: variable_options.map(([n,h]) => ({
      //       label: app.wxgraph_getVarLabels[`${n}_label`],
      //       value: n,
      //       checked: app.wxgraph_getVars[n],
      //       onChange: app.wxgraph_setVars(n),
      //       canBeDisabled: h
      //     })),
      //     children: [app.wxgraph_getTimeFrame ==='two_days' ? '' : <span key='hrly-only' style={{'color':'#AAA'}}>* hourly data only</span>],
      //     disabled: app.wxgraph_getTimeFrame !=='two_days'
      //   });
      }

      return (
        <ViewBase
          options={options}
          chart={<CurrentChart vertLines={this.state[app.getToolName].filter(obj => obj.checked).toSorted((a,b) => b.gdds - a.gdds)} />}
          table={<CurrentTable />}
        />
      );
    }
}

export default CurrentView;

