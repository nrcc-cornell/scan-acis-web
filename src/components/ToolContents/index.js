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
import Typography from "@material-ui/core/Typography";
import { spacing } from '@material-ui/system';

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
            <div style={{ padding: 10 }}>
            <Grid container spacing="1">
              <Grid item xs={9} sm={6} md={3}>
                <ToolSelect names={app.toolNameArray} />
              </Grid>
              <Grid item xs={9} sm={6} md={3}>
                <OutputSelect />
              </Grid>
              <Grid item xs={12} sm={8} md={6}>
                <LocationSelect />
              </Grid>
            </Grid>
            </div>
            <div style={{ marginTop:30, marginBottom:10 }}>
            <Grid container spacing="1">
              <Grid item xs={12}>
                <Typography align="center" variant="h3" className="tool-title">
                  {app.getToolInfo(this.props.name).title}
                </Typography>
              </Grid>
            </Grid>
            </div>
            <div>
            <Grid container spacing="1">
              <Grid item xs={12}>
                { this.props.name==='gddtool' && (<GddTool />) }
                { this.props.name==='waterdef' && app.getLocation && (<WaterDefTool station={app.getLocation.sid} />) }
                { this.props.name==='wxgrapher' && (<WxGraphTool />) }
                { this.props.name==='livestock' && (<LivestockIdxTool />) }
              </Grid>
            </Grid>
            </div>
            </div>
        );
      } else {
        return (false);
      }
    }
}

export default ToolContents;

