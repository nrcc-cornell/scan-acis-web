///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
//import Control from 'react-leaflet-control';
//import { Map, GeoJSON, LayersControl, TileLayer } from 'react-leaflet';
//import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';
//import LegendControl from '../LegendControl';

import StationPickerSelect from '../StationPickerSelect';

// Styles
import '../../styles/StationPicker.css';

const mapContainer = 'map-container';
const maxBounds = [
    [24.9493, -125.0011],
    [49.5904, -66.9326]
];
//const mapCenter = [42.8, -75.5];
const mapCenter = [37.0, -95.7];
//const mapCenter = [37.0, -75.7];
const zoomLevel = 4;
const minZoomLevel = 3;
const maxZoomLevel = 16;
var app;

@inject('store') @observer
class StationPicker extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      //this.forceUpdate();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

        return (
            <div className="StationPicker">
                    <StationPickerSelect names={app.getLocations} />
                    <Map
                        center={mapCenter}
                        bounds={maxBounds}
                        zoom={zoomLevel}
                        minZoom={minZoomLevel}
                        maxZoom={maxZoomLevel}
                        attributionControl={true}
                        className={mapContainer}
                        style={{
                            height:this.state.height-160,
                            width:this.state.width-80,
                        }}
                    >
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSON
                            data={app.getStationGeojson}
                            style={app.stationFeatureStyle}
                            pointToLayer={(feature,latlng) => {return L.circleMarker(latlng)}}
                            onEachFeature={app.stationOnEachFeature}
                        />
                    </Map>
                    <div className="map-legend">
                        <span className={"color-box blue"}></span><span className="map-legend-label">Traditional SCAN</span>
                        <span className={"color-box green"}></span><span className="map-legend-label">Tribal SCAN</span>
                    </div>

            </div>
        );
    }
}

export default StationPicker;
