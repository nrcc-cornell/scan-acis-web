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
class TimeFrameButtonGroup extends React.Component {
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
          aria-label="timeframe"
          name="timeframe"
          value={app.wxgraph_getTimeFrame}
          onChange={app.wxgraph_setTimeFrameFromRadioGroup}
          row
        >
          <FormControlLabel
            value="por"
            control={<Radio color="primary" />}
            label="Entire Record"
            labelPlacement="top"
          />
          <FormControlLabel
            value="two_years"
            control={<Radio color="primary" />}
            label="2 Years"
            labelPlacement="top"
          />
          <FormControlLabel
            value="two_months"
            control={<Radio color="primary" />}
            label="2 Months"
            labelPlacement="top"
          />
          <FormControlLabel
            value="two_days"
            control={<Radio color="primary" />}
            label="2 Days"
            labelPlacement="top"
          />
        </RadioGroup>
      </FormControl>
          </Grid>
      </Grid>
    );
  }
}

export default TimeFrameButtonGroup;
