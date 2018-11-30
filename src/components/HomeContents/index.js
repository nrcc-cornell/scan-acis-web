///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Components
import StationExplorer from '../../components/StationExplorer';
import ToolLister from '../../components/ToolLister';

// Styles
import '../../styles/HomeContents.css';

@inject('store') @observer
class HomeContents extends Component {

    render() {

        return (
            <div className="HomeContents">
                <StationExplorer />
                <ToolLister />
            </div>
        );
    }
}

export default HomeContents;
