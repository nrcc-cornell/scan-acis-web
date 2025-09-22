import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import {
  Box,
  Typography,
  Grid,
  Divider
} from '@material-ui/core';
import 'typeface-roboto';

import CustomRadioGroup from './CustomRadioGroup';
import CustomSelector from './CustomSelector';
import CustomSlider from './CustomSlider';
import CustomNumberInput from './CustomNumberInput';
import CustomDatePicker from './CustomDatePicker';
import CustomCheckboxes from './CustomCheckboxes';

var app;

@inject('store') @observer
class VarPicker extends Component {
  constructor(props) {
    super(props);
    app = this.props.store.app;
  }

  render() {
    const defaultOptions = [{
      ...app.outputTypePickerInfo,
      selected: app.getOutputType,
      onChange: app.setSelectedOutputType,
    }];

    return (
      <div>
        <Box padding={1} border={1} borderRadius={4} borderColor="primary.main" bgcolor="#f5f5dc">
          {defaultOptions.concat(this.props.options).map((obj, i) => (
            <React.Fragment key={i}>
              {i !== 0 ? <Divider /> : ''}

              <Typography variant="h6">
                {obj.title}
              </Typography>
              
              <Grid container>
                <Grid item xs={12} md={12}>
                  {obj.type === 'radio' && <CustomRadioGroup {...obj} />}
                  {obj.type === 'selector' && <CustomSelector {...obj} />}
                  {obj.type === 'slider' && <CustomSlider {...obj} />}
                  {obj.type === 'number' && <CustomNumberInput {...obj} />}
                  {obj.type === 'date' && <CustomDatePicker {...obj} />}
                  {obj.type === 'checkbox' && <CustomCheckboxes {...obj} />}
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
        </Box>
      </div>
    );
  }
}

export default VarPicker;
