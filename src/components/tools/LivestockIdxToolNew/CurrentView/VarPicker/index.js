import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
//import FormLabel from '@material-ui/core/FormLabel';
//import FormControl from '@material-ui/core/FormControl';
//import FormGroup from '@material-ui/core/FormGroup';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormHelperText from '@material-ui/core/FormHelperText';
//import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';
import LivestockTypeButtonGroup from '../LivestockTypeButtonGroup'

const styles = theme => ({
  root: {
    display: 'flex',
    color: green[600],
    '&$checked': {
      color: green[500],
    },
    '&&:hover': {
      backgroundColor: "transparent",
    }
  },
  checked: {},
  formControl: {
    marginLeft: theme.spacing(1),
  },
});

//var app;

@inject('store') @observer
class VarPicker extends Component {

  //constructor(props) {
  //  super(props);
  //  app = this.props.store.app;
  //}

  render() {

    return (
      <div>
        <Box padding={1} border={1} borderRadius={4} borderColor="primary.main" bgcolor="#f5f5dc">
          <Typography variant="h6">
            Select Heat Index
          </Typography>
          <LivestockTypeButtonGroup />
        </Box>
      </div>
    );
  }
}

//VarPicker.propTypes = {
//  classes: PropTypes.object.isRequired,
//};

export default withStyles(styles)(VarPicker);
