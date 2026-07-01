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

const UnitsSelect = (props) => {

    return (
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="select basic or extreme data view"
                  name="tooltype"
                  value={props.value}
                  onChange={props.onchange}
                  column
                >
                  {props.values &&
                    props.values.map((v,i) => (
                      <FormControlLabel
                        value={v.value}
                        control={<Radio color="primary" style={{ width: 12, height: 12 }} />}
                        label={v.label}
                        labelPlacement="end"
                      />
                    ))
                  }
                </RadioGroup>
              </FormControl>
    );

}

UnitsSelect.propTypes = {
  value: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  onchange: PropTypes.func.isRequired,
};

export default UnitsSelect;
