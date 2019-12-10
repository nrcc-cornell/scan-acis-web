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

import soilsoverview1 from '../../../assets/Soils/soils_overview_1.png'
import soilsoverview2 from '../../../assets/Soils/soils_overview_2.png'

// Components
import MenuPopover from '../MenuPopover'

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
    padding: theme.spacing(2),
  },
});

//var app;

@inject('store') @observer
class SoilsOverview extends Component {

    //constructor(props) {
    //    super(props);
    //    app = this.props.store.app;
    //}

    render() {

        const { classes } = this.props;

        return (
          <Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.root} spacing={4}>
            <Grid item container justify="flex-start" alignItems="flex-start" direction="row" xs={2} md={4} lg={3}>
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
                  <b>Soils : Overview</b>
                </Typography>
              </Grid>
              <Grid container item spacing={4}>
                <Grid item xs={12} lg={8}>
                  <Typography align="left" paragraph variant="body1">
                    Soil is composed of both inorganic (mineral) and organic (decaying plants) materials that undergo transformation by physical and chemical processes to form an organized composite on terrestrial surfaces.  The three-dimensional soil body has mineral and organic matter, but also has void spaces (pores and channels) that hold and allow the movement of water and air.  Over time, soils form layers (horizons) that reflect the accumulation, loss, or transformation of mineral and organic material through the soil.  These alterations can occur in both vertical and horizontal directions.  Soils are classified at the highest level into 12 soil orders, ranging from very young, limited amount of soil formation (Entisols), young (Inceptisols), mature (Alfisols), old (Ultisols) and very old (Oxisols) soils.  A description of all 12 soil orders can be found at the following link:<br/>
                  </Typography>

                  <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/detail/soils/survey/class/data/?cid=nrcs142p2_053588" target="_blank" rel="noopener noreferrer">https://www.nrcs.usda.gov/wps/portal/nrcs/detail/soils/survey/class/data/?cid=nrcs142p2_053588</a><br/><br/>
                  <Typography align="left" paragraph variant="body1">
                    The age of a soil is relative and is determined by landscape position (topography or relief), parent material, climate, organisms (generally vegetation), and time.  These conditions are referred to as the Five Factors of Soil Formation.  Soils that form on steep slopes or in an active depositional area such as on a river floodplain, are often young (limited development of horizons), while soils on stable, level landforms in a warm, humid environment are generally older (greater development of horizons, more clay movement into the subsoil).
                  </Typography>
                </Grid>
                <Grid item xs={8} lg={4}>
                    <img className="doc-image" src={soilsoverview1} alt="Poster showing the 12 Orders of Soil Taxonomy" />
                    <Typography align="left" paragraph variant="caption">
                      Poster showing the 12 Orders of Soil Taxonomy.  Available for <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/detail/soils/survey/class/data/?cid=nrcs142p2_053588" target="_blank" rel="noopener noreferrer">download here</a>.
                    </Typography>
                </Grid>
              </Grid>
              <Grid container item spacing={4}>
                <Grid item xs={12} lg={8}>
                  <Typography align="left" paragraph variant="body1">
                    <b>Horizons:</b> Soils generally form layers that are horizontal to the land surface.  These horizons provide names that signify their primary characteristics:<br/>
                    <b>O:</b> Organic horizon composed predominantly of decomposing plant materials.<br/>
                    <b>A:</b> Uppermost mineral horizon that is darkened by inclusion of some organic materials.<br/>
                    <b>B:</b> The horizon that best expressed in developed (mature) soils on stable land surfaces and represents a layer of accumulation, most commonly of clay.  It is lighter in color than the A horizon since it contains less organic matter and is often brown or reddish in color due to iron oxide coatings on soil particles.  Formation of a weakly-expressed B horizon occurs in a short time (several decades) in many soils.<br/>
                    <b>C:</b> The lower horizon that shows only slight weathering from soil formation and lacks characteristics of overlying soil horizons.<br/>
                  </Typography>
                </Grid>
                <Grid item xs={8} lg={4}>
                    <img className="doc-image" src={soilsoverview2} alt="Diagram of a soil profile showing the four primary soil horizons" />
                    <Typography align="left" paragraph variant="caption">
                      Diagram of a soil profile showing the four primary soil horizons.  Many other subhorizons can be designated and described by soil scientists.
                    </Typography>
                </Grid>
              </Grid>
              <Grid container item spacing={4}>
                  <Typography align="left" paragraph variant="body1">
                    <b>Additional resources on this topic:</b><br/><br/>
                    &bull;&nbsp;There are <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/detail/soils/edu/?cid=nrcs142p2_054280" target="_blank" rel="noopener noreferrer">various ways to define what soil is</a>.<br/>
                    &bull;&nbsp;NRCS has a <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/main/soils/edu/" target="_blank" rel="noopener noreferrer">Soils Education site</a> for all levels.
                  </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

SoilsOverview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SoilsOverview);
