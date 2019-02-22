///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import Control from 'react-leaflet-control';
//import { Map, GeoJSON, TileLayer } from 'react-leaflet';
//import LegendControl from '../LegendControl';
import Grid from '@material-ui/core/Grid';
//import Hidden from "@material-ui/core/Hidden";
import Typography from '@material-ui/core/Typography';
//import LoadingOverlay from 'react-loading-overlay';

import StationExplorerMap from '../../components/StationExplorerMap';
import StationExplorerTable from '../../components/StationExplorerTable';

// Styles
import '../../styles/StationExplorer.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

@inject("store") @observer
//function StationExplorer(props) {
class StationExplorer extends Component {
        //const { classes } = props;

    render() {

        return (
                  <Grid container spacing="8">
                      <Grid item xs={12} md={7}>
                        { this.props.store.app.getLocations && (<StationExplorerMap />)}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography gutterBottom variant="body1">
                          { this.props.store.app.getLocations && (<StationExplorerTable />)}
                        </Typography>
                      </Grid>
                  </Grid>
        );

    }
}

//StationExplorer.propTypes = {
//  classes: PropTypes.object.isRequired,
//};

export default withStyles(styles)(StationExplorer);
