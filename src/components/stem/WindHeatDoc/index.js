///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import StemMenu from '../StemMenu'
import Button from '@material-ui/core/Button';

import userinput from '../../../assets/WindHeat/user_input.png'
import viewselection from '../../../assets/WindHeat/view_selection.png'
import output1 from '../../../assets/WindHeat/output_1.png'
import output2 from '../../../assets/WindHeat/output_2.png'
import heatindex1 from '../../../assets/WindHeat/heatindex_chart_1.png'
import heatindex2 from '../../../assets/WindHeat/heatindex_chart_2.png'
import windchill1 from '../../../assets/WindHeat/windchill_chart.png'

// Components
import MenuPopover from '../MenuPopover'

const styles = theme => ({
  root: {
  },
  menuButton: {
    marginRight: 20,
    marginTop: -10,
  },
  control: {
    padding: theme.spacing(2),
  },
});

var app;
var history;

@inject('store') @observer
class WindHeatDoc extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
    }

    render() {

        const { classes } = this.props;
        let url = app.getToolInfo('windheat').url

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
                  About the Wind Chill and Heat Stress Charts
                </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      What does this tool do?
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <p>
                        This tool monitors environmental conditions in order to estimate the coincident heat stress and wind chill experienced. 
                        A combination of air temperature and humidity are used to determine heat stress, while temperature and wind speed are used to determine wind chill.
                      </p>
                      <p>
                        Current conditions are monitored and data from the past 24-48 hours (through the last hour) are presented. 
                        Additionally, heat stress and wind chill indices are calculated for each hour throughout all years of available weather observations. 
                        Using these data, the historical frequency of each heat stress category can be viewed for each SCAN location.
                        In years where more than 2.5% of hourly data is missing the historical frequencies are grayed out.
                      </p>
                      <br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Wind Chill and Heat Stress Charts
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      Sources of data
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Observations from multiple SCAN sensors at each site provide necessary input data for this tool. 
                      Hourly air temperature, relative humidity, and wind speed are used to calculate the likely amount of heat stress and wind chill experienced during each hour. 
                      <br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      The heat stress index categories used in this tool match the definitions provided by the <a href='https://www.weather.gov/ama/heatindex' target='_blank'>National Weather Service</a>.
                      <a href='https://www.weather.gov/ama/heatindex' target='_blank'><img className="doc-image" style={{ width: '600px', margin: '0 auto' }} src={heatindex1} alt="National Weather Service Heat Index chart" /></a><br/>
                      <a href='https://www.weather.gov/ama/heatindex' target='_blank'><img className="doc-image" style={{ width: '500px', margin: '0 auto' }} src={heatindex2} alt="National Weather Service Heat Index category descriptions" /></a><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      The wind chill categories used in this tool attempt to follow the definitions provided by the <a href='https://www.weather.gov/bou/windchill' target='_blank'>National Weather Service</a>.
                      <a href='https://www.weather.gov/bou/windchill' target='_blank'><img className="doc-image" style={{ width: '600px', margin: '0 auto' }} src={windchill1} alt="National Weather Service Wind Chill chart" /><br/></a>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Wind Chill and Heat Stress Charts
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      How to use this tool
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>1. User Options</i><br/><br/>
                      Once your site is selected, there are two different types of data views to select from, <i>Current "Feels Like"</i> and <i>Historical Frequencies</i>.<br/><br/>
                      <b>a) Current "Feels Like"</b> provide hourly heat index or wind chill conditions over the past 24-48 hours.<br/>
                      <b>b) Historical Frequencies</b> provide the number of hours or days during each year in which the selected measure surpassed significant thresholds.<br/><br/>
                      Finally, the type of measure must be selected. Below represents what these user interfaces look like in the tool:<br/>
                      <img className="doc-image" style={{ width: '500px', margin: '0 auto' }} src={viewselection} alt="View Selection for the SCAN/TSCAN Wind Chill & Heat Stress Index" /><br/>
                      <img className="doc-image-2" src={userinput} alt="User input for the SCAN/TSCAN Wind Chill & Heat Stress Index" /><br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>2. Output</i><br/><br/>
                      Data in this tool can be viewed in either graphical or tabular form by selecting 'chart' or 'table' above each tool. Charts can also be downloaded as an image, and tables can be downloaded as a CSV file, by clicking in the download icon. Below, the chart views and features are highlighted.<br/><br/>
                      <b>a) Current "Feels Like"</b><br/><br/>
                      Time series of heat stress index or wind chill that corresponds to your selections will appear within the tool. Below is a sample chart showing a sample of the features. Horizontal reference lines indicate significant levels for the selected measure. Gray shading represents the calculated "Feels Like" temperature each hour over the visible time span. Also available are associated weather variables used in the calculation. Moving your cursor over the charts in the live tool will show the actual values for the selected hour.<br/><br/>
                      <img className="doc-image" src={output1} alt="Output for the SCAN/TSCAN Wind Chill & Heat Stress Index" /><br/><br/>
                      <b>b) Historical Frequencies</b><br/><br/>
                      Time series charts provide the number of hours or days during each year that surpassed significant thresholds. Below is a sample chart showing a sample of the features. Moving your cursor over the chart in the live tool will show the actual number of hours for each category. The visibility of specific categories can be toggled by clicking on the category names in the chart legend.<br/><br/>
                      <img className="doc-image" src={output2} alt="Output for the SCAN/TSCAN Wind Chill & Heat Stress Index" /><br/><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Wind Chill and Heat Stress Charts
                    </Button>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

WindHeatDoc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(WindHeatDoc));
