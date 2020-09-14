///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
import { string } from 'prop-types'
import Button from '@material-ui/core/Button';

// Components
import LocationSelect from '../../components/LocationSelect';
import ToolSelect from '../../components/ToolSelect';
import OutputSelect from '../../components/OutputSelect';
import GddTool from '../../components/tools/GddTool';
//import GddChart from '../../components/tools/GddTool/GddChart';
import WaterDefTool from '../../components/tools/WaterDefTool';
//import WxGraphTool from '../../components/tools/WxGraphTool';
import WxGraphTool from '../../components/tools/WxGraphToolNew';
//import LivestockIdxTool from '../../components/tools/LivestockIdxTool';
import LivestockIdxTool from '../../components/tools/LivestockIdxToolNew';
import WindRose from '../../components/tools/WindRose';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
//import { spacing } from '@material-ui/system';

// Styles
import '../../styles/ToolContents.css';

var app;
var history;

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
        history = this.props.history;
        if (!app.getLocations) {
            app.downloadStationInfo()
        }
        // set tool page active
        app.setActivePage(3);
    }

    render() {

        let url_doc = app.getToolInfo(this.props.name).url_doc

        if (app.getLocations) {
          return (
            <div className='tool-contents'>
            <div style={{ padding: 10 }}>
            <Grid container spacing={1}>
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
            <div style={{ marginTop:30, marginBottom:0 }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography align="center" variant="h3" className="tool-title">
                  {app.getToolInfo(this.props.name).title}
                </Typography>
                {this.props.name!=='windrose' &&
                <Typography align="center" variant="h3">
                  <Button variant="text" color="primary" onClick={()=>{history.push(url_doc)}}>
                    View Documentation
                  </Button>
                </Typography>
                }
              </Grid>
            </Grid>
            </div>
            <div>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                { this.props.name==='gddtool' && (<GddTool />) }
                { this.props.name==='waterdef' && app.getLocation && (<WaterDefTool station={app.getLocation.sid} stnname={app.getLocation.name+', '+app.getLocation.state} />) }
                { this.props.name==='wxgrapher' && app.getLocation && (<WxGraphTool station={app.getLocation.sid} stnname={app.getLocation.name+', '+app.getLocation.state} outputtype={app.getOutputType}/>) }
                { this.props.name==='livestock' && app.getLocation && (<LivestockIdxTool station={app.getLocation.sid} stnname={app.getLocation.name+', '+app.getLocation.state} outputtype={app.getOutputType}/>) }
                { this.props.name==='windrose' && app.getLocation && (<WindRose {...this.props} station={app.getLocation.sid} stnname={app.getLocation.name+', '+app.getLocation.state} por_start={app.getLocation.sdate} outputtype={app.getOutputType}/>) }
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

export default withRouter(ToolContents);

