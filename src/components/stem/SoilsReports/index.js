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

//import soilsreports1 from '../../../assets/Soils/soils_reports_1.png'
//import soilsreports2 from '../../../assets/Soils/soils_reports_2.png'
//import soilsreports3 from '../../../assets/Soils/soils_reports_3.png'
//import soilsreports4 from '../../../assets/Soils/soils_reports_4.png'
//import soilsreports5 from '../../../assets/Soils/soils_reports_5.png'
//import soilsreports6 from '../../../assets/Soils/soils_reports_6.png'

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
let soilsreports1 = images('./soils_reports_1.png');
let soilsreports2 = images('./soils_reports_2.png');
let soilsreports3 = images('./soils_reports_3.png');
let soilsreports4 = images('./soils_reports_4.png');
let soilsreports5 = images('./soils_reports_5.png');
let soilsreports6 = images('./soils_reports_6.png');

//var app;

@inject('store') @observer
class SoilsReports extends Component {

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
                  <b>Soils : Reports on TSCAN sites</b>
                </Typography>
              </Grid>
              <Grid container item spacing={4}>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    Reports on the soils for each TSCAN and SCAN sites are available from the Kellogg Soil Survey Laboratory at the National Soil Survey Center:
                  </Typography>

                  <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/main/soils/research/" target="_blank" rel="noopener noreferrer">https://www.nrcs.usda.gov/wps/portal/nrcs/main/soils/research/</a><br/><br/>
                  <Typography align="left" paragraph variant="body1">
                    All the sampled pedons that have been analyzed by the laboratory over time are shown in Figure 1.
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                    <img className={classes.docImage} src={soilsreports1} alt="Map showing all pedons with laboratory characterization from the NRCS Kellogg Soil Survey Laboratory" />
                    <Typography align="left" paragraph variant="caption">
                      <b>Fig 1.</b> Map showing all pedons with laboratory characterization from the NRCS Kellogg Soil Survey Laboratory.  Interactive map is available <a href="https://nrcs.maps.arcgis.com/apps/webappviewer/index.html?id=956154f98fc94edeaa2dbad99bb224af" target="_blank" rel="noopener noreferrer">here</a>.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    These data are produced by the Kellogg Soil Survey Lab (KSSL) in Lincoln, NE: Both laboratory and field data can be queried from:
                  </Typography>
                  <a href="https://ncsslabdatamart.sc.egov.usda.gov/" target="_blank" rel="noopener noreferrer">https://ncsslabdatamart.sc.egov.usda.gov/</a>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    Also, these data are available on this ACIS website, listed under “Station Information”.  An example from the Lower Brule South Dakota TSCAN site is shown in Figure 2.
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                    <img className={classes.docImage} src={soilsreports2} alt="Listing of reports from the National Soil Survey Center" />
                    <Typography align="left" paragraph variant="caption">
                      <b>Fig 2.</b> Sample report information available under "Station Information" on the front page of this site.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    The soils data sheets included are: Primary Characterization, Supplemental Characterization, and Soil Water Retention Curve.  These data sheets are an organized report for users to locate data important for whatever interpretive land use decisions of interest; agriculture, wildlife, forestry, engineering.<br/><br/>
                    The NASIS (National Soil Information System) pedon description is field data (site and soil properties) collected during the sampling of the soils.  An exposure of the soil is used (Figure 3), preferably a pit dug to 2 m deep or a root limiting layer (e.g., bedrock):
                  </Typography>
                </Grid>
                <Grid container item direction="row" alignItems="flex-end" xs={10}>
                    <Grid item xs={7}>
                      <img className={classes.docImage} src={soilsreports3} alt="Soil scientists in a pit dug to two meter depth" />
                      <Typography align="left" paragraph variant="caption">
                        <b>Fig 3.</b> Soil scientists view exposed soil (above). Reference scale reveals depth, and markers delineate soil horizons (right).
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <img className={classes.docImage} src={soilsreports4} alt="Exposed soil from the side of a two meter deep pit" />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    Soil scientists use various tools to describe and sample the soil.  For the description, specific criteria are identified and recorded for each horizon (layer) using a field guide (Figures 4 & 5).  Also a color book is used to describe the different colors in the horizons.
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                    <img className={classes.docImage} src={soilsreports5} alt="Two manuals used for describing soils" />
                    <Typography align="left" paragraph variant="caption">
                      <b>Fig 4.</b> Two manuals used for describing soils; the Munsell Soil-Color Charts, and the Field Book for Describing and Sampling Soils (a guide for terminology used).
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <img className={classes.docImage} src={soilsreports6} alt="A page from the Munsell Soil-Color Charts" />
                    <Typography align="left" paragraph variant="caption">
                      <b>Fig 5.</b> A page from the color book showing how colors are organized by hue, value, and chroma.
                    </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

SoilsReports.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SoilsReports);
