///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
//import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import StemMenu from '../StemMenu'

// Components
import MenuPopover from '../MenuPopover'

import scanstn from '../../../assets/scan-station.png'

// Styles
import '../../../styles/StemInstrumentation.css';

const styles = theme => ({
  root: {
    //flexGrow: 1,
  },
  menuButton: {
    marginRight: 20,
    marginTop: -10,
    //[theme.breakpoints.up('md')]: {
    //  display: 'none',
    //},
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

//var app;

@inject('store') @observer
class Instrumentation extends Component {

    //constructor(props) {
    //    super(props);
    //    app = this.props.store.app;
    //}

    render() {

        const { classes } = this.props;

        return (
          <Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.root} spacing={0}>
            <Grid item container justify="flex-start" alignItems="flex-start" direction="row" xs={2} sm={1} lg={3}>
              <Grid item>
                <Hidden lgUp>
                  <MenuPopover/>
                </Hidden>
                <Hidden mdDown>
                  <StemMenu/>
                </Hidden>
              </Grid>
            </Grid>
            <Grid item container direction="column" className={classes.root} spacing={32} xs={10} lg={9}>
              <Grid item>
                <Typography variant="h5">
                  Instrumentation
                </Typography>
              </Grid>
            <Grid item container direction="row" className={classes.root} spacing={32}>
              <Grid item>
                    <img className="scan-station-instrument" src={scanstn} alt="SCAN instrumentation"/>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      (Name of selected instrument here)
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                      <ul>
                        <li>What is it?</li>
                        <li>What it measures.</li>
                        <li>Why we measure.</li>
                      </ul>
                    </Typography>
              </Grid>
            </Grid>
            </Grid>
          </Grid>
        );
    }
}

Instrumentation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Instrumentation);
