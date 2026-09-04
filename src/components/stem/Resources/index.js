import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import StemMenu from '../StemMenu'

import MenuPopover from '../MenuPopover'

const styles = theme => ({
  menuButton: {
    marginRight: 20,
    marginTop: -10,
  },
  control: {
    padding: theme.spacing(2),
  },
});

@inject('store') @observer
class Resources extends Component {
  render() {
    const links = [{
      text: 'Careers with NRCS',
      href: 'https://www.nrcs.usda.gov/about/careers'
    },{
      text: 'NRCS Soil',
      href: 'https://www.nrcs.usda.gov/conservation-basics/soil'
    },{
      text: 'NRCS Soil Survey Manual',
      href: 'https://www.nrcs.usda.gov/resources/guides-and-instructions/soil-survey-manual'
    },{
      text: 'Soil Web App for Mobile Phones',
      href: 'https://www.nrcs.usda.gov/sites/default/files/2023-10/SoilWeb%20for%20iPhone%20and%20AndroidOS.pdf'
    },{
      text: 'National Oceanic and Atmospheric Administration Education Resources',
      href: 'https://www.noaa.gov/education'
    },{
      text: 'National Science Foundation Educational Resources: Earth and Environment',
      href: 'https://www.nsf.gov/focus-areas/earth-environment/educational-resources'
    },{
      text: 'USDA Climate Hub Tools',
      href: 'https://www.climatehubs.usda.gov/tools/all'
    },{
      text: 'National Weather Service - Jetstream - Online Weather School',
      href: 'https://www.noaa.gov/jetstream'
    },{
      text: 'NASA World Weather',
      href: 'https://worldwind.arc.nasa.gov/worldweather/'
    },{
      text: 'NASA Earth Observatory - Global Maps',
      href: 'https://science.nasa.gov/earth/earth-observatory/global-maps/'
    }];

    const { classes } = this.props;

    return (
      <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" className={classes.root} spacing={4}>
        <Grid item container justifyContent="flex-start" alignItems="flex-start" direction="row" xs={2} md={4} lg={3}>
          <Grid item>
            <Hidden mdUp>
              <MenuPopover/>
            </Hidden>
            <Hidden smDown>
              <StemMenu/>
            </Hidden>
          </Grid>
        </Grid>
        <Grid item container direction="column" className={classes.root} spacing={4} xs={10} md={8} lg={9}>
          <Grid item>
            <Typography variant="h5">
              Resource Links
            </Typography>
          </Grid>
          <Grid item>
            {links.map(({ href, text }) => (
              <Typography variant="body1" gutterBottom="true">
                &bull;&nbsp;<a href={href} target="_blank" rel="noopener noreferrer">{text}</a>
              </Typography>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Resources.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Resources);
