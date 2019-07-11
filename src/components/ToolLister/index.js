///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

// Components
import ToolCard from '../../components/ToolCard';

// Styles
import '../../styles/ToolLister.css';

var app;

@inject('store') @observer
class ToolLister extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="tool-lister">
            <Grid container direction="column" spacing={2}>
             <Grid item container justify="space-evenly" spacing={3}>
              <Grid item>
                <ToolCard {...app.getToolInfo('gddtool')} />
              </Grid>
              <Grid item>
                <ToolCard {...app.getToolInfo('waterdef')} />
              </Grid>
              <Grid item>
                <ToolCard {...app.getToolInfo('wxgrapher')} />
              </Grid>
              <Grid item>
                <ToolCard {...app.getToolInfo('livestock')} />
              </Grid>
             </Grid>
            </Grid>
            <br/>
            </div>
        );
    }
}

export default ToolLister;
