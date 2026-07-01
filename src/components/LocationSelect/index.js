import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";

import ReactModal from 'react-modal';
import StationExplorerMap from '../../components/StationExplorerMap';
import StationExplorerSelect from '../../components/StationExplorerSelect';

// Styles
import '../../styles/LocationSelect.css';

const styles = theme => ({
  root:{
    marginTop: '6px'
  },
  show: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  hide: {
    display: 'none'
  },
  name: {
    width: 'fit-content',
    maxWidth: '150px',
    fontSize: '0.8rem',
    lineHeight: '0.85rem'
  },
  btn: {
    fontSize: '0.75rem',
  },
  '@media (max-width: 810px)': {
    show: {
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end'
    }
  }
});

var app;

@inject('store') @observer
class LocationSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {
      const { classes } = this.props;

      return (
        <div className={classes.root}>
          <div className={this.props.store.app.getActiveTabIndex === 3 ? classes.show : classes.hide}>
            <span className={classes.name}>{app.getLocation ? `${app.getLocation.name}, ${app.getLocation.state}` : ''}</span>
            <Button className={classes.btn} variant="contained" color="primary" onClick={()=>{app.setShowModalMap(true)}}>
              Change Station
            </Button>
          </div>
          <div className="LocationSelect">
            <ReactModal
              isOpen={app.getShowModalMap}
              onRequestClose={()=>{app.setShowModalMap(false)}}
              shouldCloseOnOverlayClick={true}
              contentLabel="Location Selector"
              className="Modal"
              overlayClassName="Overlay"
            >
              <Grid container spacing="1" direction="column">
                <Grid container item direction="row" justifyContent="space-around">
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