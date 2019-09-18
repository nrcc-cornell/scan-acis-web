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

const ComparisonSelect = (props) => {
        const { classes } = props;
        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <Select
                value={props.value}
                onChange={props.onchange}
                inputProps={{
                  name: 'comparison',
                  id: 'comparison',
                }}
              >
                <MenuItem key={1} value={'gt'}>{'greater than'}</MenuItem>
                <MenuItem key={2} value={'lt'}>{'less than'}</MenuItem>
              </Select>
            </FormControl>
          </form>
        );
}

ComparisonSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onchange: PropTypes.func.isRequired,
};

export default withStyles(styles)(ComparisonSelect);
