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
class UnitsTempSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
          <Grid container>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1">
                    Temperature
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2">
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="units-temp"
                      name="units"
                      value={app.wxgraph_getUnitsTemp}
                      onChange={app.wxgraph_setUnitsTempFromRadioGroup}
                      row
                    >
                      <FormControlLabel
                        value="degreeF"
                        control={<Radio color="primary" />}
                        label="°F"
                        labelPlacement="left"
                      />
                      <FormControlLabel
                        value="degreeC"
                        control={<Radio color="primary" />}
                        label="°C"
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

export default UnitsTempSelect;
