///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Components
import ToolLister from '../../components/ToolLister';

// Styles
import '../../styles/AboutContents.css';

@inject('store') @observer
class AboutContents extends Component {

    render() {

        return (
            <div className="about-contents">
                <p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis mauris lectus, vel cursus ipsum auctor sed. Nullam interdum nulla vitae tellus varius facilisis. Etiam dui tortor, pellentesque euismod pretium sed, condimentum quis justo. Aliquam at tristique erat. Phasellus ultricies elit in luctus aliquet. Donec porta commodo consequat. Praesent vitae sapien lacus.
                </p>
                <p>
Nulla augue nulla, auctor id ante sit amet, semper sollicitudin eros. Ut lorem nisl, porta sit amet arcu ac, elementum euismod massa. Duis consequat congue est, et scelerisque nulla rutrum eget. Praesent vel ultricies purus. Integer vestibulum, dolor id pulvinar malesuada, neque risus egestas est, a ultricies nibh nibh sit amet lacus. Praesent non ex lacinia dui bibendum dictum. Sed ex orci, bibendum eu pulvinar nec, molestie quis neque. Mauris laoreet condimentum odio. Donec in vehicula tortor. Fusce laoreet viverra dignissim. Donec pharetra aliquet lorem, non fringilla velit iaculis eu. Fusce efficitur nisl id dui euismod pretium. Vestibulum rutrum, ex eget tincidunt faucibus, justo neque euismod orci, eget feugiat magna enim eget felis.
                </p>
                <p>
Suspendisse potenti. Morbi fermentum in mauris vel pulvinar. Curabitur eget sollicitudin felis, viverra accumsan ex. Nullam eu odio aliquet, varius ipsum at, rutrum odio. Nam varius ante ligula, non tristique est mollis ac. Fusce interdum enim at ipsum auctor, vel tempus dui tincidunt. Nulla facilisi. Donec urna mi, accumsan at leo sed, molestie elementum risus. Maecenas non porta elit. Nunc vel sem massa. Nunc bibendum lacus lectus, eu feugiat nunc semper et. Pellentesque dictum est in hendrerit feugiat.
                </p>
                <ToolLister />
            </div>
        );
    }
}

export default AboutContents;
