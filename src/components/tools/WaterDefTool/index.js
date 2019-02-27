///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Styles
import '../../../styles/WaterDefTool.css';

var app;

@inject('store') @observer
class WaterDefTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('waterdef')
    }

    render() {

        return (
            <div className="water-def-tool">
                    <span className='water-def-tool-header'>
                        {app.getToolInfo(app.getToolName).title}
                    </span>
            </div>
        );
    }
}

export default WaterDefTool;
