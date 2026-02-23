import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { Grid, Button } from '@material-ui/core';

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
            tooltype: 'current',
            showDocs: false
        }
    }

    handleChangeTooltype = (e) => {
        this.setState({
          tooltype: e.target.value,
        })
    }

    handleToggleDocs = () => {
        this.setState({
            showDocs: !this.state.showDocs
        })
    }

    render() {
        return (
            <div>
                <Grid container direction="column" justifyContent="flex-start" alignItems="center" spacing={3}>
                    <Grid item xs={12}>
                        <ToolTypeSelect
                            value={this.state.tooltype}
                            onchange={this.handleChangeTooltype}
                        />
                    </Grid>
                    <Grid item xs={12} style={{ width: '100%' }}>
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
                </Grid>

                <NwsAlerts
                    station={this.props.station}
                    stnname={this.props.stnname}
                    stncoords={this.props.stncoords}
                />

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                    <Button variant={this.state.showDocs ? "outlined" : "contained"} color="primary" onClick={this.handleToggleDocs} style={{ color: this.state.showDocs ? 'rgb(76, 175, 80)' : "white" }}>
                        {this.state.showDocs ? 'Hide' : 'Show'} Documentation and Tutorial
                    </Button>
                </div>
                {this.state.showDocs ? <WindHeatDoc /> : ''}
            </div>
        )
    }
}

export default WindHeat;
