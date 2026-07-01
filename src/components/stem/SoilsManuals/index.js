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

//import soilsmanuals1 from '../../../assets/Soils/soils_manuals_1.png'

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

const images = require.context('../../../../public/stem_soils_images/', true);
let soilsmanuals1 = images('./soils_manuals_1.png');

//var app;

@inject('store') @observer
class SoilsManuals extends Component {

    //constructor(props) {
    //    super(props);
    //    app = this.props.store.app;
    //}

    render() {

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
                  <b>Soils : Manuals about KSSL Laboratory Data</b>
                </Typography>
              </Grid>
              <Grid container item spacing={4}>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    <b>Lab Methodology:  Soil Survey Laboratory Methods Manual, Soil Survey Laboratory Investigations Report No. 42</b> The “Soil Survey Laboratory Methods Manual” (SSIR 42) describes the methods used by the Kellogg Soil Survey Laboratory (KSSL) at the National Soil Survey Center (NSSC). The methods are documented by codes and linked with analytical results stored in the NCSS Soil Characterization Database.
                  </Typography>

                  <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/detail/soils/survey/tools/?cid=nrcs142p2_054247" target="_blank" rel="noopener noreferrer">https://www.nrcs.usda.gov/wps/portal/nrcs/detail/soils/survey/tools/?cid=nrcs142p2_054247</a><br/><br/>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    <b>Data Use and Application: Soil Survey Laboratory Information Manual, Soil Survey Laboratory Investigations Report No. 45:</b> The “Soil Survey Laboratory Information Manual” (SSIR 45) follows the same topical outline as the “Soil Survey Laboratory Methods Manual” (SSIR 42). The “Soil Survey Laboratory Information Manual” provides brief summaries of KSSL methods and detailed discussions of the use and application of the resulting data.  Soil survey data, including pedon characterization data, are used more appropriately when the operations for collecting, analyzing, and reporting the data are thoroughly understood. The “Soil Survey Laboratory Information Manual” describes the characterization data reports and thereby maximizes user understanding of the data.
                  </Typography>

                  <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/detail/soils/survey/tools/?cid=nrcs142p2_054165" target="_blank" rel="noopener noreferrer">https://www.nrcs.usda.gov/wps/portal/nrcs/detail/soils/survey/tools/?cid=nrcs142p2_054165</a><br/><br/>
                </Grid>
                <Grid item xs={10}>
                  <Typography align="left" paragraph variant="body1">
                    <b>Soil Water Retention, Moisture Content, and Flow:</b>
                  </Typography>
                  <a href="https://www.youtube.com/watch?v=vmo0FRAVgkM&feature=youtu.be" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=vmo0FRAVgkM&feature=youtu.be</a><br/><br/>
                    <img className={classes.docImage} src={soilsmanuals1} alt="Figures showing details about the soil-water relationship" />
                    <Typography align="left" paragraph variant="caption">
                      <b>Fig 1.</b> Soil-Water Relationship. Water can be held in three stages.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    Water and air move thorough the soil in pores and channels between particles or aggregates of soil.  The graph above shows water can be held in three stages:<br/><br/>
                    <b><u>Gravitational water:</u></b>  Water held so loosely that it moves downward by the force of gravity.<br/>
                    <b><u>Hydroscopic Water:</u></b> Water held tightly in pores or around soil particles;  plants can’t absorb and use it.<br/>
                    <b><u>Available Water:</u></b> Water that is available to plants that isn’t lost from the soil by gravity or held too tightly in the hydroscopic form.<br/><br/>
                    The boundary between gravitational and available water is called <b>field capacity</b>, which can be thought of as the amount of water the soil can hold after gravity drains the excess water following a rain event.  <b>Wilting point</b> is the boundary point between available and <b>hygroscopic water</b>; the amount of water a soil holds that is no longer available to plants.<br/><br/>
                    From the graph above, you can see that sandy soils hold the least amount of water and clayey soils the most.  The largest amount of plant available water is in silty soils, which have an ideal combination of large and small pore spaces.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

SoilsManuals.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SoilsManuals);
