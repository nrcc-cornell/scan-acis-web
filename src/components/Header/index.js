///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    marginLeft: 0,
  },
  headerText: {
    color: 'green',
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  bottomToolbar: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
});

var app;

@inject('store') @observer
class FullWidthTabs extends React.Component {

  constructor(props) {
      super(props);
      app = this.props.store.app;
  }

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    //this.setState({ value });
    this.props.store.app.setActivePage(value);
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="white">
          <Toolbar>
            <div className="title">
                <Typography variant="title" className={classes.headerText}>
                        SCAN-ACIS Tools
                </Typography>
                <Typography variant="subtitle2" className={classes.headerText}>
                        Decision Tools for the Soil Climate Analysis Network
                </Typography>
            </div>
            <section className={classes.rightToolbar}>
              <Tabs
                value={this.props.store.app.getActiveTabIndex}
                onChange={this.handleChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="fullWidth"
              >
                <Tab label="HOME" />
                <Tab label="ABOUT" />
                <Tab label="SCAN 4 STEM" />
              </Tabs>
            </section>
          </Toolbar>
          <div className={classes.bottomToolbar}>
              <Tabs
                value={this.props.store.app.getActiveTabIndex}
                onChange={this.handleChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="fullWidth"
              >
                <Tab label="HOME" />
                <Tab label="ABOUT" />
                <Tab label="SCAN 4 STEM" />
              </Tabs>
          </div>
        </AppBar>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthTabs);
