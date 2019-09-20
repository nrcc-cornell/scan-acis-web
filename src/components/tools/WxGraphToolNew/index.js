///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';

// Components
import BasicDataView from './BasicDataView'
import ExtremeDataView from './ExtremeDataView'
import ToolTypeSelect from './ToolTypeSelect'

var app;

@inject('store') @observer
class WxGraphTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('wxgrapher')
        this.state = {
            tooltype: 'basic'
        }
    }

    handleChangeTooltype = (e) => {
        this.setState({
          tooltype: e.target.value,
        })
    }

    render() {

        return (

            <Grid container direction="column" justify="flex-start" alignItems="center" xs={12} spacing={3}>
                <Grid item>
                  <ToolTypeSelect
                      value={this.state.tooltype}
                      onchange={this.handleChangeTooltype}
                  />
                </Grid>
                <Grid item>
                  {this.state.tooltype==='basic' &&
                      <BasicDataView
                          station={this.props.station}
                          stnname={this.props.stnname}
                          outputtype={this.props.outputtype}
                      />
                  }
                  {this.state.tooltype==='extreme' &&
                      <ExtremeDataView
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

export default WxGraphTool;
