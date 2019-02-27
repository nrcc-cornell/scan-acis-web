///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { string } from 'prop-types'

// Components
import LocationSelect from '../../components/LocationSelect';
import ToolSelect from '../../components/ToolSelect';
import OutputSelect from '../../components/OutputSelect';
import GddTool from '../../components/tools/GddTool';
//import GddChart from '../../components/tools/GddTool/GddChart';
import WaterDefTool from '../../components/tools/WaterDefTool';
import WxGraphTool from '../../components/tools/WxGraphTool';
import LivestockIdxTool from '../../components/tools/LivestockIdxTool';
import Grid from "@material-ui/core/Grid";

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
        if (!app.getLocations) {
            app.downloadStationInfo()
        }
        // set tool page active
        app.setActivePage(3);
    }

    render() {

        if (app.getLocations) {
          return (
            <div className='tool-contents'>
            <Grid container spacing="8">
              <Grid item xs={12}>
                <LocationSelect />
              </Grid>
              <Grid item xs={9} sm={6}>
                <ToolSelect names={app.toolNameArray} />
              </Grid>
              <Grid item xs={9} sm={4}>
                <OutputSelect />
              </Grid>
              <Grid item xs={12}>
                { this.props.name==='gddtool' && (<GddTool />) }
                { this.props.name==='waterdef' && (<WaterDefTool />) }
                { this.props.name==='wxgrapher' && (<WxGraphTool />) }
                { this.props.name==='livestock' && (<LivestockIdxTool />) }
              </Grid>
            </Grid>
            </div>
        );
      } else {
        return (false);
      }
    }
}

export default ToolContents;

