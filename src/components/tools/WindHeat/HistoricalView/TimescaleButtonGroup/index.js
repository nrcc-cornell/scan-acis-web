///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
//import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';

const TimescaleButtonGroup = (props) => {

    return (
      <Grid container>
          <Grid item xs={12} md={12}>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="timescale"
          name="timescale"
          value={props.timescale}
          onChange={props.onchangeTimescale}
          row
        >
          <FormControlLabel
            value="hours"
            control={<Radio color="primary" />}
            label="Hours"
            labelPlacement="end"
          />
          <FormControlLabel
            value="days"
            control={<Radio color="primary" />}
            label="Days"
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
          </Grid>
      </Grid>
    );
}

TimescaleButtonGroup.propTypes = {
  timescale: PropTypes.string.isRequired,
  onchangeTimescale: PropTypes.func.isRequired,
};

export default TimescaleButtonGroup;
