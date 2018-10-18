///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Components
//

// Styles
import '../../styles/StemContents.css';

@inject('store') @observer
class StemContents extends Component {

    render() {

        return (
            <div className="StemContents">
                <p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis mauris lectus, vel cursus ipsum auctor sed. Nullam interdum nulla vitae tellus varius facilisis. Etiam dui tortor, pellentesque euismod pretium sed, condimentum quis justo. Aliquam at tristique erat. Phasellus ultricies elit in luctus aliquet. Donec porta commodo consequat. Praesent vitae sapien lacus.
                </p>
            </div>
        );
    }
}

export default StemContents;
