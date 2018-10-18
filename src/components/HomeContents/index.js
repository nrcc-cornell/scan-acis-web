///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Components
import StationPicker from '../../components/StationPicker';
import ToolLister from '../../components/ToolLister';

// Styles
import '../../styles/HomeContents.css';

@inject('store') @observer
class HomeContents extends Component {

    render() {

        return (
            <div className="HomeContents">
                <StationPicker />
                <ToolLister />
            </div>
        );
    }
}

export default HomeContents;
