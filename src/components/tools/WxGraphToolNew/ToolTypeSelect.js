///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
//import FormLabel from '@material-ui/core/FormLabel';
//import Grid from '@material-ui/core/Grid';
//import Typography from '@material-ui/core/Typography';

const ToolTypeSelect = (props) => {

    return (
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="select basic or extreme data view"
                  name="tooltype"
                  value={props.value}
                  onChange={props.onchange}
                  row
                >
                  <FormControlLabel
                    value="basic"
                    control={<Radio color="primary" />}
                    label="Station Data Summaries"
                    labelPlacement="right"
                  />
                  <FormControlLabel
                    value="extreme"
                    control={<Radio color="primary" />}
                    label="Use Threshold Filters"
                    labelPlacement="right"
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
