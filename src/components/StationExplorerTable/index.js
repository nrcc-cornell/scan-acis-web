///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';

import StationExplorerSelect from '../../components/StationExplorerSelect';

// Styles
//import '../../styles/StationExplorerTable.css';

var app;

@inject('store') @observer
class StationExplorerTable extends Component {

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

        let loc = app.getLocation_explorer
        let porEnd = (app.getLocation_explorer.edate && app.getLocation_explorer.edate.slice(0,4)==='9999') ? 'present' : app.getLocation_explorer.edate

        return (
            <div id="feature_infos">
              <Grid container spacing="16">
                <Grid item container>
                  <Grid item>
                    <Typography variant="h6">
                      <StationExplorerSelect names={app.getLocations} />
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing="16">
                  <Grid item>
                    <Typography variant="h6">
                      Station Information
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <ul style={{"padding":0,"margin":0,"list-style-type":"none"}}>
                        <li>Latitude, Longitude: {app.getLocation_explorer.ll[1]}, {app.getLocation_explorer.ll[0]}</li>
                        <li>Elevation: {app.getLocation_explorer.elev} feet</li>
                        <li>Period of Record: {app.getLocation_explorer.sdate} to {porEnd}</li>
                        <li>Soil Characteristics: --</li>
                      </ul>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" noWrap>
                      Climate Summary (as of {app.getDatesForLocations.date})
                    </Typography>
                    <Typography variant="body1" gutterBottom noWrap>
                      <table cellpadding="6">
                        <tr><td></td><td>Since</td><td>Temperature</td><td>Precipitation</td></tr>
                        <tr><td>Year-to-date</td><td>{app.getDatesForLocations.ytd_start}</td><td>{this.tempWithUnits(app.getLocation_explorer.t_ytd_o)} ({this.tempWithSign(app.getLocation_explorer.t_ytd_n)})</td><td>{this.precipWithUnits(app.getLocation_explorer.p_ytd_o)} ({this.precipWithSign(app.getLocation_explorer.p_ytd_n)})</td></tr>
                        <tr><td>Season-to-date</td><td>{app.getDatesForLocations.std_start}</td><td>{this.tempWithUnits(app.getLocation_explorer.t_std_o)} ({this.tempWithSign(app.getLocation_explorer.t_std_n)})</td><td>{this.precipWithUnits(app.getLocation_explorer.p_std_o)} ({this.precipWithSign(app.getLocation_explorer.p_std_n)})</td></tr>
                        <tr><td>Month-to-date</td><td>{app.getDatesForLocations.mtd_start}</td><td>{this.tempWithUnits(app.getLocation_explorer.t_mtd_o)} ({this.tempWithSign(app.getLocation_explorer.t_mtd_n)})</td><td>{this.precipWithUnits(app.getLocation_explorer.p_mtd_o)} ({this.precipWithSign(app.getLocation_explorer.p_mtd_n)})</td></tr>
                      </table>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={app.getToolInfo('wxgrapher').onclick}>
                      View Additional Data
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
        );
    }
}

export default StationExplorerTable;
