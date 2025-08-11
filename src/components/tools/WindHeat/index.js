import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';

// Components
import CurrentView from './CurrentView'
import HistoricalView from './HistoricalView'
import ToolTypeSelect from './ToolTypeSelect'
import NwsAlerts from './NwsAlerts';

var app;

@inject('store') @observer
class WindHeat extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('windheat')
        this.state = {
            tooltype: 'current',
            nws: []
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
                    <Grid item xs={12}>
                        <ToolTypeSelect
                            value={this.state.tooltype}
                            onchange={this.handleChangeTooltype}
                        />
                    </Grid>
                    <Grid item xs={12} >
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

                <Grid container direction="column" justifyContent="flex-start" alignItems="center" spacing={3}>
                    <NwsAlerts
                        station={this.props.station}
                        stnname={this.props.stnname}
                        stncoords={this.props.stncoords}
                    />
                </Grid>
            </div>

        )
    }
}

export default WindHeat;
