///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Check from '@material-ui/icons/Check';

import UnitsSelect from './UnitsSelect';

const styles = theme => ({
  textfield: {
    width: '240px',
    background: '#FFFFFF',
  },
});

const TextInput = (props) => {

    const { classes } = props;
    const [proposedvalue, setProposedvalue] = useState(props.selectedvalue);
    const [proposedunits, setProposedunits] = useState(props.selectedunits);

    const updateProposedValue = (e) => {
        setProposedvalue(e.target.value)
    };

    const updateProposedUnits = (e) => {
        setProposedunits(e.target.value)
    };

    //const getUnitsText = () => {
    //    let unitsText = ''
    //    if (props.selectedunits==='degreeF') { unitsText = '°F ' }
    //    if (props.selectedunits==='degreeC') { unitsText = '°C ' }
    //    if (props.selectedunits==='inch') { unitsText = 'in ' }
    //    if (props.selectedunits==='in') { unitsText = 'in ' }
    //    if (props.selectedunits==='cm') { unitsText = 'cm ' }
    //    if (props.selectedunits==='mm') { unitsText = 'mm ' }
    //    return unitsText
    //};

    return (

        <TextField
          className={classes.textfield}
          id="threshold-text-input"
          variant="outlined"
          type={'number'}
          label={props.inputlabel}
          value={proposedvalue}
          fullWidth={false}
          onChange={updateProposedValue}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              props.onchangeThreshold({value:proposedvalue,units:proposedunits});
              e.preventDefault();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <UnitsSelect
                  value={proposedunits}
                  values={props.availableunits}
                  onchange={updateProposedUnits}
                />
                { proposedvalue===props.selectedvalue && proposedunits===props.selectedunits &&
                  <Check color="primary" />
                }
                { (proposedvalue!==props.selectedvalue || proposedunits!==props.selectedunits) &&
                  <Button
                    aria-label={props.arialabel}
                    color="secondary"
                    variant="contained"
                    onClick={() => {props.onchangeThreshold({value:proposedvalue,units:proposedunits})}}
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
  availableunits: PropTypes.array.isRequired,
  inputlabel: PropTypes.string.isRequired,
  arialabel: PropTypes.string.isRequired,
  onchangeThreshold: PropTypes.func.isRequired,
};

export default withStyles(styles)(TextInput);
