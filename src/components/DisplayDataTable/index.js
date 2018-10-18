///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Styles
import '../../styles/DisplayDataTable.css';

var app;

@inject('store') @observer
class DisplayDataTable extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="display-data-table">
                Recent Conditions
                <div className="display-data-table-contents">
                    Selected Location: {app.getSelectedLocation.id}
                </div>
            </div>
        );
    }
}

export default DisplayDataTable;
