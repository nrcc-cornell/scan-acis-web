import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import userinput from '../../../../assets/GddTool/user_input.png'
import gddtooloutput from '../../../../assets/GddTool/gddtool_output.png'

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
    width: '40%',
    maxWidth: '800px'
  }
});

var app;
var history;

@inject('store') @observer
class GddtoolDoc extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
    }

    render() {
        const { classes } = this.props;

        return (
          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" className={classes.root} spacing={4}>
            <Grid item container className={classes.root} spacing={4} xs={10} md={8} lg={9}>
              <Grid item>
                <Typography variant="h5">
                  About the Growing Degree Day Calculator
                </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      What does this tool do?
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      This tool monitors heat accumulation throughout the growing season to help agricultural producers estimate when important developmental stages are reached. In a stress-free environment, the development rate of a plant is dependent on temperature. Growing Degree Days (GDD) are also frequently used to help predict potential pest and disease threats.<br/><br/>
                      GDDs are calculated by taking the average of the daily maximum temperature and minimum temperature, and then subtracting a base temperature. The base temperature is the lowest temperature at which a crop will grow. As an example, a common base for many crops is 50°F.  On days when the average temperature is below 50°F, the GDD value is set to zero.<br/><br/>
                      The base value used in the GDD calculation depends on the lifecycle of the plant or insect of interest. Some species continue to grow at lower temperatures, and require a lower base during calculations. Below are some examples of bases used when calculating GDD for a variety of species:
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>Plants</i><br/>
                      50°F : corn, sorghum, soybeans, tomato<br/>
                      46°F : sunflower, potato<br/>
                      42°F : wheat, barley, rye, oats, flaxseed, lettuce, asparagus<br/><br/>
                      <i>Insects and Diseases</i><br/>
                      52°F : Green Cloverworm<br/>
                      50°F : Codling moth, Apple maggot<br/>
                      48°F : Alfalfa weevil<br/>
                      45°F : Corn rootworm, Oriental fruit moth<br/>
                      43°F : Stalk Borer<br/>
                      40°F : Onion maggot<br/>
                      39°F : Cabbage maggot<br/>
                      32°F : Apple scab<br/><br/>
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
                      Once your site is selected, there are two options to choose from at the top of the tool.<br/><br/>
                      <b>a) Planting/Budbreak Date :</b> Click on the calendar icon to select a date from the dropdown calendar. This is the date from which you would like to start GDD accumulation. The current year is selected by default, however previous years can be selected if data at your location of interest is available.<br/><br/>
                      <b>b) GDD Base :</b> Enter the base value you would like to use for calculating GDDs. After editing this value, an "Update" button will appear to allow you set this value as the new base.<br/><br/>
                      Changing either of these user options will automatically cause the output charts and tables to update with current settings.<br/><br/>
                      <img className={classes.docImage} src={userinput} alt="User input for the SCAN/TSCAN Growing Degree Day Calculator" />
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>2. Output</i><br/><br/>
                      Data in this tool can be viewed in either graphical or tabular form by selecting 'chart' or 'table' above each tool. Charts can also be downloaded as an image, and tables can be downloaded as a CSV file, by clicking in the download icon. Below, the chart views and features are highlighted.<br/><br/>
                      Accumulated GDD values that correspond to your selections will appear below the user options. Below is a sample chart showing all of the features.<br/><br/>
                      <b>a) Green Line : </b> The season-to-date accumulation for the selected year.<br/><br/>
                      <b>b) Blue Line : </b> The average season-to-date accumulation for the most recent 15-year period.<br/><br/>
                      <b>c) Purple Line : </b> The average season-to-date accumulation for the entire period of record.<br/><br/>
                      <b>d) Gray Shading : </b> The extreme season-to-date accumulations observed throughout the entire period of record.<br/><br/>
                      <img className={classes.docImage} src={gddtooloutput} alt="Sample output for the SCAN/TSCAN Growing Degree Day Calculator" /><br/><br/>
                    </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

GddtoolDoc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(GddtoolDoc));
