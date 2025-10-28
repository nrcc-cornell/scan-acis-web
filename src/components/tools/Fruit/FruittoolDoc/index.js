import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import userinput from '../../../../assets/FruitTool/user_input.png'
import fruittooloutput from '../../../../assets/FruitTool/fruittool_output.png'

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
class FruittoolDoc extends Component {
    render() {
        const { classes } = this.props;

        return (
          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" className={classes.root} spacing={4}>
            <Grid item container className={classes.root} spacing={4} xs={10} md={8} lg={9}>
              <Grid item>
                <Typography variant="h5">
                  About the Fruit Tool
                </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      What does this tool do?
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      This tool monitors heat accumulation throughout the growing season to help agricultural producers estimate when important developmental stages are reached. In a stress-free environment, the development rate of a plant is dependent on temperature. Growing Degree Days (GDD) are also frequently used to help predict potential pest and disease threats.<br/><br/>
                      GDDs are calculated by taking the average of the daily maximum temperature and minimum temperature, and then subtracting a base temperature. The base temperature is the lowest temperature at which a crop will grow. As an example, a common base for many crops is 50°F.  On days when the average temperature is below 50°F, the GDD value is set to zero.<br/><br/>
                      The base value used in the GDD calculation depends on the lifecycle of the plant or insect of interest. Some species continue to grow at lower temperatures, and require a lower base during calculations. Below are the default bases used in this tool:
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>Beginning on April 1st</i><br/>
                      50°F : Pawpaw growth stages<br/>
                      32°F : Lowbush Blueberry growth stages<br/>
                      <i>Beginning on May 1st</i><br/>
                      41°F : Lowbush Blueberry optimal harvest<br/><br/>
                    </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      Sources of data
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Observations from SCAN air temperature sensors provide this tool with the data necessary for calculating daily GDD amounts. The maximum and minimum temperatures observed during each day are used to calculate daily GDD as described above. From the daily GDD totals, seasonal accumulations are then calculated starting from the date selected.
                    </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      How to use this tool
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>1. User Options</i><br/><br/>
                      Once your site is selected, there are three options to choose from to the side of the tool.<br/><br/>
                      <b>a) Output Type :</b> Choose 'chart' or 'table' to change the tool view between graphical and tabular versions.<br/><br/>
                      <b>b) Fruit :</b> Click on the fruit that you are interested in.<br/><br/>
                      <b>c) Year :</b> Select the year that you are interested in. If the selected year is missing a substantial amount of data a disclaimer will be displayed in the lower right corner of the chart.<br/><br/>
                      <b>d) GDD Base :</b> Enter the base value you would like to use for calculating GDDs. After editing this value, an "Update" button will appear to allow you set this value as the new base.<br/><br/>
                      <b>e) Variety :</b> If present, click the checkboxes to toggle varieties of the selected fruit. This will add/remove horizontal lines on the chart that indicate the amount of GDDs for optimal harvest.<br/><br/>
                      Changing either of these user options will automatically cause the output charts and tables to update with current settings.<br/><br/>
                      <img className={classes.docImage2} src={userinput} alt="User input for the SCAN/TSCAN Fruit Tool" />
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>2. Output</i><br/><br/>
                      Charts can be downloaded as an image, and tables can be downloaded as a CSV file, by clicking in the download icon. Below, the chart views and features are highlighted.<br/><br/>
                      Accumulated GDD values that correspond to your selections will appear below the user options. Below is a sample chart showing all of the features.<br/><br/>
                      <b>a) Green Line : </b> The season-to-date accumulation for the selected year.<br/><br/>
                      <b>b) Purple Line : </b> The average season-to-date accumulation for the entire period of record.<br/><br/>
                      <b>c) Gray Shading : </b> The extreme season-to-date accumulations observed throughout the entire period of record.<br/><br/>
                      <img className={classes.docImage} src={fruittooloutput} alt="Sample output for the SCAN/TSCAN Fruit Tool" /><br/><br/>
                    </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

FruittoolDoc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(FruittoolDoc));
