///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Components
//

// Styles
import '../../styles/Footer.css';

@inject('store') @observer
class Footer extends Component {

    render() {

        return (
            <div className="Footer">
                This is the footer
            </div>
        );
    }
}

export default Footer;
