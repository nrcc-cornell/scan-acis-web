///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import imageMapResize from 'image-map-resizer';
import Hidden from '@material-ui/core/Hidden';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import StemMenu from '../StemMenu'
//import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ReactHtmlParser from 'react-html-parser';

// Components
import MenuPopover from '../MenuPopover'

import scanstn from '../../../assets/scan-station.png'

// Styles
import '../../../styles/StemInstrumentation.css';

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

@inject('store') @observer
class Instrumentation extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    componentDidMount() {
        imageMapResize();
    }

    updateInstrument = (e,i) => {
        e.preventDefault();
        app.stem_setInstrument(i);
    }

    render() {

        const { classes } = this.props;

        return (
          <Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.root} spacing={4}>
            <Grid item container justify="flex-start" alignItems="flex-start" direction="row" xs={2} sm={1} lg={3}>
              <Grid item>
                <Hidden lgUp>
                  <MenuPopover/>
                </Hidden>
                <Hidden mdDown>
                  <StemMenu/>
                </Hidden>
              </Grid>
            </Grid>
            <Grid item container direction="column" className={classes.root} spacing={4} xs={10} lg={9}>
              <Grid item>
                <Typography variant="h5">
                  Instrumentation
                </Typography>
              </Grid>
            <Grid item container direction="row" className={classes.root} justify="center" spacing={4}>
              <Grid item xs={12} sm={8} md={7} lg={7}>
                    <img className="scan-station-instrument" src={scanstn} border="5" alt="A complete SCAN climate station installation" usemap="#instrumentmap" />
                    <map name="instrumentmap">
                        <area onClick={(e) => {this.updateInstrument(e,'wind')}} shape="rect" coords="16,181,180,327" alt="wind instrument" href="#" />
                        <area onClick={(e) => {this.updateInstrument(e,'solarrad')}} shape="rect" coords="350,267,547,327" alt="solar radiation instrument" href="#" />
                        <area onClick={(e) => {this.updateInstrument(e,'precip')}} shape="rect" coords="9,347,220,417" alt="precipitation instrument" href="#" />
                        <area onClick={(e) => {this.updateInstrument(e,'rh_and_temp')}} shape="rect" coords="300,348,565,417" alt="temperature and relative humidity instrument" href="#" />
                        <area onClick={(e) => {this.updateInstrument(e,'soil')}} shape="rect" coords="9,496,176,606" alt="soil temperature and soil moisture instrument" href="#" />
                    </map>
              </Grid>
              <Grid item xs={12} sm={12} md={5} lg={5}>
                    <Typography align="left" paragraph variant="h6">
                      {app.stem_getInstrumentName}
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                      { ReactHtmlParser(app.stem_getInstrumentDesc)}
                    </Typography>
              </Grid>
            </Grid>
            </Grid>
          </Grid>
        );
    }
}

Instrumentation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Instrumentation);
