import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
//import NoSsr from '@material-ui/core/NoSsr';
import ListItem from '@material-ui/core/ListItem';
//import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
//import InboxIcon from '@material-ui/icons/Inbox';
//import DraftsIcon from '@material-ui/icons/Drafts';
//import Grid from '@material-ui/core/Grid';
//import Hidden from '@material-ui/core/Hidden';
//import Typography from '@material-ui/core/Typography';
//import MemoryRouter from 'react-router/MemoryRouter';
//import Route from 'react-router/Route';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';

//import StemMain from '../StemMain';
//import '../../styles/StemContents.css';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    //width: 240,
  },
  lists: {
    //backgroundColor: theme.palette.background.paper,
    backgroundColor: '#f5f5dc',
  },
  content: {
  },
});

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

  return (
    <Box padding={1} border={4} borderRadius={4} borderColor="primary.main" bgcolor="#f5f5dc">
        <div className={classes.root}>
          <div className={classes.lists}>
            <List component="nav">
              <ListItemLinkShorthand to="/stem/instrumentation" primary="Instrumentation" />
            </List>
            <Divider />
            <List component="nav">
              <ListItemLinkShorthand to="/stem/gddtool_doc" primary="Tools Documentation" />
              <ul>
                  <ListItemLinkShorthand to="/stem/gddtool_doc" primary="Growing Degree Day Calculator" />
                  <ListItemLinkShorthand to="/stem/waterdef_doc" primary="Water Deficit Calculator" />
                  <ListItemLinkShorthand to="/stem/wxgraph_doc" primary="Weather Grapher" />
                  <ListItemLinkShorthand to="/stem/heatidx_doc" primary="Livestock Heat Index" />
              </ul>
            </List>
            <Divider />
            <List component="nav">
              <ListItemLinkShorthand to="/stem/resources" primary="Resources" />
            </List>
          </div>
        </div>
    </Box>
  );
}

ComponentProperty.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComponentProperty);
