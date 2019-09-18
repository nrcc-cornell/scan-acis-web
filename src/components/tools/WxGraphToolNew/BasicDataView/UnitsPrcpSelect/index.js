import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
//import Select from 'react-select';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//import '../../../../styles/UnitsTempSelect.css';

var app;

@inject("store") @observer
class UnitsPrcpSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
          <Grid container>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1">
                    Precipitation
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2">
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="units-prcp"
                      name="units"
                      value={app.wxgraph_getUnitsPrcp}
                      onChange={app.wxgraph_setUnitsPrcpFromRadioGroup}
                      row
                    >
                      <FormControlLabel
                        value="inches"
                        control={<Radio color="primary" />}
                        label="inches"
                        labelPlacement="left"
                      />
                      <FormControlLabel
                        value="cm"
                        control={<Radio color="primary" />}
                        label="cm"
                        labelPlacement="left"
                      />
                      <FormControlLabel
                        value="mm"
                        control={<Radio color="primary" />}
                        label="mm"
                        labelPlacement="left"
                      />
                    </RadioGroup>
                  </FormControl>
                </Typography>
              </Grid>
          </Grid>

        )
    }

};

export default UnitsPrcpSelect;
