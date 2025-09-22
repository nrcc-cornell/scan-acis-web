import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { Typography, Grid } from '@material-ui/core';

// Components
import CurrentView from './CurrentView'
import HistoricalView from './HistoricalView'
import ToolTypeSelect from './ToolTypeSelect'
import NwsAlerts from './NwsAlerts';
import WindHeatDoc from './WindHeatDoc';


var app;

@inject('store') @observer
class WindHeat extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('windheat')
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
                    <Grid item>
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
                        <NwsAlerts
                            station={this.props.station}
                            stnname={this.props.stnname}
                            stncoords={this.props.stncoords}
                        />

                        <Typography align="justify" paragraph variant="body1">
                            <WindHeatDoc />
                        </Typography>
                    </div>
                </Grid>
            </div>
        )
    }
}

export default WindHeat;
