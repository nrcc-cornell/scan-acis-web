///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
//import Control from 'react-leaflet-control';
//import { Map, GeoJSON, LayersControl, TileLayer } from 'react-leaflet';
//import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import { Map, GeoJSON, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
//import LegendControl from '../LegendControl';

// Styles
//import '../../styles/StationExplorerMap.css';

import StationExplorerLegend from '../../components/StationExplorerLegend';
import StationExplorerButtonFlyTo from '../../components/StationExplorerButtonFlyTo';

// start: added code to work with markers
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
// end: added code to work with markers

const mapContainer = 'map-container';
const zoomLevel = 4;
const minZoomLevel = 4;
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
        this.onClickCONUS = this.onClickCONUS.bind(this)
        this.onClickAlaska = this.onClickAlaska.bind(this)
        this.onClickHawaii = this.onClickHawaii.bind(this)
        this.onClickPR = this.onClickPR.bind(this)
        // CONUS
        this.maxBounds = [
            [24.9493, -125.0011],
            [49.5904, -66.9326]
        ];
        this.mapCenter = [38.0, -95.7];
        this.zoomLevel = 4;
        this.minZoomLevel = 3;
        this.maxZoomLevel = 16;
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      //if (this.mapInstance) {this.map = this.mapInstance.leafletElement}
      this.map = this.mapInstance.leafletElement
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    onClickCONUS() {
        this.map.flyTo([38.0, -95.7], 4)
    }

    onClickAlaska() {
        this.map.flyTo([64.20, -149.50], 4)
    }

    onClickHawaii() {
        this.map.flyTo([19.90, -155.60], 6)
    }

    onClickPR() {
        this.map.flyTo([18.25, -66.0], 6)
    }

    render() {

        let markerLat = (app.getLocation_explorer) ? app.getLocation_explorer.ll[1] : 0.0
        let markerLon = (app.getLocation_explorer) ? app.getLocation_explorer.ll[0] : 0.0

        return (
            <div className="StationExplorerMap">
                    <Map
                        ref={e => { this.mapInstance = e }}
                        center={[markerLat,markerLon]}
                        bounds={this.maxBounds}
                        zoomControl={false}
                        zoom={this.zoomLevel}
                        minZoom={this.minZoomLevel}
                        maxZoom={this.maxZoomLevel}
                        attributionControl={false}
                        className={mapContainer}
                        style={{
                            height:(app.getActivePage==='home') ? ((this.state.height>500) ? '460px' : '300px') : this.state.height*0.80,
                            width:(app.getActivePage==='home') ? ((this.state.width>=960) ? this.state.width*0.54 : this.state.width*0.86) : this.state.width*0.90,
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
                        <Marker key={'marker-select'} position={[markerLat,markerLon]} />
                        <StationExplorerButtonFlyTo pos="bottomleft" loc="Hawaii" onclick={this.onClickHawaii} />
                        <StationExplorerButtonFlyTo pos="bottomleft" loc="Alaska" onclick={this.onClickAlaska} />
                        <StationExplorerButtonFlyTo pos="bottomright" loc="PR & VI" onclick={this.onClickPR} />
                        <StationExplorerButtonFlyTo pos="bottomright" loc="CONUS" onclick={this.onClickCONUS} />
                        <ZoomControl position="topleft" />
                        <StationExplorerLegend/>
                    </Map>
            </div>
        );

    }
}

export default StationExplorerMap;
