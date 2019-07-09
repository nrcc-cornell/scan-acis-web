///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
//import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import StemMenu from '../StemMenu'

// Components
import MenuPopover from '../MenuPopover'

//import scanstn from '../../../assets/scan-station.png'

// Styles
//import '../../../styles/StemHeatidxDoc.css';

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

//var app;

@inject('store') @observer
class HeatidxDoc extends Component {

    //constructor(props) {
    //    super(props);
    //    app = this.props.store.app;
    //}

    render() {

        const { classes } = this.props;

        return (
          <Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.root} spacing={0}>
            <Grid item container justify="flex-start" alignItems="flex-start" direction="row" xs={2} md={3}>
              <Grid item>
                <Hidden mdUp>
                  <MenuPopover/>
                </Hidden>
                <Hidden smDown>
                  <StemMenu/>
                </Hidden>
              </Grid>
            </Grid>
            <Grid item container className={classes.root} spacing={4} xs={10} md={9}>
              <Grid item>
                <Typography variant="h5">
                  About the Livestock Heat Index
                </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      What does this tool do?
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Lorem ipsum dolor sit amet, eu tristique, etiam vel donec, lorem ut ridiculus aliquam, eget faucibus at nunc, cursus justo nonummy et. Imperdiet ut pellentesque eu lacus tincidunt, dolor pede velit felis tempus et justo. Id sit eget sollicitudin, vitae et, tellus cum a massa quam scelerisque sed. Sed duis suscipit, sed quisque potenti quis donec mollitia. Justo urna fusce sed id nisl eu, lobortis tincidunt lobortis, aenean diam orci, mauris elit in, quam bibendum sed commodo est sed. Pellentesque a nam, non in nullam rhoncus neque aliquam ac, mollis convallis. Sed vestibulum, dolor vulputate leo a, a in posuere et a. Nam commodo condimentum, est ipsum mattis sollicitudin ante commodo tristique. Mollitia taciti luctus lacus quisque. Nec maecenas ut dui maecenas sapien. Tincidunt nullam occaecat in, mauris exercitation ipsum vitae, nunc integer non, at quis turpis varius, nibh adipiscing velit mi.
                    </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      How to use this tool.
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
Vestibulum eu sociis litora sed mauris, fusce consequat gravida mi dictum cras turpis, lectus suscipit eros phasellus nunc vel. Euismod eros duis, tortor aliquam, ipsum scelerisque viverra, nonummy at nisl neque neque ornare, ultricies quam venenatis est nunc duis. A wisi rhoncus. Sit quasi augue aliquam in, nibh vel posuere, sollicitudin nec mi mollis, imperdiet quam maecenas ac tellus, aptent mi pede auctor non. Luctus placerat metus enim risus dui, lectus fermentum libero, erat risus sit ut mauris arcu, lorem vestibulum purus mattis vestibulum in non, ullamcorper a donec praesent fringilla ut. Amet quisque vehicula, venenatis rhoncus metus blandit pede et orci, tempus euismod arcu, diam rhoncus ut, magna tempor eget tristique vel quasi mollis. In in nibh pharetra mi. Pellentesque vel eget nobis, hymenaeos at hendrerit, augue sapien, maecenas pharetra, interdum id gravida cum mauris hymenaeos. Praesent in ut qui, lacus gravida, quasi urna sagittis a, accumsan dui metus sit aliquam lobortis lectus. Minima a amet, neque odio, sit enim netus adipiscing porttitor aenean et.
                    </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

HeatidxDoc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HeatidxDoc);
