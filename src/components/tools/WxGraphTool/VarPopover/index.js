import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import ExtremeSwitch from '../ExtremeSwitch'
import VarPicker from '../VarPicker'

const styles = theme => ({
  typography: {
    margin: theme.spacing.unit * 2,
  },
});

class VarPopover extends React.Component {
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
          View Variables
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
          <ExtremeSwitch />
          <VarPicker/>
        </Popover>
      </div>
    );
  }
}

VarPopover.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VarPopover);
