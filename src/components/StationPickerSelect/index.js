///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Select from 'react-select';
import { array } from 'prop-types'

//import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/StationPickerSelect.css';

var app;

@inject('store') @observer
class StationPickerSelect extends Component {

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

        return (
            <Select
                name="station"
                className="station-picker-select"
                placeholder={'SELECTED : '+app.getLocation.name}
                value={app.getLocation.uid.toString()}
                isClearable={false}
                options={selectOptions}
                onChange={app.setSelectedLocation}
            /> 
        );
    }
}

export default StationPickerSelect;
