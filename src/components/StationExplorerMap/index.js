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

// Styles
//import '../../styles/StationExplorerMap.css';

import StationExplorerLegend from '../../components/StationExplorerLegend';

const mapContainer = 'map-container';
//const maxBounds = [
//    [24.9493, -125.0011],
//    [49.5904, -66.9326]
//];
const maxBounds = [
    [22.50, -172.50],
    [71.50, -66.9326]
];
//const mapCenter = [37.0, -95.7];
const mapCenter = [53.04, -113.00];
const zoomLevel = 3;
const minZoomLevel = 3;
const maxZoomLevel = 16;
var app;

@inject('store') @observer
class StationExplorerMap extends Component {

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
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

        return (
            <div className="StationExplorerMap">
                    <Map
                        center={mapCenter}
                        bounds={maxBounds}
                        zoom={zoomLevel}
                        minZoom={minZoomLevel}
                        maxZoom={maxZoomLevel}
                        attributionControl={true}
                        className={mapContainer}
                        style={{
                            height:(this.state.height>500) ? '460px' : '300px',
                            width:(this.state.width>=960) ? this.state.width*0.54 : this.state.width*0.86,
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
                            onEachFeature={app.stationOnEachFeature_explorer}
                        />
                        <StationExplorerLegend/>
                    </Map>
            </div>
        );
    }
}

export default StationExplorerMap;
