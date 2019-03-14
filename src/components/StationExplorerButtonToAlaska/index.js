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
class StationExplorerButtonToAlaska extends Component {

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        return (
            <Control position="topleft">
                <Button variant="outlined" color="primary" onClick={this.props.onclick}>
                  To Alaska
                </Button>
            </Control>
        );
    }
}

export default StationExplorerButtonToAlaska;
