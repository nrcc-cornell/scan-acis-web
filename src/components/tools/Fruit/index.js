import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import { Grid, Hidden } from '@material-ui/core';
import CurrentView from './CurrentView';
import HistoricalView from './HistoricalView';
import FruittoolDoc from './FruittoolDoc';
import ToolTypeSelect from './ToolTypeSelect';
import VarPicker from '../../VarPicker';

import CollapsibleDocumentation from '../../CollapsibleDocumentation';

var app;

@inject('store') @observer
class FruitTool extends Component {
    constructor(props) {
      super(props);
      app = this.props.store.app;

      let toolName = app.getToolName;
      if (!['pawpaw','blueberryGrowth','blueberryHarvest'].includes(toolName)) {
        app.setToolName('pawpaw');
        toolName = 'pawpaw';
      }
      if (!app.getLocations || !app.getLocation) {
        // get all stations, set selected station, and download data for selected tool
        app.downloadStationInfo()
      } else {
        // stations are already set, just download data for selected tool
        app.fruittool_downloadData();
      }

      this.state = {
        tooltype: 'current',
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
      }
    }

    handleChangeTooltype = (e) => {
      this.setState({
        tooltype: e.target.value,
      })
    }

    handleCheckboxChange(k,v) {
      const index = this.state.pawpaw.findIndex(obj => obj.value === k);
      const newPawpaw = JSON.parse(JSON.stringify(this.state.pawpaw));
      newPawpaw[index].checked = v;
      this.setState({
        pawpaw: newPawpaw,
      })
    }

    render() {
      let options;
      if (this.state.tooltype==='current') {
        if (parseInt(app.fruittool_getYearOptions[0], 10) < parseInt(app.fruittool_selectedYear, 10)) {
          app.fruittool_setSelectedYear(app.fruittool_getYearOptions[0]);
        }
  
        const yearsInPeriod = app.fruittool_getClimateSummaryYearsInPOR;
        options = [{
          title: 'Fruit',
          name: 'fruit-name',
          options: [
            { label: 'Pawpaw Growth', value: 'pawpaw' },
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
        }
      } else {
        options = [{
          title: 'Fruit',
          name: 'fruit-name',
          options: [
              { label: 'Pawpaw Growth', value: 'pawpaw' },
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
      }

      return (
        <div>
            <Grid container direction="column" justifyContent="flex-start" alignItems="center" spacing={3}>
                <Grid item>
                    <ToolTypeSelect
                        value={this.state.tooltype}
                        onchange={this.handleChangeTooltype}
                    />
                </Grid>
                <Grid item container className='fruit-tool'>
                    <Hidden smDown>
                      <Grid item md={2}>
                        <VarPicker options={options} />
                      </Grid>
                    </Hidden>

                    <Grid item xs={12} md={10}>
                      {this.state.tooltype==='current' &&
                          <CurrentView
                              options={options}
                              lines={this.state[app.getToolName]}
                              station={this.props.station}
                              stnname={this.props.stnname}
                              outputtype={this.props.outputtype}
                          />
                      }
                      {this.state.tooltype==='historical' &&
                          <HistoricalView
                              options={options}
                              station={this.props.station}
                              stnname={this.props.stnname}
                              outputtype={this.props.outputtype}
                          />
                      }
                      
                      <div style={{ marginTop: '18px' }}>
                        <CollapsibleDocumentation
                          docsProp={<FruittoolDoc />}
                        />
                      </div>
                    </Grid>
                </Grid>
            </Grid>
        </div>
      );
    }
}

export default FruitTool;

