///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Select from 'react-select';
import { array } from 'prop-types'
import Typography from '@material-ui/core/Typography';

import Control from 'react-leaflet-control';

// Components

// Styles
//import '../../styles/StationPickerSelect.css';

var app;

@inject('store') @observer
class StationSelect extends Component {

    static propTypes = {
      names: array,
    }

    static defaultProps = {
      names: [],
    }

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        let disabled
        let selectOptions = []
        for (var v of this.props.names) {
            disabled = false
            selectOptions.push({ value: v.uid.toString(), label: v.name, clearableValue: false, disabled: disabled })
        }
        console.log('selectOptions');
        console.log(selectOptions);

        return (
          <Typography variant="subtitle2">
            <Select
                name="station"
                className="station-select"
                placeholder={'STATION > '+app.getLocation.name+', '+app.getLocation.state}
                value={app.getLocation.uid.toString()}
                isClearable={false}
                options={selectOptions}
                onChange={app.setSelectedLocation}
            /> 
          </Typography>
        );
    }
}

export default StationSelect;
