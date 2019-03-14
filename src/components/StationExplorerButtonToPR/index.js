///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import { array } from 'prop-types'
import Button from '@material-ui/core/Button';

import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/StationExplorerLegend.css';

@inject('store') @observer
class StationExplorerButtonToPR extends Component {

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        return (
            <Control position="bottomright">
                <Button variant="outlined" color="primary" onClick={this.props.onclick}>
                  To Puerto Rico
                </Button>
            </Control>
        );
    }
}

export default StationExplorerButtonToPR;
