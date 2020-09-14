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

import userinput1 from '../../../assets/WindRose/user_input_1.png'
import userinput2 from '../../../assets/WindRose/user_input_2.png'
import userinput3 from '../../../assets/WindRose/user_input_3.png'
import output1 from '../../../assets/WindRose/output_1.png'
import output2 from '../../../assets/WindRose/output_2.png'

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
class WindRoseDoc extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
    }

    render() {

        const { classes } = this.props;
        let url = app.getToolInfo('windrose').url

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
                  About the Wind Rose Diagram
                </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      What does this tool do?
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Wind roses provide a summary of the distribution of wind speed and direction over a period of time at a station. Presented in a circular format, a wind rose shows how often winds blow <b>from</b> particular directions. Hourly wind data from entire periods of record at SCAN and Tribal SCAN stations are used to construct customized site-specific climatological wind summaries. <br/><br/>
                      Information about the frequency of wind speed and direction at specific locations are used in a variety of industries. Typically, these applications aid in the proper positioning of items or resources that may be affected by wind flow, such as wind farm locations, building placements, airport runway design, pollutant dispersion and event planning, to name a few.<br/><br/>
                      Within the agricultural industry, wind roses provide an important resource when planning for <a href="https://www.fs.usda.gov/nac/assets/documents/morepublications/ec1779.pdf" target="_blank" rel="noopener noreferrer">windbreaks or shelterbelts</a>. In general, windbreaks are linear plantings of trees or shrubs designed to provide economic, environmental and community benefits. The primary purpose of most windbreaks is to slow the wind, which creates a more beneficial condition for soils, crops, livestock, wildlife and people. Field windbreaks protect a variety of wind-sensitive crops, control soil wind erosion, increase crop yields and enhances the effectiveness of irrigation and pesticide application.<br/><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Wind Rose Diagram
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      Sources of data
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Observations of wind speed and direction from SCAN and Tribal SCAN anemometers provide this tool with the data necessary to create wind roses and associated tables. Hourly data from a station's entire period of record are used by default, with data filtering options available for customization.<br/><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Wind Rose Diagram
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      How to use this tool
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>1. User Options</i><br/><br/>
                      The utility of a wind rose is enhanced when it is customized for a particular application. Flexibility with regards to data summarization, units and filtering within the tool's user interface provides a high level of customization. Once your station is selected, user options are available either from an 'UPDATE OPTIONS' button (small screens), or from a user interface box on the left-hand side of the tool (large screens).<br/><br/>
                      <b>a) Data units and summaries</b><br/><br/>
                      Before a wind rose can be constructed, wind speed and direction data for each hour must be categorized into discrete bins. For wind direction, two options are available: a 36-point compass and a 16-point compass. For wind speed, some common bin thresholds are provided under the 'SHORTCUTS' button, but you can type in custom values to suit your needs. <br/><br/>
                      The number of hours categorized in each of the specified bins will be displayed in the wind rose as either 1) a percentage of total hours, or 2) the total count. This preference can be chosen under the 'Summary Type' option. Additionally, your preferred wind speed units can be selected.<br/>
                      <img className="doc-image" src={userinput1} alt="Wind Rose User Input" /><br/><br/>
                      <b>b) Data filtering by time period</b><br/><br/>
                      Time filters are available to customize the data used in the wind rose construction. Data may be filtered for specific times of the day, months, seasons, or custom date ranges. A few real-world examples of applying these filters include:<br/>
                      <ul>
                        <li>Using days only during the growing season to maximize field windbreak design</li>
                        <li>Using only winter months when designing windbreaks to spread snow evenly across a field (increasing spring soil moisture), or for positioning of snow fencing to prevent drifting on roadways.</li>
                        <li>Using seasonal wind roses when designing windbreaks for livestock comfort. Information from summer and winter wind roses can help position windbreaks to minimize wind exposure during cold winter months, and maximize wind exposure during hot summer months.</li>
                        <li>Using early morning and late afternoon wind roses to understand common exhaust dispersion patterns that are expected from rush hour traffic in large cities.</li>
                      </ul>
                      <img className="doc-image" src={userinput3} alt="Wind Rose User Input" />
                      <img className="doc-image" src={userinput2} alt="Wind Rose User Input" /><br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>2. Output</i><br/><br/>
                      The summarized wind data is available in both graphical and tabular forms. The chart can be saved as an image file, or the data can be downloaded for use in a spreadsheet, by clicking on the right-hand corner of the wind rose diagram.<br/><br/>
                      <b>a) Wind Rose Diagram</b><br/><br/>
                      The wind rose diagram is presented in a circular format, with bars showing how often winds are blowing <b>from</b> particular directions. Concentric circles represent different frequencies (either as percentages or counts), starting from zero at the center and increasing outward. Colored sections within each bar allows you to see how wind speeds are distributed when winds are blowing from a specific direction.<br/><br/>
                      This chart is interactive in the live tool, allowing you to mouse over bars or legend components to highlight specific conditions in the wind rose. Utilizing this interactive feature is very useful when you need to focus on particular wind speed thresholds in the chart. Tooltips also appear with numerical values when mousing over bars.<br/><br/>
                      In the sample wind rose below, the most frequent wind directions at this station are from the W (about 16% of the time) and SSE (about 11% of the time). The most common speed of the winds from these directions is between 5 and 10 miles/hr.<br/><br/>
                      <img className="doc-image" src={output1} alt="Wind Rose Diagram" /><br/>
                      <b>b) Wind Frequency Table</b><br/><br/>
                      Tables often accompany wind roses, and they sometimes serve as a more convenient way to gather the data of interest. In these tables, frequencies of hours (either as percentages or counts) are given for specific wind speed ranges and directions. Additional information is available in the table that is not included in the wind rose diagram. These additional data include the average wind speed by direction, and the frequency of calm wind conditions.<br/><br/>
                      <img className="doc-image" src={output2} alt="Wind Frequency Table" /><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Wind Rose Diagram
                    </Button>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

WindRoseDoc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(WindRoseDoc));
