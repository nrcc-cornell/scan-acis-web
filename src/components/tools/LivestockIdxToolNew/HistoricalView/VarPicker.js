import React from 'react';
import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
//import green from '@material-ui/core/colors/green';
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import TimescaleButtonGroup from './TimescaleButtonGroup'
import LivestockTypeButtonGroup from './LivestockTypeButtonGroup'

const VarPicker = (props) => {

    return (
      <div>
        <Box padding={1} border={1} borderRadius={4} borderColor="primary.main" bgcolor="#f5f5dc">
          <Typography variant="h6">
            Heat Index
          </Typography>
          <LivestockTypeButtonGroup />
          <div style={{margin:20}}></div>
          <Divider />
          <div style={{margin:20}}></div>
          <Typography variant="h6">
            Timescale
          </Typography>
          <TimescaleButtonGroup timescale={props.timescale} onchangeTimescale={props.onchangeTimescale} />
        </Box>
      </div>
    );

}

VarPicker.propTypes = {
  timescale: PropTypes.string.isRequired,
  onchangeTimescale: PropTypes.func.isRequired,
};

export default VarPicker;
