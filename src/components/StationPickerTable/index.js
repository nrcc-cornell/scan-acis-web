///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Styles
import '../../styles/StationPickerTable.css';

var app;

@inject('store') @observer
class StationPickerTable extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let loc = app.getLocation

        return (
            <div id="feature_infos">
                <span id="info">
                    {loc.name}, {loc.state}
                </span>
                <p>Data summary</p>
            </div>
        );
    }
}

export default StationPickerTable;
