///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Check from '@material-ui/icons/Check';

const TextInput = (props) => {

    const [proposedvalue, setProposedvalue] = useState(props.selectedvalue);

    const updateProposedValue = (e) => {
        setProposedvalue(e.target.value)
    };

    const getUnitsText = () => {
        let unitsText = ''
        if (props.selectedunits==='degreeF') { unitsText = '°F ' }
        if (props.selectedunits==='degreeC') { unitsText = '°C ' }
        if (props.selectedunits==='inch') { unitsText = 'in ' }
        if (props.selectedunits==='in') { unitsText = 'in ' }
        if (props.selectedunits==='cm') { unitsText = 'cm ' }
        if (props.selectedunits==='mm') { unitsText = 'mm ' }
        return unitsText
    };

    return (

        <TextField
          className="threshold-text-input"
          id="threshold-text-input"
          variant="outlined"
          type={'number'}
          label={props.inputlabel}
          value={proposedvalue}
          onChange={updateProposedValue}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              props.onchange(proposedvalue);
              e.preventDefault();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {getUnitsText()}
                { proposedvalue===props.selectedvalue &&
                  <Check color="primary" />
                }
                { proposedvalue!==props.selectedvalue &&
                  <Button
                    aria-label={props.arialabel}
                    color="secondary"
                    variant="contained"
                    onClick={() => {props.onchange(proposedvalue)}}
                  >
                    Update
                  </Button>
                }
              </InputAdornment>
            ),
          }}
        />

    );
}

TextInput.propTypes = {
  selectedunits: PropTypes.string.isRequired,
  selectedvalue: PropTypes.string.isRequired,
  inputlabel: PropTypes.string.isRequired,
  arialabel: PropTypes.string.isRequired,
  onchange: PropTypes.func.isRequired,
};

export default TextInput;
