///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

// Components
import StationAboutMap from '../../components/StationAboutMap';
import ToolLister from '../../components/ToolLister';

//import scanmap from '../../assets/scan-station-map.png'

// Styles
import '../../styles/AboutContents.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

var app;

@inject('store') @observer
class AboutContents extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        // set site's active page
        app.setActivePage(1);
    }

    render() {

        const { classes } = this.props;

        return (
            <div className="about-contents">
            <Grid container className={classes.root} spacing={32}>
              <Grid item sm={12} md={6}>
                    <Typography align="left" paragraph variant="h5">
                      Station Networks
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
The Natural Resources Conservation Service (NRCS) operates a comprehensive, nationwide soil moisture and climate information network. The Soil Climate Analysis Network, also known as SCAN, supports natural resource assessments and conservation activities through its network of automated climate monitoring and data collection sites. SCAN focuses primarily on agricultural areas of the U.S., Puerto Rico and the Virgin Islands. The network consists of over 200 stations in almost every state, and is growing every year.
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
In addition to the original SCAN project, NRCS also operates a soil moisture and climate information network on Tribal lands. The Tribal Soil Climate Analysis Network (known as Tribal SCAN) focuses on agricultural areas which are situated on Tribal lands in the United States.
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                      More information about these networks is available at the NRCS website:
                      <ul>
                        <li><a href="https://www.wcc.nrcs.usda.gov/scan/" target="_blank" rel="noopener noreferrer">SCAN / Tribal SCAN documentation</a></li>
                        <li><a href="https://www.wcc.nrcs.usda.gov/scan/scan_brochure.pdf" target="_blank" rel="noopener noreferrer">SCAN brochure</a></li>
                        <li><a href="https://www.wcc.nrcs.usda.gov/tribalscan/tribalscan_brochure.pdf" target="_blank" rel="noopener noreferrer">Tribal SCAN brochure</a></li>
                      </ul>
                    </Typography>
                    { this.props.store.app.getLocations && (<StationAboutMap />)}
              </Grid>
              <Grid item sm={12} md={6}>
                    <Typography align="left" paragraph variant="h5">
                      About the decision tools
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                      These decision tools use SCAN data to address a variety of agricultural applications. Each tool utilizes the Applied Climate Information System (ACIS) web service for fast, easy and reliable access to SCAN data. Together, SCAN and ACIS provide the means to produce efficient, powerful, and user-friendly tools using data observed at both traditional and tribal SCAN stations.
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                      Each tool allows for station selection from either a map or dropdown list, and data can be viewed in either chart or table form. To learn more about these tools and how to use them, please visit <Link to={'/stem'}>SCAN 4 STEM</Link>.
                    </Typography>
                    <ToolLister />
              </Grid>
            </Grid>
            <br/>
            </div>
        );
    }
}

export default withStyles(styles)(AboutContents);
