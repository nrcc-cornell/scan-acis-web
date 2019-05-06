///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';

// Styles
//import '../../styles/StationExplorerMap.css';

import StationExplorerLegend from '../../components/StationExplorerLegend';

const mapContainer = 'map-container';
var app;

@inject('store') @observer
class StationAboutMap extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        // CONUS, AK, HI and PR/VI
        const maxBounds = [
            [10.50, -172.50],
            [67, -66.9326]
        ];
        this.mapCenter = [47.05818, -109.95082];
        this.zoomLevel = 2;
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      this.map = this.mapInstance.leafletElement;
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

        return (
            <div className="StationAboutMap">
                    <Map
                        ref={e => { this.mapInstance = e }}
                        dragging={false}
                        touchZoom={false}
                        boxZoom={false}
                        doubleClickZoom={false}
                        scrollWheelZoom={false}
                        keyboard={false}
                        center={this.mapCenter}
                        bounds={this.maxBounds}
                        zoomControl={false}
                        zoom={this.zoomLevel}
                        attributionControl={false}
                        className={mapContainer}
                        style={{
                            height: '300px',
                            width:(this.state.width>=960) ? this.state.width*0.45 : this.state.width*0.86,
                        }}
                    >
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSON
                            data={app.getStationGeojson}
                            style={app.about_stationFeatureStyle}
                            pointToLayer={(feature,latlng) => {return L.circleMarker(latlng)}}
                        />
                        <StationExplorerLegend/>
                    </Map>
            </div>
        );
    }
}

export default StationAboutMap;
