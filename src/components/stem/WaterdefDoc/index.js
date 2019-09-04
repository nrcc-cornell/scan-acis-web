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

//import scanstn from '../../../assets/scan-station.png'

// Styles
//import '../../../styles/StemWaterdefDoc.css';

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
class WaterdefDoc extends Component {

    //constructor(props) {
    //    super(props);
    //    app = this.props.store.app;
    //}

    render() {

        const { classes } = this.props;

        return (
          <Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.root} spacing={0}>
            <Grid item container justify="flex-start" alignItems="flex-start" direction="row" xs={2} md={3}>
              <Grid item>
                <Hidden mdUp>
                  <MenuPopover/>
                </Hidden>
                <Hidden smDown>
                  <StemMenu/>
                </Hidden>
              </Grid>
            </Grid>
            <Grid item container className={classes.root} spacing={4} xs={10} md={9}>
              <Grid item>
                <Typography variant="h5">
                  About the Water Deficit Calculator
                </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      What does this tool do?
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      This tool calculates the soil water deficit for a selected range of soil depths. Deficits are presented relative to the field capacity of soil at the site of interest. Therefore, the calculated water deficit reprepresents the amount of water, from either precipitation or irrigation methods, that would be necessary to bring soil moisture amounts back to field capacity.
                    </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      Sources of data
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Soil characterization data from the National Soil Survey Center is available for most SCAN sites. For this tool, the van Genuchten retention parameters are used from these data to estimate the field capacity and wilting point for each soil horizon at the site of interest. Observations from SCAN soil sensors are then obtained to provide this tool with daily snapshots of volumetric soil moisture at up to five soil depths (2, 4, 8, 20 and 40 inches). Together, these data provide the means to estimate the available water deficit at any depth, or range of depths, within the soil profile.
                    </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      How to use this tool
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>1. User Options</i><br/>
                      Once your site is selected, there are two options to choose from at the top of the tool: the year, and the range of soil depths. The year selection defaults to the current year, while the soil depth defaults to the top 12 inches of the soil profile. To change the soil depth, click and drag the handles of the selected range to the depths of interest.
                      <i>2. Output</i><br/>
                      Water deficit values that correspond to your selections will appear below the user options. 
                      
                    </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

WaterdefDoc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WaterdefDoc);
