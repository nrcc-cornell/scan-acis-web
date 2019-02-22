///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Select from 'react-select';
import { array } from 'prop-types'
import Typography from '@material-ui/core/Typography';

//import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/StationExplorerSelect.css';

var app;

@inject('store') @observer
class StationExplorerSelect extends Component {

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

    render() {

        let disabled
        let selectOptions = []
        for (var v of this.props.names) {
            disabled = false
            selectOptions.push({ value: v.uid.toString(), label: v.name, clearableValue: false, disabled: disabled })
        }

        return (
          <Typography variant="subtitle2">
            <Select
                name="station"
                className="station-explorer-select"
                placeholder={app.getLocation_explorer.name+', '+app.getLocation_explorer.state}
                value={app.getLocation_explorer.uid.toString()}
                isClearable={false}
                options={selectOptions}
                onChange={app.setSelectedLocation_explorer}
            /> 
          </Typography>
        );
    }
}

export default StationExplorerSelect;
