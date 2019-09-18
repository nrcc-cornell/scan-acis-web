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
import ComparisonSelect from './ComparisonSelect'
import TextInput from './TextInput'

const VarPickerExtreme = (props) => {

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
          Number of days each year <ComparisonSelect value={props.tempComparison} onchange={props.onchangeTempComparison} />
          </Typography>
        </Grid>
        <Grid item>
        <TextInput
          selectedunits={props.tempUnits}
          selectedvalue={props.tempThreshold}
          inputlabel={"Threshold"}
          arialabel={"temperature threshold"}
          onchange={props.onchangeTemp}
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
          Number of days each year <ComparisonSelect value={props.prcpComparison} onchange={props.onchangePrcpComparison} />
          </Typography>
        </Grid>
        <Grid item>
        <TextInput
          selectedunits={props.prcpUnits}
          selectedvalue={props.prcpThreshold}
          inputlabel={"Threshold"}
          arialabel={"precipitation threshold"}
          onchange={props.onchangePrcp}
        />
        </Grid>
      </Grid>
      </Grid>
    );

}

VarPickerExtreme.propTypes = {
  tempUnits: PropTypes.string.isRequired,
  prcpUnits: PropTypes.string.isRequired,
  tempThreshold: PropTypes.string.isRequired,
  prcpThreshold: PropTypes.string.isRequired,
  tempComparison: PropTypes.string.isRequired,
  prcpComparison: PropTypes.string.isRequired,
  onchangeTemp: PropTypes.func.isRequired,
  onchangePrcp: PropTypes.func.isRequired,
  onchangeTempComparison: PropTypes.func.isRequired,
  onchangePrcpComparison: PropTypes.func.isRequired,
};

export default VarPickerExtreme;
