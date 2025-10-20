import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import { Grid, Typography } from '@material-ui/core';
import CurrentView from './CurrentView';
import HistoricalView from './HistoricalView';
import FruittoolDoc from './FruittoolDoc';
import ToolTypeSelect from './ToolTypeSelect';

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
            tooltype: 'current'
        }
    }

    handleChangeTooltype = (e) => {
        this.setState({
          tooltype: e.target.value,
        })
    }

    render() {
      return (
        <div>
            <Grid container direction="column" justifyContent="flex-start" alignItems="center" spacing={3}>
                <Grid item>
                    <ToolTypeSelect
                        value={this.state.tooltype}
                        onchange={this.handleChangeTooltype}
                    />
                </Grid>
                <Grid item className='fruit-tool'>
                    {this.state.tooltype==='current' &&
                        <CurrentView
                            station={this.props.station}
                            stnname={this.props.stnname}
                            outputtype={this.props.outputtype}
                        />
                    }
                    {this.state.tooltype==='historical' &&
                        <HistoricalView
                            station={this.props.station}
                            stnname={this.props.stnname}
                            outputtype={this.props.outputtype}
                        />
                    }
                </Grid>

                <div className="about-contents">
                    <Typography align="justify" paragraph variant="body1">
                        <FruittoolDoc />
                    </Typography>
                </div>
            </Grid>
        </div>
      );
    }
}

export default FruitTool;

