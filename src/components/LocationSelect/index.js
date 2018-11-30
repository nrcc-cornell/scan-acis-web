///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

import ReactModal from 'react-modal';
import StationPicker from '../../components/StationPicker';

// Styles
import '../../styles/LocationSelect.css';

var app;

@inject('store') @observer
class LocationSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="LocationSelect">
                <span className="location-select-label">Current Location: </span>{app.getLocation.name}, {app.getLocation.state}
                <button className="location-select-change-button" onClick={()=>{app.setShowModalMap(true)}}>Change</button>
                <ReactModal
                   isOpen={app.getShowModalMap}
                   onRequestClose={()=>{app.setShowModalMap(false)}}
                   shouldCloseOnOverlayClick={true}
                   contentLabel="Location Selector"
                   className="Modal"
                   overlayClassName="Overlay"
                 >
                   <StationPicker/>
                 </ReactModal>
            </div>
        );
    }
}

export default LocationSelect;
