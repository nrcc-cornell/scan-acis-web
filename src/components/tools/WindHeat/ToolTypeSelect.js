import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

const ToolTypeSelect = (props) => {

    return (
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="select current or historical data view"
                  name="tooltype"
                  value={props.value}
                  onChange={props.onchange}
                  row
                >
                  <FormControlLabel
                    value="current"
                    control={<Radio color="primary" />}
                    label={<Typography variant="h6">Current & Forecast</Typography>}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="historical"
                    control={<Radio color="primary" />}
                    label={<Typography variant="h6">Historical Frequencies</Typography>}
                    labelPlacement="end"
                  />
                </RadioGroup>
              </FormControl>
    );

}

ToolTypeSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onchange: PropTypes.func.isRequired,
};

export default ToolTypeSelect;
