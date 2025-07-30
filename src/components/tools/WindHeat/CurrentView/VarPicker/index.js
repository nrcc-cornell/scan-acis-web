import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';
import WindHeatTypeButtonGroup from '../WindHeatTypeButtonGroup'

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

@inject('store') @observer
class VarPicker extends Component {
  render() {
    return (
      <div>
        <Box padding={1} border={1} borderRadius={4} borderColor="primary.main" bgcolor="#f5f5dc">
          <Typography variant="h6">
            Select "Feels Like" Measure
          </Typography>
          <WindHeatTypeButtonGroup />
        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(VarPicker);
