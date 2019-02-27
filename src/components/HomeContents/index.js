///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Components
import StationExplorer from '../../components/StationExplorer';
import ToolLister from '../../components/ToolLister';

// Styles
import '../../styles/HomeContents.css';

let app;

@inject('store') @observer
class HomeContents extends Component {

    constructor(props) {
      super(props);
      app = this.props.store.app;
      // set site's active page
      app.setActivePage(0);
    }

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
