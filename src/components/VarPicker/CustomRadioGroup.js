import React, { Component } from 'react';
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';

class CustomRadioGroup extends Component {
  render() {
    return (
      <FormControl component="fieldset">
        <RadioGroup
          aria-label={this.props.name}
          name={this.props.name}
          value={this.props.selected}
          onChange={(e) => this.props.onChange(e.target.value)}
        >
          {this.props.options.map(({value, label}) => 
            <FormControlLabel
              key={label}
              value={value}
              control={<Radio color="primary" />}
              label={label}
              labelPlacement="end"
            />  
          )}
        </RadioGroup>
      </FormControl>
    );
  }
}

export default CustomRadioGroup;
