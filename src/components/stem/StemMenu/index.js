import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
//import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
//import ArrowBack from '@material-ui/icons/ArrowBack';
//import Assessment from '@material-ui/icons/Assessment';
//import WbSunny from '@material-ui/icons/WbSunny';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';

//import StemMain from '../StemMain';
//import '../../styles/StemContents.css';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    //width: 240,
    //minWidth: 400,
  },
  lists: {
    //backgroundColor: theme.palette.background.paper,
    backgroundColor: '#f5f5dc',
  },
  listHeaders: {
    fontWeight: 'bold',
  },
  content: {
  },
});

function ListItemLinkShorthand(props) {
  const { primary, to } = props;
  return (
    <li>
      <ListItem button component={Link} to={to} data-next="true">
        <ListItemText
          disableTypography
          primary={<Typography type="body2" style={{ color: '#000000' }}>{primary}</Typography>}
        />
      </ListItem>
    </li>
  );
}

function ListHeaderItemLinkShorthand(props) {
  const { primary, to } = props;
  return (
    <li>
      <ListItem button component={Link} to={to} data-next="true">
        <ListItemText
          disableTypography
          primary={<Typography type="body2" style={{ color: '#000000', fontSize: '20px', fontWeight:'bold' }}>{primary}</Typography>}
        />
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
              <div className={classes.listHeaders}>
                <ListHeaderItemLinkShorthand to="/stem/instrumentation" primary="Instrumentation" />
              </div>
            </List>
            <Divider />
            <List component="nav">
              <ListHeaderItemLinkShorthand to="/stem/soils_overview" primary="Soils" />
              <ul>
                  <ListItemLinkShorthand to="/stem/soils_overview" primary="Overview of Soils" />
                  <ListItemLinkShorthand to="/stem/soils_reports" primary="Soil Reports on TSCAN sites" />
                  <ListItemLinkShorthand to="/stem/soils_manuals" primary="Manuals about KSSL Laboratory Data" />
                  <ListItemLinkShorthand to="/stem/soils_examples" primary="Example Pedons" />
              </ul>
            </List>
            <Divider />
            <List component="nav">
              <ListHeaderItemLinkShorthand to="/stem/gddtool_doc" primary="Tools Documentation" />
              <ul>
                  <ListItemLinkShorthand to="/stem/gddtool_doc" primary="Growing Degree Day Calculator" />
                  <ListItemLinkShorthand to="/stem/waterdef_doc" primary="Water Deficit Calculator" />
                  <ListItemLinkShorthand to="/stem/wxgraph_doc" primary="Weather Grapher" />
                  <ListItemLinkShorthand to="/stem/heatidx_doc" primary="Livestock Heat Index" />
                  <ListItemLinkShorthand to="/stem/windrose_doc" primary="Wind Rose Diagram" />
                  <ListItemLinkShorthand to="/stem/windheat_doc" primary="Wind Chill & Heat Stress" />
              </ul>
            </List>
            <Divider />
            <List component="nav">
              <ListHeaderItemLinkShorthand to="/stem/resources" primary="Resource Links" />
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
