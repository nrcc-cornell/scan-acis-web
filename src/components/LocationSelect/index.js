///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";

import ReactModal from 'react-modal';
//import StationPicker from '../../components/StationPicker';
//import StationExplorer from '../../components/StationExplorer';
import StationExplorerMap from '../../components/StationExplorerMap';
import StationExplorerSelect from '../../components/StationExplorerSelect';
import StationSelect from '../../components/StationSelect';

// Styles
import '../../styles/LocationSelect.css';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

var app;

@inject('store') @observer
class LocationSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
          <div>
              <Grid container spacing="8">
                <Grid item xs={9}>
                  {app.getLocations && app.getLocation && <StationSelect names={app.getLocations} />}
                </Grid>
                <Grid item xs={3}>
                  <Button variant="contained" color="primary" onClick={()=>{app.setShowModalMap(true)}}>
                    Map
                  </Button>
                </Grid>
              </Grid>
              <div className="LocationSelect">
                <ReactModal
                   isOpen={app.getShowModalMap}
                   onRequestClose={()=>{app.setShowModalMap(false)}}
                   shouldCloseOnOverlayClick={true}
                   contentLabel="Location Selector"
                   className="Modal"
                   overlayClassName="Overlay"
                 >
                   <Grid container spacing="8" direction="column">
                     <Grid container item direction="row" justify="space-around">
                       <StationExplorerSelect names={app.getLocations} />
                       <Button variant="contained" onClick={()=>{app.setShowModalMap(false)}}>
                           Close Map
                       </Button>
                     </Grid>
                     <Grid container item>
                       <StationExplorerMap />
                     </Grid>
                   </Grid>
                 </ReactModal>
              </div>
          </div>
        );
    }
}

export default withStyles(styles)(LocationSelect);
