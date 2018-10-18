///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { string } from 'prop-types'

// Components
import ToolSelect from '../../components/ToolSelect';
import GddTool from '../../components/tools/GddTool';
//import GddChart from '../../components/tools/GddTool/GddChart';
import WaterDefTool from '../../components/tools/WaterDefTool';
import WxGraphTool from '../../components/tools/WxGraphTool';
import LivestockIdxTool from '../../components/tools/LivestockIdxTool';

// Styles
import '../../styles/ToolContents.css';

var app;

@inject('store') @observer
class ToolContents extends Component {

    static propTypes = {
      name: string,
    }

    static defaultProps = {
      name: "",
    }

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className='tool-contents'>
                <ToolSelect names={app.toolNameArray} />
                { this.props.name==='gddtool' && (<GddTool />) }
                { this.props.name==='waterdef' && (<WaterDefTool />) }
                { this.props.name==='wxgrapher' && (<WxGraphTool />) }
                { this.props.name==='livestock' && (<LivestockIdxTool />) }
            </div>
        );
    }
}

export default ToolContents;

