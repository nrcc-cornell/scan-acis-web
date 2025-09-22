import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const styles = theme => ({
  menu: {
    border: '1px solid rgb(200,200,200)',
    borderRadius: '5px',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
  },
  popper: {
    zIndex: 1100,
    top: '-2px !important'
  },
  selected: {
    backgroundColor: theme.palette.primary.main
  }
})

class ToolDropdown extends Component {
  state = {
    anchorEl: null,
  };

  handleOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSelect = (selectedUrl) => {
    this.props.handleChangeFromDropdown(selectedUrl);
    this.handleClose();
  }

  render () {
    const { classes, groupName, isActiveTab } = this.props;
    const open = Boolean(this.state.anchorEl);
    const activeTool = window.location.pathname;

    return (
      <div
        className={classes.root}
        onMouseLeave={this.handleClose}
      >
        <button
          className={'MuiButtonBase-root MuiTab-root inject-with-store(FullWidthTabs)-tab-5 MuiTab-textColorPrimary' + (isActiveTab ? ' Mui-selected' : '')}
          id={`${groupName}-button`}
          aria-controls={open ? `${groupName}-menu` : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onMouseEnter={this.handleOpen}
        >
          <span className='MuiTab-wrapper'>
            {groupName}
          </span>
          <span style={{
            position: 'absolute',
            right: '15%',
            transform: `rotate(${open ? '' : '-'}90deg)`, 
            transitionDuration: '300ms',
            transformOrigin: 'center',
            height: 'fit-content'
          }}>&#10095;</span>
        </button>

        <Popper open={open} anchorEl={this.state.anchorEl} transition className={classes.popper}>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <MenuList autoFocusItem={open} className={classes.menu} id="tools-list">
                <MenuItem className={activeTool === '/tools/weather-grapher' ? classes.selected : classes.notSelected} onClick={() => this.handleSelect('/tools/weather-grapher')}>Weather Grapher</MenuItem>
                <MenuItem className={activeTool === '/tools/growing-degree-day' ? classes.selected : classes.notSelected} onClick={() => this.handleSelect('/tools/growing-degree-day')}>Growing Degree Day Calculator</MenuItem>
                <MenuItem className={activeTool === '/tools/water-deficit-calculator' ? classes.selected : classes.notSelected} onClick={() => this.handleSelect('/tools/water-deficit-calculator')}>Water Deficit Calculator</MenuItem>
                <MenuItem className={activeTool === '/tools/livestock-heat-index' ? classes.selected : classes.notSelected} onClick={() => this.handleSelect('/tools/livestock-heat-index')}>Livestock Heat Index</MenuItem>
                <MenuItem className={activeTool === '/tools/wind-rose' ? classes.selected : classes.notSelected} onClick={() => this.handleSelect('/tools/wind-rose')}>Wind Rose Diagram</MenuItem>
                <MenuItem className={activeTool === '/tools/wind-chill-heat-index' ? classes.selected : classes.notSelected} onClick={() => this.handleSelect('/tools/wind-chill-heat-index')}>Wind Chill & Heat Index</MenuItem>
              </MenuList>
            </Grow>
          )}
        </Popper>
        {this.props.children}
      </div>
    )
  }
}

export default withStyles(styles)(ToolDropdown)
