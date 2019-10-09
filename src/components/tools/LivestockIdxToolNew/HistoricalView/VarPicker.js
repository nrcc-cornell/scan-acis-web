import React from 'react';
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import LivestockTypeButtonGroup from './LivestockTypeButtonGroup'

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

const VarPicker = (props) => {

    //const { classes } = props;

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

//VarPicker.propTypes = {
//  classes: PropTypes.object.isRequired,
//};

export default withStyles(styles)(VarPicker);
