///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import { observable, computed, action } from 'mobx';
import axios from 'axios';
import moment from 'moment';

const protocol = window.location.protocol;

export class AppStore {
    ///////////////////////////////////////////////////////
    /// Pages on the site
    /// which page is active?
    /// possibilities are 'home','about','stem','tool'
    ///////////////////////////////////////////////////////
    @observable activePage = 'home';
    @action setActivePage = (i) => {
        if (i===0) {
            this.activePage = 'home'
        } else if (i===1) {
            this.activePage = 'about'
        } else if (i===2) {
            this.activePage = 'stem'
        } else {
            this.activePage = 'tool'
        }
    };
    @computed get getActivePage() { return this.activePage };
    @computed get getActiveTabIndex() {
        let tabIndex = null;
        if (this.getActivePage==='home') {
            tabIndex = 0;
        } else if (this.getActivePage==='about') {
            tabIndex = 1;
        } else if (this.getActivePage==='stem') {
            tabIndex = 2;
        } else if (this.getActivePage==='tool') {
            tabIndex = 3;
        } else {
        }
        return tabIndex
    };
    @computed get homeIsSelected() { return this.getActivePage==='home' };
    @computed get aboutIsSelected() { return this.getActivePage==='about' };
    @computed get stemIsSelected() { return this.getActivePage==='stem' };
    @computed get toolIsSelected() { return this.getActivePage==='tool' };

    //////////////////////////////////////////////
    /// General Tool Management
    /// - toolName (e.g. gddtool)
    /// - getToolInfo, an object containing these keys:
    /// -     title (e.g. Growing Degree Day Calculator)
    /// -     tagline (one sentence description of tool)
    /// -     thumbnail (thumbnail image for tool card)
    //////////////////////////////////////////////
    toolNameArray = ['gddtool','waterdef','wxgrapher','livestock']
    @observable toolName = this.toolNameArray[0]
    // set toolName from tool card
    @action setToolName = (n) => {
            this.toolName = n
        };
    // set toolName from select menu
    @action setSelectedToolName = (t) => {
            if (this.getToolName !== t) {
                this.toolName = t.value;
            }
        };
    @computed get getToolName() { return this.toolName };

    getToolInfo = (name) => {
            let title, tagline, thumbnail
            let pathToImages = './thumbnails/'
            if (name==='gddtool') {
                title = 'Growing Degree Day Calculator'
                tagline = 'Tagline for GddTool'
                thumbnail = pathToImages+'GddTool-thumbnail.png'
            } else if (name==='waterdef') {
                title = 'Water Deficit Calculator'
                tagline = 'Tagline for WaterDefCalc'
                thumbnail = pathToImages+'GddTool-thumbnail.png'
            } else if (name==='wxgrapher') {
                title = 'Weather Extremes Grapher'
                tagline = 'Tagline for WxGraphTool'
                thumbnail = pathToImages+'GddTool-thumbnail.png'
            } else if (name==='livestock') {
                title = 'Livestock Heat Index'
                tagline = 'Tagline for LivestockHeatIdx'
                thumbnail = pathToImages+'GddTool-thumbnail.png'
            } else {
            }
            return {'name':name, 'title':title, 'tagline':tagline, 'thumbnail':thumbnail}
        };


    //////////////////////////////////////////////
    /// StationPicker
    //////////////////////////////////////////////
    // get currently selected location object
    @observable location = {"uid":29584,"state":"NE","ll":[-95.8991,41.3102],"name":"OMAHA EPPLEY AIRFIELD", "sid":"KOMA", "network":1};
    @action setLocation = (l) => {
        this.location = this.getLocations.find(obj => obj.uid === l);
    }
    @computed get getLocation() { return this.location };

    // all locations
    @observable locations = []
    @action setLocations = (l) => {
        this.locations = l
    }
    @computed get getLocations() { return this.locations };

    @action stationOnEachFeature = (feature, layer) => {
        layer.on({
            click: () => {
                this.setLocation(feature.id)
            },
        });
    }

    stationFeatureStyle = (feature) => {
        return {
            radius: 3,
            weight: 1,
            opacity: 1.0,
            color: (feature.properties.network===1) ? 'blue' : 'green',
            fillColor: (feature.properties.network===1) ? 'blue' : 'green',
            fillOpacity: 1.0
        };
    }

