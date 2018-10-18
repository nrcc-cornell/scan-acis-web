///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Components
//

// Styles
import '../../styles/Header.css';

@inject('store') @observer
class Header extends Component {

    render() {

        return (
            <div className="scan-header">
                <div className="scan-logo">Logo</div>
                <div className="scan-text">
                <span className="scan-banner">
                        SCAN-ACIS Tools
                </span>
                <br/>
                <span className="scan-tag-line">
                        Decision Tools for the Soil Climate Analysis Network
                </span>
                </div>
            </div>
        );
    }
}

export default Header;
