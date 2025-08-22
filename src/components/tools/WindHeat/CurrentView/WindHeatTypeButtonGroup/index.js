///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
//import FormLabel from '@material-ui/core/FormLabel';
import { inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';

var app;

@inject('store') @observer
class WindHeatTypeButtonGroup extends React.Component {
  constructor(props) {
      super(props);
      app = this.props.store.app;
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <Grid container>
          <Grid item xs={12} md={12}>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="windheat"
          name="windheat"
          value={app.windheat_windheatType}
          onChange={app.windheat_setwindheatTypeFromRadioGroup}
        >
          <FormControlLabel
            value="windchill"
            control={<Radio color="primary" />}
            label="Wind Chill"
            labelPlacement="end"
          />
          <FormControlLabel
            value="heatindex"
            control={<Radio color="primary" />}
            label="Heat Index"
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
          </Grid>
      </Grid>
    );
  }
}

export default WindHeatTypeButtonGroup;
