///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Components
import ToolCard from '../../components/ToolCard';

// Styles
import '../../styles/ToolLister.css';

var app;

@inject('store') @observer
class ToolLister extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="tool-lister">
                <div className='tool-header'>SCAN Decision Tools</div> 
                <ToolCard {...app.getToolInfo('gddtool')} />
                <ToolCard {...app.getToolInfo('waterdef')} />
                <ToolCard {...app.getToolInfo('wxgrapher')} />
                <ToolCard {...app.getToolInfo('livestock')} />
            </div>
        );
    }
}

export default ToolLister;
