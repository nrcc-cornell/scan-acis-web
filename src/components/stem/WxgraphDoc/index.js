///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
//import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import StemMenu from '../StemMenu'
import Button from '@material-ui/core/Button';

import viewselection1 from '../../../assets/WxGraphTool/view_selection_1.png'
import viewselection2 from '../../../assets/WxGraphTool/view_selection_2.png'
import userinput1 from '../../../assets/WxGraphTool/user_input_1.png'
import userinput2 from '../../../assets/WxGraphTool/user_input_2.png'
import wxgraphoutput1 from '../../../assets/WxGraphTool/wxgraph_output_1.png'
import wxgraphoutput2 from '../../../assets/WxGraphTool/wxgraph_output_2.png'

// Components
import MenuPopover from '../MenuPopover'

//import scanstn from '../../../assets/scan-station.png'

// Styles
//import '../../../styles/StemWxGraphDoc.css';

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

var app;
var history;

@inject('store') @observer
class WxgraphDoc extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
    }

    render() {

        const { classes } = this.props;
        let url = app.getToolInfo('wxgrapher').url

        return (
          <Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.root} spacing={4}>
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
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Weather Grapher
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      Sources of data
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Observations from multiple SCAN sensors at each site provide this tool with data.
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Weather Grapher
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      How to use this tool
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>1. User Options</i><br/><br/>
                      Once your site is selected, there are two different types of data views to select from, <i>Weather Data Summaries</i> and <i>Threshold Exceedences</i>.<br/><br/>
                      <b>a) Weather Data Summaries</b> provide a side-by-side view of multiple variables at multiple timescales. Options to select include variables, units, ending date of data, and the length of time series.<br/>
                      <img className="doc-image" src={viewselection1} alt="Weather Grapher View Selection For Data Summaries" /><br/>
                      <img className="doc-image" src={userinput1} alt="Weather Grapher User Input For Data Summaries" /><br/><br/>
                      <b>b) Threshold Exceedences</b> provide the number of days during each year on which weather observations surpassed user-defined values. Options include the type of variable to analyze, a comparison operator, threshold value, and units.<br/><br/>
                      The example user interface given below would produce two charts showing: 1) the number of days during each year on which daily maximum temperatures exceeded 90°F, and 2) the number of days during each year on which daily minimum temperatures were less than 32°F. In this example, analysis of total precipitation is toggled off.
                      <img className="doc-image" src={viewselection2} alt="Weather Grapher View Selection For Threshold Exceedences" /><br/>
                      <img className="doc-image-2" src={userinput2} alt="Weather Grapher User Input For Threshold Exceedences" /><br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>2. Output</i><br/><br/>
                      Data in this tool can be viewed in either graphical or tabular form by selecting 'chart' or 'table' above each tool. Charts can also be downloaded as an image, and tables can be downloaded as a CSV file, by clicking in the download icon. Below, the chart views and features are highlighted.<br/><br/>
                      <b>a) Weather Data Summaries</b><br/><br/>
                      Time series of weather observations that correspond to your selections will appear within the tool. Below is a sample chart showing a sample of the features. Moving the cursor over the charts in the live tool displays data for each variable displayed.<br/><br/>
                      <img className="doc-image" src={wxgraphoutput1} alt="Weather Grapher Output" /><br/><br/>
                      <b>b) Threshold Exceedences</b><br/><br/>
                      Time series charts provide the number of days each year that surpassed user-defined thresholds. Below is a sample chart showing a sample of the features. Moving the cursor over the charts in the live tool displays the number of days each year.<br/><br/>
                      <img className="doc-image" src={wxgraphoutput2} alt="Weather Grapher Output" /><br/><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Weather Grapher
                    </Button>
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
