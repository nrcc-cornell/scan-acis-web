import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import 'typeface-roboto';
import ExtremeSwitch from '../ExtremeSwitch'

const styles = theme => ({
  root: {
    display: 'flex',
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
  formControl: {
    marginLeft: theme.spacing.unit * 4,
    width: '160px',
  },
});

var app;

@inject('store') @observer
class VarPicker extends Component {

  constructor(props) {
    super(props);
    app = this.props.store.app;
  }

  render() {
    const { classes } = this.props;
    const { airtemp, rainfall, soiltemp, soilmoist, humidity, solarrad, wind, leafwet } = app.wxgraph_getVars;
    const { airtemp_label, rainfall_label, soiltemp_label, soilmoist_label, humidity_label, solarrad_label, wind_label, leafwet_label } = app.wxgraph_getVarLabels;

    return (
      <div>
      <ExtremeSwitch/>
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup className={classes.formGroup}>
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Checkbox 
                  checked={airtemp}
                  onChange={app.wxgraph_setVars('airtemp')}
                  value="airtemp"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label={airtemp_label}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Checkbox 
                  checked={rainfall}
                  onChange={app.wxgraph_setVars('rainfall')}
                  value="rainfall"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label={rainfall_label}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Checkbox
                  checked={soiltemp}
                  onChange={app.wxgraph_setVars('soiltemp')}
                  value="soiltemp"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label={soiltemp_label}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Checkbox
                  checked={soilmoist}
                  onChange={app.wxgraph_setVars('soilmoist')}
                  value="soilmoist"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label={soilmoist_label}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Checkbox
                  checked={humidity}
                  onChange={app.wxgraph_setVars('humidity')}
                  value="humidity"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label={humidity_label}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Checkbox
                  checked={solarrad}
                  onChange={app.wxgraph_setVars('solarrad')}
                  value="solarrad"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label={solarrad_label}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Checkbox
                  checked={wind}
                  onChange={app.wxgraph_setVars('wind')}
                  value="wind"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label={wind_label}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Checkbox
                  checked={leafwet}
                  onChange={app.wxgraph_setVars('leafwet')}
                  value="leafwet"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label={leafwet_label}
            />
          </FormGroup>
        </FormControl>
      </div>
      </div>
    );
  }
}

VarPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VarPicker);
