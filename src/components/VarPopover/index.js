import React from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

const styles = theme => ({
  typography: {
    margin: theme.spacing(2),
  },
  buttonTest: {
    marginTop: 26,
    marginRight: 40,
  },
});

@inject('store') @observer
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
          className={classes.buttonTest}
          onClick={this.handleClick}
        >Change Options</Button>

        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          >
          <div style={{ minWidth: '253px', maxHeight: '80vh' }}>
            {this.props.children}
          </div>
        </Popover>
      </div>
    );
  }
}

VarPopover.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VarPopover);
