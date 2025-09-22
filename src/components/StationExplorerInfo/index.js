import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import Button from '@material-ui/core/Button';

import StationExplorerStationInfo from '../StationExplorerStationInfo';
import StationExplorerStationStatus from '../StationExplorerStationStatus';

var app;

@inject('store') @observer
class StationExplorerInfo extends Component {
    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {
        let variantInfo = (app.getInfoView_explorer==='info') ? 'contained' : 'outlined'
        let variantStatus = (app.getInfoView_explorer==='status') ? 'contained' : 'outlined'

        return (
            <div id="station_data">
                <div className="dataButtons">
                  <Button variant={variantInfo} color="primary" onClick={() => {app.setInfoView_explorer('info')}}>
                    Station Information
                  </Button>
                  <Button variant={variantStatus} color="primary" onClick={() => {app.setInfoView_explorer('status')}}>
                    Station Status
                  </Button>
                </div>
                { app.getInfoView_explorer==='info' && (<StationExplorerStationInfo/>)}
                { app.getInfoView_explorer==='status' && (<StationExplorerStationStatus/>)}
            </div>
        );
    }
}

export default withRouter(StationExplorerInfo);
