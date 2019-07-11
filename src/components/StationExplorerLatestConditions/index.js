///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import Typography from '@material-ui/core/Typography';
//import Grid from "@material-ui/core/Grid";
//import Button from '@material-ui/core/Button';
import LoadingOverlay from 'react-loading-overlay';

// Styles
//import '../../styles/StationExplorerLatestConditions.css';

var app;

@inject('store') @observer
class StationExplorerLatestConditions extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    tempWithSign = (n) => {
        if (n===undefined ) {
            // no value
            return ''
        } else if (n==='M' ) {
            // missing
            return n
        } else if (parseFloat(n)<=0.0) {
            // already has minus sign
            return parseFloat(n).toFixed(1)
        } else {
            // add plus sign
            return '+'+parseFloat(n).toFixed(1)
        }
    }

    precipWithSign = (n) => {
        if (n===undefined ) {
            // no value
            return ''
        } else if (n==='M' ) {
            // missing
            return n
        } else if (parseFloat(n)<=0.0) {
            // already has minus sign
            return parseFloat(n).toFixed(2)
        } else {
            // add plus sign
            return '+'+parseFloat(n).toFixed(2)
        }
    }

    tempWithUnits = (n) => {
        if (n===undefined ) {
            // no value
            return ''
        } else if (n==='M' ) {
            // missing
            return n
        } else {
            // add plus sign
            //return parseFloat(n).toPrecision(1).toString()+String.fromCharCode(176)+'F'
            return parseFloat(n).toFixed(1)+String.fromCharCode(176)+'F'
        }
    }

    precipWithUnits = (n) => {
        if (n===undefined ) {
            // no value
            return ''
        } else if (n==='M' ) {
            // missing
            return n
        } else {
            // add plus sign
            //return n+'"'
            return parseFloat(n).toFixed(2)+'"'
        }
    }

    render() {

        //let loc = app.getLocation_explorer
        //let porEnd = (app.getLocation_explorer.edate && app.getLocation_explorer.edate.slice(0,4)==='9999') ? 'present' : app.getLocation_explorer.edate

        return (
            <div className="latestConditions">
              <LoadingOverlay
                  active={app.explorer_dataIsLoading}
                  spinner
                  background={'rgba(255,255,255,1.0)'}
                  color={'rgba(34,139,34,1.0)'}
                  spinnerSize={'10vw'}
                >
                    <Typography variant="h6" noWrap>
                      Latest conditions
                    </Typography>
                    <Typography variant="body2" gutterBottom noWrap>
                      <ul style={{"padding":0,"margin":0,"listStyleType":"none"}}>
                        <li><b>Date/Time:</b> {app.explorer_getLatestConditions.date}</li>
                        <li><b>Air Temp:</b> {app.explorer_getLatestConditions.avgt}</li>
                        <li><b>Humidity:</b> {app.explorer_getLatestConditions.humid}</li>
                        <li><b>Precipitation (last hour):</b> {app.explorer_getLatestConditions.pcpn}</li>
                        <li><b>Solar Radiation:</b> {app.explorer_getLatestConditions.solar}</li>
                        <li><b>Wind Speed / Direction:</b> {app.explorer_getLatestConditions.windspdave} / {app.explorer_getLatestConditions.winddirave}</li>
                        <li><b>Soil Temp:</b> {app.explorer_getLatestConditions.soilt2in}(2"), {app.explorer_getLatestConditions.soilt4in}(4"), {app.explorer_getLatestConditions.soilt8in}(8"), {app.explorer_getLatestConditions.soilt20in}(20"), {app.explorer_getLatestConditions.soilt40in}(40")</li>
                        <li><b>Soil Moist:</b> {app.explorer_getLatestConditions.soilm2in}(2"), {app.explorer_getLatestConditions.soilm4in}(4"), {app.explorer_getLatestConditions.soilm8in}(8"), {app.explorer_getLatestConditions.soilm20in}(20"), {app.explorer_getLatestConditions.soilm40in}(40")</li>
                      </ul>
                    </Typography>
              </LoadingOverlay>
            </div>
        );
    }
}

export default withRouter(StationExplorerLatestConditions);
