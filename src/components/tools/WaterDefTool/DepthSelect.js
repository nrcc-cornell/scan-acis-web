///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 120,
  },
});

const DepthSelect = (props) => {
        const { classes } = props;
        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="depth">Depth (cm)</InputLabel>
              <Select
                value={props.value}
                onChange={props.onchange}
                inputProps={{
                  name: 'depth',
                  id: 'depth',
                }}
              >
                {props.values &&
                  props.values.map((v,i) => (
                    <MenuItem value={v}>{'0-'+v.toString()}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </form>
        );
}

DepthSelect.propTypes = {
  value: PropTypes.number.isRequired,
  values: PropTypes.array.isRequired,
  onchange: PropTypes.func.isRequired,
};

export default withStyles(styles)(DepthSelect);
