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
let compareValues;

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

    // function for dynamic sorting
    compareValues = (key, order='asc') => {
      return function(a, b) {
        if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }

        const varA = (typeof a[key] === 'string') ?
          a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
          b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return (
          (order == 'desc') ? (comparison * -1) : comparison
        );
      };
    }

    render() {

        let disabled
        let selectOptions = []
        let sortedNames = this.props.names.sort(this.compareValues('state'))
        let network
        for (var v of sortedNames) {
            disabled = false
            network = v.network=='17' ? 'SCAN' : 'Tribal SCAN'
            selectOptions.push({ value: v.uid.toString(), label: v.name+', '+v.state+' ('+network+')', clearableValue: false, disabled: disabled })
        }

        return (
          <Typography variant="subtitle2">
            <Select
                name="station"
                className="station-explorer-select"
                placeholder={app.getLocation_explorer.name+', '+app.getLocation_explorer.state}
                value={app.getLocation_explorer.uid.toString()}
                isClearable={false}
                backspaceRemovesValue={false}
                options={selectOptions}
                onChange={app.setSelectedLocation_explorer}
            /> 
          </Typography>
        );
    }
}

export default StationExplorerSelect;
