import React, { Component } from 'react';
import { Select, MenuItem, FormControl } from '@material-ui/core';

class CustomSelector extends Component {
  render () {
    return (
      <div style={{ padding: '6px' }}>
        <FormControl variant="outlined" component="fieldset">
          <Select
            aria-label={this.props.name}
            value={this.props.selected}
            onChange={(e) => this.props.onChange(e.target.value)}
          >
            {this.props.options.map(({ value, label }) => 
              <MenuItem key={value} value={value}>{label}</MenuItem>
            )}
          </Select>
        </FormControl>
        {this.props.children}
      </div>
    );
  }
}

export default CustomSelector;
