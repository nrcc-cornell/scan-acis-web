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

//import soilsexample11 from '../../../assets/Soils/soils_example_1_1.png'
//import soilsexample12 from '../../../assets/Soils/soils_example_1_2.png'
//import soilsexample13 from '../../../assets/Soils/soils_example_1_3.png'
//import soilsexample21 from '../../../assets/Soils/soils_example_2_1.png'
//import soilsexample22 from '../../../assets/Soils/soils_example_2_2.png'
//import soilsexample23 from '../../../assets/Soils/soils_example_2_3.png'

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
let soilsexample11 = images('./soils_example_1_1.png');
let soilsexample12 = images('./soils_example_1_2.png');
let soilsexample13 = images('./soils_example_1_3.png');
let soilsexample21 = images('./soils_example_2_1.png');
let soilsexample22 = images('./soils_example_2_2.png');
let soilsexample23 = images('./soils_example_2_3.png');

//var app;

@inject('store') @observer
class SoilsExamples extends Component {

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
                  <b>Soils : Example Pedons</b>
                </Typography>
              </Grid>
              <Grid container item spacing={4}>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    <b>EXAMPLE PEDON 1: Lower Brule Tribe, South Dakota</b>
                  </Typography>
                </Grid>
                <Grid container item direction="row" alignItems="flex-end" xs={10}>
                    <Grid item xs={7}>
                      <img className="doc-image" src={soilsexample11} alt="Map location of the Lower Brule Tribe TSCAN climate station in South Dakota" />
                    </Grid>
                    <Grid item xs={5}>
                      <img className="doc-image" src={soilsexample12} alt="Soil profile from the Lower Brule Tribe TSCAN climate station location" />
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    <img className="doc-image" src={soilsexample13} alt="TSCAN climate station equipment at the Lower Brule Tribe location" />
                </Grid>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    This soil is a representative of the <a href="https://soilseries.sc.egov.usda.gov/OSD_Docs/L/LOWRY.html" target="_blank" rel="noopener noreferrer">Lowry series</a>, a very deep, well-drained soil on a nearly level landscape (1.5% slope).  It is in the Mollisol Order, a taxonomic class of soils that commonly have an accumulation of organic carbon in the upper mineral horizons.  Mollisols are common in the Midwest U.S.; developing under tallgrass or shortgrass, deep-rooted, prairie ecosystems.  As a result, this soil pedon is quite dark throughout the profile.  The total carbon content in the lab data ranges from 1.8 % in the surface (A) horizon and remains over 1% throughout the entire soil (to 200 cm).  In this soil, the total carbon is composed of both organic (i.e., organic matter, generally plant materials in various stages of decay) and inorganic fractions.  The inorganic carbon fraction is composed of carbonates (lime) that are present in soils of dryer regions.  In this soil, the carbonate content varies from less than 5% in the upper four horizons to 15% in the lowermost sampled (Bkb) horizon.  The Lowry soil makes up 90% or more of the cropland that the Lower Brule Tribe manage as part of their farm.  This site formed on a higher terrace (paleoterrace) of the nearby Missouri River and can be regarded as a fairly young soil as it has a B horizon, but no large clay increase in that horizon (the clay increases from 15% in the A horizon to about 16-19% in the B horizons.  The texture in all horizons is silt loam, with a silt content ranging from 64 to 70%.  The pedon has a second (buried) A horizon beginning at 156 cm, reinforcing the concept that the material forming this soil was deposited by either water or wind many years before.  Soil scientists believe the soil is principally wind-blown (loess) derived material blown off bare floodplains of the Missouri River and deposited on the terraces.  That is why this soil type (Lowry) is found only close to the river.  The lab data shows that the pH is alkaline, ranging from 7.7 at the surface to 8.9 in the lowest horizon.  This high pH reflects the accumulation of a small amount of calcium carbonate (lime) in all horizons.
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item spacing={4}>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    <b>EXAMPLE PEDON 2: Tule River Tribe, California</b>
                  </Typography>
                </Grid>
                <Grid container item direction="row" alignItems="flex-end" xs={10}>
                    <Grid item xs={7}>
                      <img className="doc-image" src={soilsexample21} alt="Map location of the Tule River Tribe TSCAN climate station in California" />
                    </Grid>
                    <Grid item xs={5}>
                      <img className="doc-image" src={soilsexample22} alt="Soil profile from the Tule River Tribe TSCAN climate station location" />
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    <img className="doc-image" src={soilsexample23} alt="Sloping landscape at the Tule River Tribe TSCAN location" />
                </Grid>
                <Grid item xs={12}>
                  <Typography align="left" paragraph variant="body1">
                    This soil is representative of the <a href="https://soilseries.sc.egov.usda.gov/OSD_Docs/A/AUBERRY.html" target="_blank" rel="noopener noreferrer">Auberry series</a>, developed from acid, igneous rocks in the foothills of the Sierra Nevada Mountains.  The Tule River site is located on a steep landscape position (30% slope). In spite of the steep slope, the soil at this site is in the Alfisol Order, a mature soil that has an accumulation of clay in the subsoil (Bt horizons).  This clay increase is evident from the laboratory data that shows the clay content of the surface 18 cm (A1 and A2 horizons) is 12-14%, while the subsoil increases to a maximum of 31% clay in the Bt2 horizon.  The soil texture is composed primarily of sand, ranging from 48 to 65%.  The water content of the soil at field capacity (33 kPa) ranges from 12 to 18%, compared to 21 to 30% in the South Dakota soil (Lowry) discussed above.  Difference in water content between the two soils can be attributed to both texture and organic matter (carbon) content.  Note that the total carbon content is much lower in this pedon compared to the Lowry, ranging from 12% in the surface to 0.01% in the Cr horizon.  The pH of the soil is slightly acidic (pH=6.4) at the surface and neutral (pH=7.0) with depth.  With this pH, the base saturation is 100%, meaning all the sites that hold plant nutrients are occupied by base cations (calcium, magnesium, sodium, and potassium).
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

SoilsExamples.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SoilsExamples);
