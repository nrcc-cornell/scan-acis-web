///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";

import ReactModal from 'react-modal';
import StationPicker from '../../components/StationPicker';
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
                <Grid item xs={9} md={6}>
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
                   <StationPicker/>
                 </ReactModal>
              </div>
          </div>
        );
    }
}

export default withStyles(styles)(LocationSelect);
