import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import { Select, MenuItem } from '@material-ui/core';

const ClimatologySelector = (props) => {
    return (
      <Grid container>
        <Grid item xs={12} md={12}>
          <FormControl variant="outlined" component="fieldset">
            <Select
              aria-label="Climatology"
              value={props.climatology}
              onChange={props.onchangeClimatology}
            >
              {props.climatologyOptions.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
}

ClimatologySelector.propTypes = {
  climatologyOptions: PropTypes.array.isRequired,
  climatology: PropTypes.string.isRequired,
  onchangeClimatology: PropTypes.func.isRequired,
};

export default ClimatologySelector;
