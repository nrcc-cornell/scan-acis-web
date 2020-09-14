import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import { makeStyles } from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
//import ExtremeSwitch from '../ExtremeSwitch'
//import VarPicker from '../VarPicker'
//import { unstable_Box as Box } from '@material-ui/core/Box';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip'
import Cancel from '@material-ui/icons/Cancel'

import UserInput from '../UserInput.jsx';

const styles = theme => ({
  typography: {
    margin: theme.spacing(2),
  },
  buttonTest: {
    marginTop: 26,
    marginRight: 40,
  },
  cancel: {
    position: "absolute",
    right: "32px",
  },
});

class ChangeOptions extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <Button
          aria-owns={open ? 'simple-popper' : undefined}
          aria-haspopup="true"
          variant="outlined"
          color="primary"
          onClick={this.handleClick}
        >
          Update Options
        </Button>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box padding={1} border={2} borderRadius={4} borderColor="primary.main" bgcolor="#ffffff">
            <Tooltip title="Close">
              <Cancel className={classes.cancel} color="primary" onClick={this.handleClose} />
            </Tooltip>
            <UserInput
              startRequest={this.props.startRequest}
              userParams={this.props.userParams}
              handleClose={this.handleClose}
            />
          </Box>
        </Popover>
      </div>
    );
  }
}

ChangeOptions.propTypes = {
  classes: PropTypes.object.isRequired,
  startRequest: PropTypes.func.isRequired,
  userParams: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChangeOptions);
