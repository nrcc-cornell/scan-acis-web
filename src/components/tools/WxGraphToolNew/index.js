import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';

// Components
import BasicDataView from './BasicDataView'
import ExtremeDataView from './ExtremeDataView'
import ToolTypeSelect from './ToolTypeSelect'
import WxgraphDoc from './WxgraphDoc';

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
            <div>
                <Grid container direction="column" justifyContent="flex-start" alignItems="center" spacing={3}>
                    <Grid item xs={12}>
                    <ToolTypeSelect
                        value={this.state.tooltype}
                        onchange={this.handleChangeTooltype}
                    />
                    </Grid>
                    <Grid item xs={12} >
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

                <WxgraphDoc />
            </div>
        )
    }
}

export default WxGraphTool;
