import React, { Component } from 'react';
import { Slider } from '@material-ui/core';

class CustomSlider extends Component {
  render () {
    return (
      <div style={{ padding: '6px' }}>
        <Slider
          value={this.props.selected}
          onChange={(e, newValue) => this.props.onChange(newValue)}
          valueLabelDisplay="auto"
          min={this.props.props.min}
          max={this.props.props.max}
          marks={this.props.options}
          getAriaValueText={this.props.props.getAriaValueText}
        />
      </div>
    );
  }
}

export default CustomSlider;
