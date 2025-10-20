import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import LoadingOverlay from 'react-loading-overlay';
import { Grid, Hidden } from '@material-ui/core';
import VarPicker from '../../../VarPicker';
import VarPopover from '../../../VarPopover';

import './viewBase.css';

var app;

@inject('store') @observer
class ViewBase extends Component {
    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {
      return (
        <Grid container direction="row" alignItems="flex-start">
            <Hidden smDown>
              <Grid item container className="nothing" direction="column" md={2}>
                <Grid item>
                  <VarPicker options={this.props.options} />
                </Grid>
              </Grid>
            </Hidden>
            <Grid item container className="nothing" direction="column" xs={12} md={10}>
              <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={1}>
                <Hidden mdUp>
                  <Grid item>
                    <VarPopover>
                      <VarPicker options={this.props.options} />
                    </VarPopover>
                  </Grid>
                </Hidden>
              </Grid>
              <Grid item>
                <LoadingOverlay
                  active={app.fruittool_dataIsLoading}
                  spinner
                  background={'rgba(255,255,255,1.0)'}
                  color={'rgba(34,139,34,1.0)'}
                  spinnerSize={'10vw'}
                >
                  {this.props[app.getOutputType]}
                </LoadingOverlay>
              </Grid>
            </Grid>
          </Grid>
      );
    }
}

export default ViewBase;