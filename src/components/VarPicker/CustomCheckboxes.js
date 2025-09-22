import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import 'typeface-roboto';

const styles = theme => ({
  root: {
    display: 'flex',
    color: green[600],
    '&$checked': {
      color: green[500],
    },
    '&&:hover': {
      backgroundColor: "transparent",
    }
  },
  checked: {},
  formControl: {},
});

var app;

@inject('store') @observer
class CustomCheckboxes extends Component {
  constructor(props) {
    super(props);
    app = this.props.store.app;
  }

  render() {
    const { classes } = this.props;

    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup className={classes.formGroup}>
          {this.props.options.map(({ label, value, checked, onChange, canBeDisabled }) => {
            if (canBeDisabled) {
              return (
                <FormControlLabel
                  key={value}
                  className={classes.formControlLabel}
                  control={
                    <Checkbox
                      checked={this.props.disabled ? false : checked}
                      disabled={this.props.disabled}
                      onChange={onChange}
                      value={value}
                      classes={{
                        root: classes.root,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label={label}
                />
              );
            } else {
              return (
                <FormControlLabel
                  key={value}
                  className={classes.formControlLabel}
                  control={
                    <Checkbox 
                      checked={checked}
                      onChange={onChange}
                      value={value}
                      classes={{
                        root: classes.root,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label={label}
                />
              );
            }
          })}
        </FormGroup>
        {this.props.children}
      </FormControl>
    );
  }
}

export default withStyles(styles)(CustomCheckboxes);
