///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Styles
import '../../../styles/LivestockIdxTool.css';

var app;

@inject('store') @observer
class LivestockIdxTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="livestock-idx-tool">
                    <span className='livestock-idx-tool-header'>
                        {app.getToolInfo(app.getToolName).title}
                    </span>
            </div>
        );
    }
}

export default LivestockIdxTool;
