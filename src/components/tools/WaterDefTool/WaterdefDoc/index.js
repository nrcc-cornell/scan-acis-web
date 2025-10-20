import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import userinput from '../../../../assets/WaterDefTool/user_input.png'
import waterdefoutput from '../../../../assets/WaterDefTool/waterdef_output.png'
import soilmprecipoutput from '../../../../assets/WaterDefTool/soilm_precip_output.png'

const styles = theme => ({
  root: {
    width: '85%',
    margin: '0 auto'
  },
  docImage: {
    width: '100%',
    maxWidth: '800px'
  },
  docImage2: {
    width: '25%',
    maxWidth: '800px'
  }
});

@inject('store') @observer
class WaterdefDoc extends Component {
    render() {
        const { classes } = this.props;

        return (
          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" className={classes.root} spacing={4}>
            <Grid item container className={classes.root} spacing={4} xs={10} md={8} lg={9}>
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
                      <i>1. User Options</i><br/><br/>
                      Once your site is selected, there are three options to choose from at the top of the tool: the output type, the year, and the range of soil depths. The output type alsos you to change between the graphical and tabular versions of the tool.The year selection defaults to the current year, while the soil depth defaults to the top 12 inches of the soil profile. To change the soil depth, click and drag the handles of the selected range to the depths of interest.<br/>
                      <img className={classes.docImage2} src={userinput} alt="Sample user input from the SCAN/TSCAN Water Deficit Calculator" />
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>2. Output</i><br/><br/>
                      Charts can be downloaded as an image, and tables can be downloaded as a CSV file, by clicking in the download icon. Below, the chart views and features are highlighted.<br/><br/>
                      Water deficit values that correspond to your selections will appear next to the user options. Below is a sample chart showing all of the features. The zero line on the chart represents conditions when no water deficit exists. This zero line is also representative of when soil moisture amounts are at field capacity. At these conditions, the maximum amount of water possible is available to plants, and plants are not under any water stress (indicated by blue color). As conditions begin to dry in the soil, water deficits may reach a point when plants begin to experience water stress (indicated by red color). This level of water stress is typically about halfway between field capacity and the wilting point. If natural precipitation does not provide relief, properly timed irrigation may be necessary to provide the water necessary to eliminate plant stress. When monitoring conditions for the current year, these data are available through the current day in order to assist with timely decision making.<br/><br/>
                      <img className={classes.docImage} src={waterdefoutput} alt="Sample output from the SCAN/TSCAN Water Deficit Calculator" /><br/><br/>
                      Also provided are data measured by the SCAN station equipment that are relevent to calculating the water deficit. Volumetric soil moisture at up to five soil depths and daily precipitation totals are included, with samples below. Specific depths may be toggled in the live chart for viewing preference.<br/><br/>
                      <img className={classes.docImage} src={soilmprecipoutput} alt="Sample soil moisture and precipitation output as they appear in the SCAN/TSCAN Water Deficit Calculator" />
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

export default withRouter(withStyles(styles)(WaterdefDoc));
