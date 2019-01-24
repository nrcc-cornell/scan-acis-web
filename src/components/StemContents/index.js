import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import NoSsr from '@material-ui/core/NoSsr';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
//import InboxIcon from '@material-ui/icons/Inbox';
//import DraftsIcon from '@material-ui/icons/Drafts';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import MemoryRouter from 'react-router/MemoryRouter';
import Route from 'react-router/Route';
import { Link } from 'react-router-dom';

import StemMain from './StemMain';
//import '../../styles/StemContents.css';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    //width: 240,
  },
  lists: {
    backgroundColor: theme.palette.background.paper,
  },
  content: {
  },
});

class ListItemLink extends React.Component {
  renderLink = itemProps => <Link to={this.props.to} {...itemProps} data-next="true" />;

  render() {
    const { icon, primary } = this.props;
    return (
      <li>
        <ListItem button component={this.renderLink}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    );
  }
}

ListItemLink.propTypes = {
  icon: PropTypes.node.isRequired,
  primary: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

function ListItemLinkShorthand(props) {
  const { primary, to } = props;
  return (
    <li>
      <ListItem button component={Link} to={to} data-next="true">
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLinkShorthand.propTypes = {
  primary: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

function ComponentProperty(props) {
  const { classes } = props;

  // Use NoSsr to avoid SEO issues with the documentation website.
  return (
    <NoSsr>
      <MemoryRouter initialEntries={['/instrumentation']} initialIndex={0}>
          <Grid container direction="row">
          <Hidden mdDown>
          <Grid item md={0} lg={3}>
        <div className={classes.root}>
          <div className={classes.lists}>
            <List component="nav">
              <ListItemLinkShorthand to="/instrumentation" primary="Instrumentation" />
            </List>
            <Divider />
            <List component="nav">
              <ListItemLinkShorthand to="/gddtool_doc" primary="Tools Documentation" />
              <ul>
                  <ListItemLinkShorthand to="/gddtool_doc" primary="Growing Degree Day Calculator" />
                  <ListItemLinkShorthand to="/waterdef_doc" primary="Water Deficit Calculator" />
                  <ListItemLinkShorthand to="/wxgraph_doc" primary="Weather Grapher" />
                  <ListItemLinkShorthand to="/heatidx_doc" primary="Livestock Heat Index" />
              </ul>
            </List>
            <Divider />
            <List component="nav">
              <ListItemLinkShorthand to="/resources" primary="Resources" />
            </List>
          </div>
        </div>
          </Grid>
          </Hidden>
          <Grid item md={12} lg={9}>
            <Route>
              {({ location }) => (
                <StemMain loc={location.pathname} />
              )}
            </Route>
          </Grid>
          </Grid>
      </MemoryRouter>
    </NoSsr>
  );
}

ComponentProperty.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComponentProperty);
