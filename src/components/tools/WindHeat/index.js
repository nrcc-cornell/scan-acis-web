///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';

// Components
import CurrentView from './CurrentView'
import HistoricalView from './HistoricalView'
import ToolTypeSelect from './ToolTypeSelect'

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

        )
    }
}

export default WindHeat;
