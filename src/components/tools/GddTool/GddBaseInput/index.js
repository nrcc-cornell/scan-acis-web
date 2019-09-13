///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import Select from 'react-select';
import Button from '@material-ui/core/Button';
//import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
//import Update from '@material-ui/icons/Update';
import Check from '@material-ui/icons/Check';

// Styles
import '../../../../styles/GddBaseInput.css';

var app;

@inject('store') @observer
class GddBaseInput extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.state = {
          baseValue: app.gddtool_getBase,
        }
    };

    render() {

        const updateBaseValue = (e) => {
            this.setState({
              baseValue: e.target.value
            })
        };

        return (
      <TextField
        className="gdd-base-input"
        id="gdd-base-input"
        variant="outlined"
        type={'number'}
        label="GDD Base (°F)"
        value={this.state.baseValue}
        onChange={updateBaseValue}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            app.gddtool_setBaseManually(this.state.baseValue);
            e.preventDefault();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              { this.state.baseValue===app.gddtool_getBase &&
                <Check color="primary" />
              }
              { this.state.baseValue!==app.gddtool_getBase &&
                <Button
                  aria-label="update growing degree day base"
                  color="secondary"
                  variant="contained"
                  onClick={() => {app.gddtool_setBaseManually(this.state.baseValue)}}
                >
                  Update
                </Button>
              }
            </InputAdornment>
          ),
        }}
      />
        );
    }
}

export default GddBaseInput;
