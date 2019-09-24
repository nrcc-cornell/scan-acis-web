///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
//import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
  root: {
    width: 300,
  },
});

function valuetext(value) {
  return `Soil depth from ${value[0]} inches to ${value[1]} inches`;
}

const DepthRangeSelect = (props) => {
        const { classes } = props;
        const marks = [
          {value:   0, label:   '0'},
          {value:   6, label:   '6'},
          {value:  12, label:  '12'},
          {value:  18, label:  '18'},
          {value:  24, label:  '24'},
          {value:  30, label:  '30'},
          {value:  36, label:  '36'},
        ]
        return (
          <div className={classes.root}>
              <Typography id="range-slider" gutterBottom>
                  Soil Depth (inches)
              </Typography>
              <Slider
                  value={props.value}
                  onChange={props.onchange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={36}
                  marks={marks}
                  aria-labelledby="range-slider"
                  getAriaValueText={valuetext}
              />
          </div>
        );
}

DepthRangeSelect.propTypes = {
  value: PropTypes.array.isRequired,
  onchange: PropTypes.func.isRequired,
};

export default withStyles(styles)(DepthRangeSelect);
