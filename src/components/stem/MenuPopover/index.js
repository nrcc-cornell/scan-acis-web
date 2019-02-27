import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';
//import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Popover from '@material-ui/core/Popover';
//import ExtremeSwitch from '../ExtremeSwitch'
//import VarPicker from '../VarPicker'
import StemMenu from '../StemMenu'

const styles = theme => ({
  typography: {
    margin: theme.spacing.unit * 2,
  },
  menuButton: {
    marginRight: 20,
    marginTop: -10,
  },
});

class MenuPopover extends React.Component {
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
         <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={this.handleClick}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
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
          <StemMenu/>
        </Popover>
      </div>
    );
  }
}

MenuPopover.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuPopover);
