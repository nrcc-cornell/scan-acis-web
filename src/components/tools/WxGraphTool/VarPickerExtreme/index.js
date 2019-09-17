import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import 'typeface-roboto';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//import ExtremeSwitch from '../ExtremeSwitch'
//import UnitsSelect from '../UnitsSelect'
//import UnitsPrcpSelect from '../UnitsPrcpSelect'
import TextInput from '../TextInput'

var app;

@inject('store') @observer
class VarPickerExtreme extends Component {

  constructor(props) {
    super(props);
    app = this.props.store.app;
  }

  render() {

    const handleChangeTempThreshold = (v) => {
        app.wxgraph_setTempThreshold(v)
    }

    const handleChangePrecipThreshold = (v) => {
        app.wxgraph_setPrecipThreshold(v)
    }

    return (
      <Grid item container direction="column" justify="flex-start" spacing={4}>
      <Grid item container direction="column" justify="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="h6">
          Temperature
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
          Number of days exceeding:
          </Typography>
        </Grid>
        <Grid item>
        <TextInput
          selectedvalue={app.wxgraph_getTempThreshold}
          inputlabel={"Threshold"}
          arialabel={"temperature threshold"}
          onchange={handleChangeTempThreshold}
        />
        </Grid>
      </Grid>
      <Grid item container direction="column" justify="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="h6">
          Precipitation
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
          Number of days exceeding:
          </Typography>
        </Grid>
        <Grid item>
        <TextInput
          selectedvalue={app.wxgraph_getPrecipThreshold}
          inputlabel={"Threshold"}
          arialabel={"precipitation threshold"}
          onchange={handleChangePrecipThreshold}
        />
        </Grid>
      </Grid>
      </Grid>
    );
  }
}

export default VarPickerExtreme;