    @computed get getStationGeojson() {
        let stn_geojson = {}
        let locsList = this.getLocations
        let featuresList = []
        locsList.forEach(function (loc, index) {
            loc = {
                "geometry": {
                    "type": "Point",
                    "coordinates": loc.ll
                },
                "type": "Feature",
                "id": loc.uid,
                "properties": {
                    "name": loc.name,
                    "state": loc.state,
                    "network": loc.network
                }
            }
            featuresList.push(loc)
        });

        // construct geojson
        stn_geojson["type"] = "FeatureCollection"
        stn_geojson["features"] = featuresList
        return stn_geojson
    }

    // download list of station info
    @action downloadStationInfo = () => {
        // just some filler stations until SCAN becomes available in ACIS
        //kden,kabq,kslc,ksdf,koma,ksyr,kbil,kiah,kric,krno,ksea,kbis,kmke,katl,kokc,klax
        let locs = [{"uid":137,"state":"CO","ll":[-104.6575,39.8328],"name":"DENVER INTL AP", "sid":"KDEN", "network":1},
            {"uid":13502,"state":"ND","ll":[-100.7572,46.7825],"name":"BISMARCK MUNICIPAL AP", "sid":"KBIS", "network":2},
            {"uid":34732,"state":"NV","ll":[-119.77112,39.48389],"name":"RENO TAHOE INTL AP", "sid":"KRNO", "network":1},
            {"uid":25550,"state":"VA","ll":[-77.4473,38.9349],"name":"WASHINGTON DULLES INTL AP", "sid":"KIAD", "network":1},
            {"uid":22975,"state":"TX","ll":[-98.4839,29.5443],"name":"SAN ANTONIO INTL AP", "sid":"KSAT", "network":2},
            {"uid":11775,"state":"MT","ll":[-108.5422,45.8069],"name":"BILLINGS INTERNATIONAL AIRPORT", "sid":"KBIL", "network":1},
            {"uid":19376,"state":"NM","ll":[-106.6155,35.0419],"name":"ALBUQUERQUE INTL AP", "sid":"KABQ", "network":1},
            {"uid":29584,"state":"NE","ll":[-95.8991,41.3102],"name":"OMAHA EPPLEY AIRFIELD", "sid":"KOMA", "network":1},
            {"uid":31802,"state":"KY","ll":[-85.7391,38.1811],"name":"LOUISVILLE INTL AP", "sid":"KSDF", "network":1},
            {"uid":24790,"state":"UT","ll":[-111.9694,40.7781],"name":"SALT LAKE CITY INTL ARPT", "sid":"KSLC", "network":1},
            {"uid":29861,"state":"NY","ll":[-76.1038,43.1111],"name":"SYRACUSE HANCOCK INTL AP", "sid":"KSYR", "network":1},
            {"uid":25978,"state":"WA","ll":[-122.3138,47.4444],"name":"SEATTLE TACOMA INTL AP", "sid":"KSEA", "network":1},
            {"uid":29852,"state":"WI","ll":[-87.9044,42.955],"name":"MILWAUKEE MITCHELL INTL AP", "sid":"KMKE", "network":1},
            {"uid":5061,"state":"GA","ll":[-84.4418,33.6301],"name":"ATLANTA HARTSFIELD INTL AP", "sid":"KATL", "network":2},
            {"uid":92,"state":"OK","ll":[-97.6006,35.3889],"name":"OKLAHOMA CITY WILL ROGERS WORLD AP", "sid":"KOKC", "network":1},
            {"uid":1978,"state":"CA","ll":[-118.3888,33.938],"name":"LOS ANGELES INTL AP", "sid":"KLAX", "network":1}]
        this.setLocations(locs)
    }

    //////////////////////////////////////////////
    /// TOOL: GDD Calculator
    //////////////////////////////////////////////
    // Gdd base selection
    // For Components: GddBaseSelect
    @observable gddtool_base='50';
    @action gddtool_setBase = (v) => {
            this.gddtool_base = v.value
            this.gddtool_downloadData()
        }
    @computed get gddtool_getBase() {
        return this.gddtool_base
    }

