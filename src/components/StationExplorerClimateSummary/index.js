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
//import '../../styles/StationExplorerClimateSummary.css';

var app;

@inject('store') @observer
class StationExplorerClimateSummary extends Component {

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

        //let loc = app.explorer_getClimateSummary
        //let porEnd = (app.explorer_getClimateSummary.edate && app.explorer_getClimateSummary.edate.slice(0,4)==='9999') ? 'present' : app.explorer_getClimateSummary.edate

        return (
            <div className="climateSummary">
              <LoadingOverlay
                  active={app.explorerClimateSummary_dataIsLoading}
                  spinner
                  background={'rgba(255,255,255,1.0)'}
                  color={'rgba(34,139,34,1.0)'}
                  spinnerSize={'10vw'}
                >
                  <Typography variant="h6" noWrap>
                    Climate Summary (as of {app.explorer_getClimateSummary.date})
                  </Typography>
                  <Typography component="span" variant="body2" gutterBottom noWrap>
                    <table cellPadding="6"><tbody>
                      <tr><td></td><td>Since</td><td>Temperature</td><td>Precipitation</td></tr>
                      <tr><td>Year-to-date</td><td>{app.explorer_getClimateSummary.ytd_start}</td><td>{this.tempWithUnits(app.explorer_getClimateSummary.t_ytd_o)} ({this.tempWithSign(app.explorer_getClimateSummary.t_ytd_n)})</td><td>{this.precipWithUnits(app.explorer_getClimateSummary.p_ytd_o)} ({this.precipWithSign(app.explorer_getClimateSummary.p_ytd_n)})</td></tr>
                      <tr><td>Season-to-date</td><td>{app.explorer_getClimateSummary.std_start}</td><td>{this.tempWithUnits(app.explorer_getClimateSummary.t_std_o)} ({this.tempWithSign(app.explorer_getClimateSummary.t_std_n)})</td><td>{this.precipWithUnits(app.explorer_getClimateSummary.p_std_o)} ({this.precipWithSign(app.explorer_getClimateSummary.p_std_n)})</td></tr>
                      <tr><td>Month-to-date</td><td>{app.explorer_getClimateSummary.mtd_start}</td><td>{this.tempWithUnits(app.explorer_getClimateSummary.t_mtd_o)} ({this.tempWithSign(app.explorer_getClimateSummary.t_mtd_n)})</td><td>{this.precipWithUnits(app.explorer_getClimateSummary.p_mtd_o)} ({this.precipWithSign(app.explorer_getClimateSummary.p_mtd_n)})</td></tr>
                    </tbody></table>
                  </Typography>
                </LoadingOverlay>
            </div>
        );
    }
}

export default withRouter(StationExplorerClimateSummary);
