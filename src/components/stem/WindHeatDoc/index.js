///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import StemMenu from '../StemMenu'
import Button from '@material-ui/core/Button';

import userinput1 from '../../../assets/WindHeat/user_input_1.png'
import output1 from '../../../assets/WindHeat/output_1.png'

// Components
import MenuPopover from '../MenuPopover'

const styles = theme => ({
  root: {
  },
  menuButton: {
    marginRight: 20,
    marginTop: -10,
  },
  control: {
    padding: theme.spacing(2),
  },
});

var app;
var history;

@inject('store') @observer
class WindHeatDoc extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
    }

    render() {

        const { classes } = this.props;
        let url = app.getToolInfo('windheat').url

        return (
          <Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.root} spacing={4}>
            <Grid item container justify="flex-start" alignItems="flex-start" direction="row" xs={2} md={4} lg={3}>
              <Grid item>
                <Hidden mdUp>
                  <MenuPopover/>
                </Hidden>
                <Hidden smDown>
                  <StemMenu/>
                </Hidden>
              </Grid>
            </Grid>
            <Grid item container direction="column" className={classes.root} spacing={4} xs={10} md={8} lg={9}>
              <Grid item>
                <Typography variant="h5">
                  About the Wind Chill and Heat Stress Charts
                </Typography>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      What does this tool do?
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Coming soon...<br/><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Wind Chill and Heat Stress Charts
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      Sources of data
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      Coming soon...<br/><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Wind Chill and Heat Stress Charts
                    </Button>
              </Grid>
              <Grid item>
                    <Typography align="left" paragraph variant="h6">
                      How to use this tool
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>1. User Options</i><br/><br/>
                      Once your site is selected, there is one option at the top of the tool: the year. The year selection defaults to the current year.<br/>
                      <img className="doc-image" src={userinput1} alt="Sample user input from the SCAN/TSCAN Wind Chill and Heat Stress Charts" /><br/><br/>
                    </Typography>
                    <Typography align="left" paragraph variant="body1">
                      <i>2. Output</i><br/><br/>
                      Coming soon...<br/><br/>
                      <img className="doc-image" src={output1} alt="Sample wind frequency table output from the SCAN/TSCAN Wind Chill and Heat Stress Charts" /><br/>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={()=>{history.push(url)}}>
                      Wind Chill and Heat Stress Charts
                    </Button>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

WindHeatDoc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(WindHeatDoc));
