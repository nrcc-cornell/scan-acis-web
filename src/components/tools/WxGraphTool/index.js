///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Styles
import '../../../styles/WxGraphTool.css';

var app;

@inject('store') @observer
class WxGraphTool extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="wx-graph-tool">
                    <span className='wx-graph-tool-header'>
                        {app.getToolInfo(app.getToolName).title}
                    </span>
            </div>
        );
    }
}

export default WxGraphTool;
