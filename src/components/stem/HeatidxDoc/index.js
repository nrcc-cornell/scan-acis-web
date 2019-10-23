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

import viewselection from '../../../assets/LivestockIdxTool/view_selection.png'
import userinput from '../../../assets/LivestockIdxTool/user_input.png'
import livestockoutput1 from '../../../assets/LivestockIdxTool/livestock_output_1.png'
import livestockoutput2 from '../../../assets/LivestockIdxTool/livestock_output_2.png'

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
class HeatIdxDoc extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
    }

    render() {

        const { classes } = this.props;
        let url = app.getToolInfo('livestock').url

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
            <Grid item container className={classes.root} spacing={4} xs={10} md={8} lg={9}>
              <Grid item>
                <Typography variant="h5">
                  About the Livestock Heat Index
                </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      What does this tool do?
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      This tool monitors environmental conditions in order to estimate the coincident heat stress experienced by a variety of animals. A combination of air temperature, humidity, solar radiation, and wind speed are used to determine likely levels of heat stress for different species. Biological factors, including each animal's ability to naturally cool itself (by sweating, panting, etc), are major considerations when determining the calculated levels of heat stress.<br/><br/>
                      Current conditions are monitored and data from the past 24-48 hours (through the last hour) are presented. Additionally, heat stress indices are calculated for each hour throughout all years of available weather observations. Using these data, the historical frequency of each heat stress category can be viewed for each SCAN location.
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Livestock Heat Index
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      Sources of data
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Observations from multiple SCAN sensors at each site provide necessary input data for this tool. Hourly air temperature, relative humidity, solar radiation and wind speed are used to calculate the likely amount of heat stress experienced during each hour. Heat stress index equations and categories often differ for individual animal species or groups of animals that share similar biological traits. Sources of heat stress calculation for each animal category in this tool are provided below:<br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <b>1) Cattle</b><br/><br/>
                      The Cattle Heat Index is based on breathing rate, which increases as the animal becomes more heat stressed. This calculation requires temperature, humidity, solar radiation and wind speed. In cases where all variables are not available, using the "big animal" general calculation (#3, below) is suggested.<br/><br/>
                      <i>Brown-Brandl, T. M., Eigenberg, R. A., Nienaber, J. A., and Hahn, G. L. 2005. Dynamic response indicators of heat stress in shaded and non-shaded feedlot cattle, Part 1: Analyses of indicators. Biosystems Engineering 90(4): 451-462.</i><br/><br/>
                      <i>Eigenberg, R. A., Brown-Brandl, T. M., Nienaber, J. A., and Hahn, G. L. 2005. Dynamic Response Indicators of Heat Stress in Shaded and Non-shaded Feedlot Cattle, Part 2: Predictive Relationships. Biosystems Engineering 91(1): 111-118.</i><br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <b>2) Dairy Cows</b><br/><br/>
                      Dairy cows respond with decreased milk production and calf rates as the amount of heat stress increases. During warm seasons, it is often necessary to provide facilities (fans, shade, etc) to maintain the cow's comfort level.<br/><br/>
                      <i>Habeeb, A. A., Gad, A. E., and Atta, M. A. 2018. Temperature-Humidity Indices as Indicators to Heat Stress of Climatic Conditions with Relation to Production and Reproduction of Farm Animals. International Journal of Biotechnology and Recent Advances 1(1): 35-50.</i><br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <b>3) Large Animals (general case for cattle, bison, sheep, goats, etc)</b><br/><br/>
                      Larger animals are grouped together in this general case that only requires temperature and humidity for calculation. These animals use similar biological cooling methods, so extreme environmental conditions can affect them in a similar way.<br/><br/>
                      <i>Habeeb, A. A., Gad, A. E., and Atta, M. A. 2018. Temperature-Humidity Indices as Indicators to Heat Stress of Climatic Conditions with Relation to Production and Reproduction of Farm Animals. International Journal of Biotechnology and Recent Advances 1(1): 35-50.</i><br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <b>4) Small Animals (general case for rabbits, poultry, etc)</b><br/><br/>
                      Smaller animals are also grouped together in this general case that only requires temperature and humidity for calculation. These animals have different biological cooling methods from larger animals, and can often endure higher levels of heat before stress is experienced.<br/><br/>
                      <i>Habeeb, A. A., Gad, A. E., and Atta, M. A. 2018. Temperature-Humidity Indices as Indicators to Heat Stress of Climatic Conditions with Relation to Production and Reproduction of Farm Animals. International Journal of Biotechnology and Recent Advances 1(1): 35-50.</i><br/><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Livestock Heat Index
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      How to use this tool
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>1. User Options</i><br/><br/>
                      Once your site is selected, there are two different types of data views to select from, <i>Current Heat Indices</i> and <i>Historical Frequencies</i>.<br/><br/>
                      <b>a) Current Heat Indices</b> provide hourly heat index conditions over the past 24-48 hours.<br/>
                      <b>b) Historical Frequencies</b> provide the number of hours or days during each year in which the selected heat index surpassed significant heat stress thresholds.<br/><br/>
                      Finally, the type of heat index must be selected, based on the animal of interest. Below represents what these user interfaces look like in the tool:<br/>
                      <img className="doc-image" src={viewselection} alt="Livestock Heat Index View Selection" /><br/>
                      <img className="doc-image-2" src={userinput} alt="Livestock Heat Index User Input" /><br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>2. Output</i><br/><br/>
                      Data in this tool can be viewed in either graphical or tabular form by selecting 'chart' or 'table' above each tool. Charts can also be downloaded as an image, and tables can be downloaded as a CSV file, by clicking in the download icon. Below, the chart views and features are highlighted.<br/><br/>
                      <b>a) Current Heat Indices</b><br/><br/>
                      Time series of heat indices that correspond to your selections will appear within the tool. Below is a sample chart showing a sample of the features. Horizontal reference lines indicate significant heat stress levels for the selected animal. Gray shading represents the calculated heat index each hour over the visible time span. Also available are associated weather variables used in the heat index calculation. Moving your cursor over the charts in the live tool will show the actual heat index values for the selected hour.<br/><br/>
                      <img className="doc-image" src={livestockoutput1} alt="Livestock Heat Index Output" /><br/><br/>
                      <b>b) Historical Frequencies</b><br/><br/>
                      Time series charts provide the number of hours or days during each year that surpassed significant heat stress thresholds. Below is a sample chart showing a sample of the features. Moving your cursor over the chart in the live tool will show the actual number of hours for each category. The visibility of specific categories can be toggled by clicking on the category names in the chart legend.<br/><br/>
                      <img className="doc-image" src={livestockoutput2} alt="Livestock Heat Index Output" /><br/><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Livestock Heat Index
                    </Button>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

HeatIdxDoc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(HeatIdxDoc));
