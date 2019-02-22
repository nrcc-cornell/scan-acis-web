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
class LivestockTypeButtonGroup extends React.Component {
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
          aria-label="livestock"
          name="livestock"
          value={app.livestock_livestockType}
          onChange={app.livestock_setLivestockTypeFromRadioGroup}
          row
        >
          <FormControlLabel
            value="cattle"
            control={<Radio color="primary" />}
            label="Cattle"
            labelPlacement="top"
          />
          <FormControlLabel
            value="poultry"
            control={<Radio color="primary" />}
            label="Poultry"
            labelPlacement="top"
            disabled
          />
          <FormControlLabel
            value="swine"
            control={<Radio color="primary" />}
            label="Swine"
            labelPlacement="top"
            disabled
          />
        </RadioGroup>
      </FormControl>
          </Grid>
      </Grid>
    );
  }
}

export default LivestockTypeButtonGroup;
