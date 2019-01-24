///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

// Components
import MenuPopover from '../MenuPopover'

import scanstn from '../../../assets/scan-station.png'

// Styles
//import '../../../styles/StemResources.css';

const styles = theme => ({
  root: {
    //flexGrow: 1,
  },
  menuButton: {
    marginRight: 20,
    marginTop: -10,
    //[theme.breakpoints.up('md')]: {
    //  display: 'none',
    //},
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

var app;

@inject('store') @observer
class Resources extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        const { classes } = this.props;

        return (
          <Grid container direction="column" justify="flex-start" alignItems="flex-start" className={classes.root} spacing={0}>
            <Grid item container justify="flex-start" alignItems="flex-start" direction="row">
              <Hidden lgUp>
              <Grid item>
                <MenuPopover/>
              </Grid>
              </Hidden>
              <Grid item>
                <Typography variant="h5">
                  Resources
                </Typography>
              </Grid>
            </Grid>
            <Grid item container className={classes.root} spacing={32}>
              <Grid item>
                    <Typography align="left" paragraph variant="body1">
                      <ul>
                        <li>
                          Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et.
                        </li>
                        <li>
                          Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et.
                        </li>
                        <li>
                          Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et.
                        </li>
                        <li>
                          Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et.
                        </li>
                        <li>
                          Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et.
                        </li>
                        <li>
                          Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et.
                        </li>
                        <li>
                          Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et.
                        </li>
                        <li>
                          Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et.
                        </li>
                        <li>
                          Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et.
                        </li>
                        <li>
                          Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel.
                        </li>
                      </ul>
                    </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

Resources.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Resources);
