import React from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import ToolDropdown from './ToolDropdown';
import LocationSelect from '../LocationSelect';

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
  tabs: {
    marginTop: '6px',
    height: '30px',
    minHeight: '30px',
    borderLeft: '1px solid rgb(200,200,200)'
  },
  tab: {
    minWidth: 120,
    width: 120,
    border: '1px solid rgb(200,200,200)',
    borderLeft: 'none',
    padding: 0,
    height: '30px',
    minHeight: '30px',
    '&:hover': {
      backgroundColor: 'rgba(100,100,100,0.1)'
    }
  },
  headerText: {
    color: 'green',
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  subHeaderText: {
    color: 'green',
    fontSize: '16px'
  },
  titleLong: {
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  titleShort: {
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  '@media (max-width: 810px)': {
    navContainer: {
      flexDirection: 'column'
    }
  }
});


@inject('store') @observer
class FullWidthTabs extends React.Component {

  handleChange = (event, value) => {
    //this.setState({ value });
    if (value===0) {
        // go to home page
        this.props.history.push('/');
    } else if (value===1) {
        // go to about page
        this.props.history.push('/about');
    } else if (value===2) {
        // go to stem page
        this.props.history.push('/stem');
    } else {
        // go to tools page
        this.props.history.push('/tools');
    }
    this.props.store.app.setActivePage(value);
  };

  handleChangeFromDropdown = (index) => (url) => {
    this.props.history.push(url);
    this.props.store.app.setActivePage(index);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="inherit">
          <div className={classes.titleLong} onClick={() => {this.props.history.push('/')}}>
              <Typography variant="h1" className={classes.headerText}>
                      Decision Tools for the Soil Climate Analysis Network
              </Typography>
              <Typography variant="h2" className={classes.subHeaderText}>
                      Powered by ACIS, the Applied Climate Information System
              </Typography>
          </div>
          <div className={classes.titleShort} onClick={() => {this.props.history.push('/')}}>
              <Typography variant="h1" className={classes.headerText}>
                      SCAN Decision Tools
              </Typography>
              <Typography variant="h2" className={classes.subHeaderText}>
                      Powered by ACIS
              </Typography>
          </div>
          <div className={classes.navContainer}>
            <Tabs
              value={this.props.store.app.getActiveTabIndex}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="standard"
              classes={{ root: classes.tabs }}
            >
              <Tab classes={{ root: classes.tab }} label="HOME" value={0} />
              <Tab classes={{ root: classes.tab }} value={3} component={ToolDropdown} groupName='TOOLS' isActiveTab={this.props.store.app.getActiveTabIndex === 3} handleChangeFromDropdown={this.handleChangeFromDropdown(3)} />
              <Tab classes={{ root: classes.tab }} label="ABOUT" value={1} />
              <Tab classes={{ root: classes.tab }} label="SCAN 4 STEM" value={2} />
            </Tabs>

            <LocationSelect />
          </div>
        </AppBar>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(FullWidthTabs));