    @observable gddtool_isMethod8650=false;
    @action gddtool_setIsMethod8650 = () => {
        this.gddtool_isMethod8650 = !this.gddtool_isMethod8650
        this.gddtool_downloadData()
    }
    @computed get gddtool_getIsMethod8650() {
        return this.gddtool_isMethod8650
    }

    // Planting date selection
    // For Components: PlantingDatePicker
    @computed get latestSelectableYear() {
        let thisYear = moment().year();
        return thisYear
    };

    @observable planting_date = moment('05/15/'+this.latestSelectableYear,'MM-DD-YYYY');
    @action setPlantingDate = (v) => {
      this.planting_date = v
      this.gddtool_setChartData()
    };
    @computed get getPlantingDate() {
      return this.planting_date
    };
    @computed get getPlantingYear() {
      //return this.planting_year
      return this.getPlantingDate.format('YYYY')
    };


    // chart data saved in variable
    @observable gddtool_chartData = null;
    @action gddtool_setChartData = () => {
            if (this.gddtool_getChartData) { this.gddtool_chartData = null }
            let year = this.getPlantingYear
            let chart_data = []
            let data = this.gddtool_getClimateData
            let idxPlantingDate
            let doy = this.getPlantingDate.dayOfYear()
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i][0].includes(year) && moment(data[i][0],'YYYY-MM-DD').dayOfYear()===doy) { idxPlantingDate = i };
                if (data[i][0].includes(year) && moment(data[i][0],'YYYY-MM-DD').dayOfYear()>=doy) {
                    if (data[i][1] !== -999) {
                        chart_data.push({
                            'date': data[i][0],
                            'obs': parseInt(data[i][1],10) - data[idxPlantingDate][1],
                            //'normal': parseInt(data[i][2]) - data[idxPlantingDate][2]
                            })
                    } else {
                        chart_data.push({
                            'date': data[i][0],
                            'obs': NaN,
                            //'normal': parseInt(data[i][2]) - data[idxPlantingDate][2]
                        })
                    }
                }
            }
            this.gddtool_chartData = chart_data
        }
    @computed get gddtool_getChartData() {
            return this.gddtool_chartData
        }

    // climate data saved in this var
    @observable gddtool_climateData = null;
    @action gddtool_setClimateData = (res) => {
        this.gddtool_climateData = res
    }
    @computed get gddtool_getClimateData() {
        return this.gddtool_climateData
    }

    // GDD tool data download - set parameters
    @computed get getAcisParams() {
            let elems = [{
                "name":"gdd"+this.gddtool_getBase,
                "interval":[0,0,1],
                "duration":"std",
                "season_start":[1,1],
                "reduce":"sum"
            }]
            if (this.gddtool_getBase==='50' && this.gddtool_getIsMethod8650) {
                elems[0]["limit"]=[50,86]
            };

            return {
                    "sid":this.getLocation.uid.toString(),
                    //"sdate":this.getPlantingYear+"-01-01",
                    //"edate":this.getPlantingYear+"-12-31",
                    "sdate":"1981-01-01",
                    "edate":moment().format("YYYY-MM-DD"),
                    "elems":elems
                }
        }

    // data is loading - boolean - to control the spinner
    @observable gddtool_dataIsLoading = false
    @action gddtool_setDataIsLoading = (b) => {
        this.gddtool_dataIsLoading = b;
    }
    @computed get gddtool_getDataIsLoading() {
        return this.gddtool_dataIsLoading;
    }

    // GDD tool data download - download data using parameters
    @action gddtool_downloadData = () => {
        console.log("Call gddtool_downloadData")
        this.gddtool_setDataIsLoading(true);
        return axios
          //.post("http://data.rcc-acis.org/StnData", this.getAcisParams)
          .post(`${protocol}//data.rcc-acis.org/StnData`, this.getAcisParams)
          .then(res => {
            console.log('SUCCESS downloading from ACIS');
            console.log(res);
            this.gddtool_setClimateData(res.data.data.slice(0));
            this.gddtool_setChartData()
            this.gddtool_setDataIsLoading(false);
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    // run these on initial load
    constructor() {
        this.downloadStationInfo()
    }

}

