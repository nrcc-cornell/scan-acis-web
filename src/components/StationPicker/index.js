///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import Control from 'react-leaflet-control';
//import { Map, GeoJSON, LayersControl, TileLayer } from 'react-leaflet';
//import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';
//import LegendControl from '../LegendControl';
import Grid from '@material-ui/core/Grid';
import Hidden from "@material-ui/core/Hidden";
import Typography from '@material-ui/core/Typography';

import StationPickerMap from '../../components/StationPickerMap';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

function StationPicker(props) {
        const { classes } = props;

        return (
                <Grid container>
                    <Typography gutterBottom variant="body1">
                      <Grid item>
                        <StationPickerMap />
                      </Grid>
                    </Typography>
                </Grid>
        );
}

StationPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StationPicker);
