import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';

// Components
import CurrentView from './CurrentView'
import HistoricalView from './HistoricalView'
import ToolTypeSelect from './ToolTypeSelect'
import HeatidxDoc from './HeatidxDoc';

var app;

@inject('store') @observer
class LivestockIdxTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('livestock')
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
                
                <HeatidxDoc />
            </div>
        )
    }
}

export default LivestockIdxTool;
