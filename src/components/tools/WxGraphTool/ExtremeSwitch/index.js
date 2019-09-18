import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormControl from '@material-ui/core/FormControl';
//import FormLabel from '@material-ui/core/FormLabel';

//const styles = theme => ({
//  //root: {
//  //  display: 'flex',
//  //},
//  colorSwitchBase: {
//    '&$colorChecked': {
//      color: green[500],
//      '& + $colorBar': {
//        backgroundColor: green[500],
//      },
//    },
//  },
//  colorBar: {},
//  colorChecked: {},
//});

var app;

@inject('store') @observer
class ExtremeSwitch extends Component {

  constructor(props) {
    super(props);
    app = this.props.store.app;
  }

  render() {
    const { classes } = this.props;

    return (
        <FormControlLabel
          control={
            <Switch
              checked={app.wxgraph_getExtSwitch}
              onChange={app.wxgraph_setExtSwitch}
              value="extSwitch"
              disabled={app.wxgraph_getTimeFrame!=='por'}
              color="primary"
            />
          }
          label="Enable Threshold View"
        />
    );
  }
}

ExtremeSwitch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default ExtremeSwitch;

