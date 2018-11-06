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
                Copyrights, links to partners, links to info pages.
            </div>
        );
    }
}

export default Footer;
