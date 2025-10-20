import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import viewselection1 from '../../../../assets/WxGraphTool/view_selection_1.png'
import viewselection2 from '../../../../assets/WxGraphTool/view_selection_2.png'
import userinput1 from '../../../../assets/WxGraphTool/user_input_1.png'
import userinput2 from '../../../../assets/WxGraphTool/user_input_2.png'
import wxgraphoutput1 from '../../../../assets/WxGraphTool/wxgraph_output_1.png'
import wxgraphoutput2 from '../../../../assets/WxGraphTool/wxgraph_output_2.png'

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
  },
  docImage3: {
    width: '20%',
    maxWidth: '800px'
  }
});

@inject('store') @observer
class WxgraphDoc extends Component {
    render() {
        const { classes } = this.props;

        return (
          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" className={classes.root} spacing={4}>
            <Grid item container className={classes.root} spacing={4} xs={10} md={8} lg={9}>
              <Grid item>
                <Typography variant="h5">
                  About the Weather Grapher
                </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      What does this tool do?
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      This tool allows for viewing of data from all SCAN sensors in a variety of ways. The <b>Weather Data Summaries</b> view allows you to display multiple variables side-by-side for multiple timescales (hourly, daily, monthly, annual). The <b>Threshold Exceedences</b> view provides the number of days during each year on which weather observations surpassed user-defined values.<br/>
                    </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      Sources of data
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Observations from multiple SCAN sensors at each site provide this tool with data.
                    </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      How to use this tool
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>1. User Options</i><br/><br/>
                      Once your site is selected, there are two different types of data views to select from, <i>Weather Data Summaries</i> and <i>Threshold Exceedences</i>.<br/><br/>
                      <b>a) Weather Data Summaries</b> provide a side-by-side view of multiple variables at multiple timescales. Options to select include variables, units, ending date of data, and the length of time series.<br/>
                      <img className={classes.docImage} src={viewselection1} alt="View selection for data summaries in the SCAN/TSCAN Weather Grapher" /><br/>
                      <img className={classes.docImage3} src={userinput1} alt="User input for data summaries in the SCAN/TSCAN Weather Grapher" /><br/><br/>
                      <b>b) Threshold Exceedences</b> provide the number of days during each year on which weather observations surpassed user-defined values. Options include the type of variable to analyze, a comparison operator, threshold value, and units.<br/><br/>
                      The example user interface given below would produce two charts showing: 1) the number of days during each year on which daily maximum temperatures exceeded 90°F, and 2) the number of days during each year on which daily minimum temperatures were less than 32°F. In this example, analysis of total precipitation is toggled off.
                      <img className={classes.docImage} src={viewselection2} alt="View selection for threshold exceedences in the SCAN/TSCAN Weather Grapher" /><br/>
                      <img className={classes.docImage2} src={userinput2} alt="Weather Grapher User Input For Threshold Exceedences" /><br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>2. Output</i><br/><br/>
                      Data in this tool can be viewed in either graphical or tabular form by selecting 'chart' or 'table' next to each tool. Charts can also be downloaded as an image, and tables can be downloaded as a CSV file, by clicking in the download icon. Below, the chart views and features are highlighted.<br/><br/>
                      <b>a) Weather Data Summaries</b><br/><br/>
                      Time series of weather observations that correspond to your selections will appear within the tool. Below is a sample chart showing a sample of the features. Moving the cursor over the charts in the live tool displays data for each variable displayed.<br/><br/>
                      <img className={classes.docImage} src={wxgraphoutput1} alt="Sample output from the SCAN/TSCAN Weather Grapher" /><br/><br/>
                      <b>b) Threshold Exceedences</b><br/><br/>
                      Time series charts provide the number of days each year that surpassed user-defined thresholds. Below is a sample chart showing a sample of the features. Moving the cursor over the charts in the live tool displays the number of days each year.<br/><br/>
                      <img className={classes.docImage} src={wxgraphoutput2} alt="Sample output from the SCAN/TSCAN Weather Grapher" /><br/><br/>
                    </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

WxgraphDoc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(WxgraphDoc));
