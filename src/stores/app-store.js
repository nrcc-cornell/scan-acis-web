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
            let title, tagline, thumbnail, onclick
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
                title = 'Weather Grapher'
                tagline = 'Tagline for WxGraphTool'
                thumbnail = pathToImages+'GddTool-thumbnail.png'
            } else if (name==='livestock') {
                title = 'Livestock Heat Index'
                tagline = 'Tagline for LivestockHeatIdx'
                thumbnail = pathToImages+'GddTool-thumbnail.png'
            } else {
            }
            onclick = () => {this.setActivePage(3); this.setToolName(name)}
            return {'name':name, 'title':title, 'tagline':tagline, 'thumbnail':thumbnail, 'onclick':onclick}
        };

    @observable outputType = 'chart';
    @action setOutputType = (changeEvent) => {
        console.log('Changing output type to ', changeEvent.target.value)
        this.outputType = changeEvent.target.value
    }
    // set outputType from select menu
    @action setSelectedOutputType = (t) => {
            if (this.getOutputType !== t) {
                this.outputType = t.value;
            }
        };
    @computed get getOutputType() { return this.outputType };

    // data is loading - boolean - to control disabling of outputType
    // - return combined loading status for data in all tools
    //@computed get dataIsLoading() {
    //    return this.gddtool_getDataIsLoading;
    //}



    //////////////////////////////////////////////
    /// StationPicker
    //////////////////////////////////////////////
    // get currently selected location object (for station picker)
    @observable location = {"uid":29861,"state":"NY","ll":[-76.1038,43.1111],"name":"SYRACUSE HANCOCK INTL AP", "sid":"KSYR", "network":1};
    @action setLocation = (l) => {
        if (this.getLocation.uid.toString() !== l.toString()) {
            this.location = this.getLocations.find(obj => obj.uid === l);
            if (this.getToolName==='gddtool') { this.gddtool_downloadData() }
            if (this.getToolName==='wxgrapher') { this.wxgraph_downloadData() }
        };
    }
    // set location from select menu
    @action setSelectedLocation = (t) => {
            if (this.getLocation.uid.toString() !== t.value) {
                this.location = this.getLocations.find(obj => obj.uid.toString() === t.value);
                if (this.getToolName==='gddtool') { this.gddtool_downloadData() }
                if (this.getToolName==='wxgrapher') { this.wxgraph_downloadData() }
            }
            if (this.getShowModalMap) { this.setShowModalMap(false) };
        };
    @computed get getLocation() { return this.location };

    // get currently selected location object (for station explorer)
    @observable location_explorer = {"uid":29861,"state":"NY","ll":[-76.1038,43.1111],"name":"SYRACUSE HANCOCK INTL AP", "sid":"KSYR", "network":1};
    @action setLocation_explorer = (l) => {
        this.location_explorer = this.getLocations.find(obj => obj.uid === l);
    }
    // set location from select menu
    @action setSelectedLocation_explorer = (t) => {
            if (this.getLocation_explorer.uid.toString() !== t.value) {
                this.location_explorer = this.getLocations.find(obj => obj.uid.toString() === t.value);
            }
        };
    @computed get getLocation_explorer() { return this.location_explorer };

    // all locations
    @observable locations = []
    @action setLocations = (l) => {
        this.locations = l
    }
    @computed get getLocations() { return this.locations };

    @action stationOnEachFeature = (feature, layer) => {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
        layer.on({
            click: () => {
                this.setLocation(feature.id);
                if (this.getShowModalMap) { this.setShowModalMap(false) };
            },
            mouseover: () => {
                layer.openPopup();
            },
            mouseout: () => {
                layer.closePopup();
            },
        });
    }
    @action stationOnEachFeature_explorer = (feature, layer) => {
        //if (feature.properties && feature.properties.name) {
        //    layer.bindPopup(feature.properties.name);
        //}
        layer.on({
            mouseover: () => {
                // set to feature currently moused over
                this.setLocation_explorer(feature.id);
                //layer.openPopup();
            },
            mouseout: () => {
                // reset to previous tool location selection
                //this.setLocation_explorer(this.getLocation);
                //layer.closePopup();
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

    // show the location picker modal map
    @observable showModalMap=false;
    @action setShowModalMap = (b) => {
            this.showModalMap=b
            //if (!this.getShowModalMap) {
            //    if (this.getToolName==='gddtool') { this.gddtool_downloadData() }
            //    if (this.getToolName==='wxgrapher') { this.wxgraph_downloadData() }
            //}
        }
    @computed get getShowModalMap() {
        return this.showModalMap
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
        //let thisYear = moment().year();
        let thisYear = 2018;
        return thisYear
    };

    @observable planting_date = moment('05/15/'+this.latestSelectableYear,'MM-DD-YYYY');
    @action setPlantingDate = (v) => {
      this.planting_date = v
      //this.gddtool_setChartData()
      //this.gddtool_setClimateSummary()
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
                            })
                    } else {
                        chart_data.push({
                            'date': data[i][0],
                            'obs': NaN,
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
    // - the full request downloaded from ACIS
    @observable gddtool_climateData = null;
    @action gddtool_setClimateData = (res) => {
        this.gddtool_climateData = res
    }
    @computed get gddtool_getClimateData() {
        return this.gddtool_climateData
    }

    // climate summary saved in this var
    // - values for all summaries include data from planting date to end of year
    // - summaries include:
    //     1) season-to-date values (obs)
    //     2) POR average values (ave)
    //     3) 15-year average values (recent)
    //     4) max observed for POR (max_por)
    //     5) min observed for POR (min_por)
    //@observable gddtool_climateSummary = null;
    @observable gddtool_climateSummary = [{
                'date': moment().format('YYYY-MM-DD'),
                'obs': NaN,
                'ave': NaN,
                'recent': NaN,
                'max_por': NaN,
                'min_por': NaN,
                'max_minus_min': NaN,
                }];
    @action gddtool_setClimateSummary = () => {
        let average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        let year_planting = this.getPlantingYear
        //let doy_planting = this.getPlantingDate.dayOfYear()
        let data = this.gddtool_getClimateData
        let idxPlantingDate
        let data_by_date = {}
        let time_obj
        let isLeapYear = moment([year_planting]).isLeapYear()
        for (var i = 0, len = data.length; i < len; i++) {
            time_obj = moment(data[i][0],'YYYY-MM-DD')
            let year = time_obj.format('YYYY')
            let month = time_obj.format('MM')
            let day = time_obj.format('DD')
            let month_day = month+'-'+day
            if (month_day===this.getPlantingDate.format('MM')+'-'+this.getPlantingDate.format('DD')) { idxPlantingDate = i };
            if (month_day>=this.getPlantingDate.format('MM')+'-'+this.getPlantingDate.format('DD')) {
                if (!data_by_date.hasOwnProperty(month_day)) { data_by_date[month_day] = {} };
                if ((data[i][1] !== -999) && (data[idxPlantingDate][1] !== -999)) {
                    data_by_date[month_day][year] = data[i][1] - data[idxPlantingDate][1];
                } else {
                    data_by_date[month_day][year] = NaN
                }
             };
        };

        // get a sorted array of keys
        let datesArray = Object.keys(data_by_date)
        datesArray.sort()

        // loop dates: from planting date to end of year
        let obs
        let ave
        let recent
        let max_por=[]
        let min_por=[]
        let max_minus_min=[]
        let summary_data = []
        //console.log(datesArray)
        datesArray.forEach(function (d) {
            // skip 2/29 if its not a leap year
            if (d==='02-29' && !isLeapYear) { return }

            // get array of all years observing this date
            let yearsArray = Object.keys(data_by_date[d])

            // get obs array: for this planting year
            if (data_by_date[d].hasOwnProperty(year_planting)) {
                obs = data_by_date[d][year_planting];
            } else {
                obs = NaN;
            }

            // get ave array: POR ave
            let ave_data = []
            yearsArray.forEach(function (y) {
                if (y!=='2018') {
                    if (data_by_date[d][y]) { ave_data.push(data_by_date[d][y]) }
                }
            });
            ave = average(ave_data);

            // get recent array: 15-year ave
            let recent_data = []
            yearsArray.forEach(function (y) {
                if (y<='2017' && y>='2003') {
                    recent_data.push(data_by_date[d][y])
                }
            });
            recent = average(recent_data);

            // all year values (except current year) for this date
            //let valArray = Object.values(data_by_date[d])
            let valArray = []
            yearsArray.forEach(function (y) {
                if (y!=='2018') {
                    if (data_by_date[d][y]) { valArray.push(data_by_date[d][y]) }
                }
            });
            // get max_por array: max value in POR
            max_por = Math.max(...valArray);
            // get min_por array: min value in POR
            min_por = Math.min(...valArray);
            // max minus min for this date
            max_minus_min = max_por - min_por

            // data summary
            summary_data.push({
                'date': year_planting + '-' + d,
                'obs': parseInt(obs,10),
                'ave': parseInt(ave,10),
                'recent': parseInt(recent,10),
                'max_por': parseInt(max_por,10),
                'min_por': parseInt(min_por,10),
                'max_minus_min': parseInt(max_minus_min,10),
                })
        });

        // make sure summary statistics are properly managed for Feb 29
        // - since we are working with accumulated GDD:
        //     1) POR min on Feb 28 will always be lower than POR min on Feb 29
        //     2) POR max on Mar 1 will always be higher than POR max on Feb 29
        // - so it is valid to average values of Feb 28 and Mar 1 to get an estimated value for Feb 29
        // - we will do the same for 15- and POR averages
        if (isLeapYear) {
            summary_data.forEach(function (value,index) {
                if (value.date===year_planting+'-02-29' && index!==0) {
                    summary_data[index].ave = parseInt( (summary_data[index-1].ave + summary_data[index+1].ave)/2. , 10)
                    summary_data[index].recent = parseInt( (summary_data[index-1].recent + summary_data[index+1].recent)/2. , 10)
                    summary_data[index].max_por = parseInt( (summary_data[index-1].max_por + summary_data[index+1].max_por)/2. , 10)
                    summary_data[index].min_por = parseInt( (summary_data[index-1].min_por + summary_data[index+1].min_por)/2. , 10)
                    summary_data[index].max_minus_min = parseInt( (summary_data[index-1].max_minus_min + summary_data[index+1].max_minus_min)/2. , 10)
                    return;
                }
            });
        }

        this.gddtool_climateSummary = summary_data
    }
    @computed get gddtool_getClimateSummary() {
        return this.gddtool_climateSummary
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
          //.post(`${protocol}//grid2.rcc-acis.org/GridData`, this.getAcisParams)
          .post(`${protocol}//data.rcc-acis.org/StnData`, this.getAcisParams)
          .then(res => {
            console.log('SUCCESS downloading from ACIS');
            console.log(res);
            this.gddtool_setClimateData(res.data.data.slice(0));
            //this.gddtool_setChartData()
            this.gddtool_setClimateSummary()
            this.gddtool_setDataIsLoading(false);
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    //////////////////////////////////////////////
    /// TOOL: Weather Grapher
    //////////////////////////////////////////////
    // for component: ExtremeSwitch
    @observable wxgraph_extSwitch=false;
    @action wxgraph_setExtSwitch = event => {
            this.wxgraph_extSwitch = event.target.checked
        }
    @action wxgraph_setExtSwitchManual = (b) => {
            this.wxgraph_extSwitch = b
        }
    @computed get wxgraph_getExtSwitch() {
        return this.wxgraph_extSwitch
    }

    // for component: VarPicker
    @observable wxgraph_vars={
            airtemp : true,
            rainfall : true,
            soiltemp : true,
            soilmoist : false,
            humidity : false,
            solarrad : false,
            wind : false,
            leafwet : false,
        };
    @action wxgraph_setVars = name => event => {
            this.wxgraph_vars[name] = event.target.checked
        }
    @computed get wxgraph_getVars() {
        return this.wxgraph_vars
    }
    @computed get wxgraph_getVarLabels() {
        if (this.wxgraph_extSwitch) {
          return {
            airtemp_label : 'TBD',
            rainfall_label : 'TBD',
            soiltemp_label : 'TBD',
            soilmoist_label : 'TBD',
            humidity_label : 'TBD',
            solarrad_label : 'TBD',
            wind_label : 'TBD',
            leafwet_label : 'TBD',
          };
        } else {
          return {
            airtemp_label : 'Air Temperature',
            rainfall_label : 'Rainfall',
            soiltemp_label : 'Soil Temperature',
            soilmoist_label : 'Soil Moisture',
            humidity_label : 'Humidity',
            solarrad_label : 'Solar Radiation',
            wind_label : 'Wind',
            leafwet_label : 'Leaf Wetness',
          };
        }
    }
    @computed get wxgraph_getVarUnits() {
        let varUnits = {}
        if (this.wxgraph_extSwitch) {
          varUnits = {
            airtemp_units : 'days',
            rainfall_units : 'days',
            soiltemp_units : 'days',
            soilmoist_units : 'days',
            humidity_units : 'days',
            solarrad_units : 'days',
            wind_units : 'days',
            leafwet_units : 'days',
          };
        } else {
          varUnits = {
            airtemp_units : '°F',
            rainfall_units : 'inches',
            soiltemp_units : '°F',
            soilmoist_units : '%',
            humidity_units : '%',
            solarrad_units : 'W/m2',
            wind_units : 'mph',
            leafwet_units : 'units',
          };
        };
        return varUnits
    }

    // climate data saved in this var
    // - the full request downloaded from ACIS
    @observable wxgraph_climateData = null;
    @action wxgraph_setClimateData = (res) => {
        this.wxgraph_climateData = res
    }
    @computed get wxgraph_getClimateData() {
        return this.wxgraph_climateData
    }

    // summary for weather grapher daily data saved here
    // - data includes:
    //     date : date of observation
    //     avgt : average temperature for day (F)
    //     pcpn : accumulated precipitation for day (in)
    //     soilt : average temperature for day (F)
    //     soilm : average soil moisture for day (%)
    //     humid : average humidity for day (%)
    //     solar : total solar radiation for day (W/m2)
    //     wind : average wind speed for day (mph)
    //     leafwet : average leaf wetness for day (units)
    @observable wxgraph_climateSummary = [{
                'date': moment().format('YYYY-MM-DD'),
                'avgt': NaN,
                'pcpn': NaN,
                'soilt': NaN,
                'soilm': NaN,
                'humid': NaN,
                'solar': NaN,
                'wind': NaN,
                'leafwet': NaN,
                }];
    @action wxgraph_setClimateSummary = () => {
        let data = this.wxgraph_getClimateData
        let dataObjArray = []
        data.forEach(function (d) {
            dataObjArray.push({
                'date':d[0],
                'avgt':(d[1]==='M') ? NaN : parseFloat(d[1]),
                'pcpn':(d[2]==='M') ? NaN : ((d[2]==='T') ? 0.00 : parseFloat(d[2])),
                'soilt':NaN,
                'soilm':NaN,
                'humid':NaN,
                'solar':NaN,
                'wind':NaN,
                'leafwet':NaN,
            })
        });

        this.wxgraph_climateSummary = dataObjArray
    }
    @computed get wxgraph_getClimateSummary() {
        return this.wxgraph_climateSummary
    }

    // time frame to view data
    // - options are 'por', 'two_years', 'two_months', 'two_days'
    @observable wxgraph_timeFrame = 'two_months'
    @action wxgraph_setTimeFrame = (t) => {
        // has the time frame changed?
        let changed = (this.wxgraph_getTimeFrame===t) ? false : true
        // make sure ext switch is off if new time period is not POR
        if (t!=='por' && this.wxgraph_getExtSwitch) { this.wxgraph_setExtSwitchManual(false) }
        // only update and download data if time frame has changed
        if (changed===true) {
            this.wxgraph_timeFrame = t;
            this.wxgraph_downloadData()
        }
    }
    @action wxgraph_setTimeFrameFromRadioGroup = (e) => {
        let t = e.target.value;
        // has the time frame changed?
        let changed = (this.wxgraph_getTimeFrame===t) ? false : true
        // make sure ext switch is off if new time period is not POR
        if (t!=='por' && this.wxgraph_getExtSwitch) { this.wxgraph_setExtSwitchManual(false) }
        // only update and download data if time frame has changed
        if (changed===true) {
            this.wxgraph_timeFrame = t;
            this.wxgraph_downloadData()
        }
    }
    @computed get wxgraph_getTimeFrame() {
        return this.wxgraph_timeFrame;
    }


    // Wx Grapher tool data download - set parameters
    @computed get wxgraph_getAcisParams() {
            let elems
            let numdays
            if (this.wxgraph_getTimeFrame==='two_months') {
                elems = [
                    {"name":"avgt","interval":[0,0,1],"duration":"dly"},
                    {"name":"pcpn","interval":[0,0,1],"duration":"dly"},
                ]
                numdays=-60
            } else if (this.wxgraph_getTimeFrame==='two_years') {
                elems = [
                    {"name":"avgt","interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3},
                    {"name":"pcpn","interval":[0,1],"duration":"mly","reduce":{"reduce":"sum"},"maxmissing":3},
                ]
                numdays=-730
            } else if (this.wxgraph_getTimeFrame==='por') {
                elems = [
                    {"name":"avgt","interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10},
                    {"name":"pcpn","interval":[1],"duration":"yly","reduce":{"reduce":"sum"},"maxmissing":10},
                ]
            }

            if (this.wxgraph_getTimeFrame==='por') {
                return {
                        "sid":this.getLocation.uid.toString(),
                        "sdate":"por",
                        "edate":"por",
                        "elems":elems
                    }
            } else {
                return {
                        "sid":this.getLocation.uid.toString(),
                        "sdate":moment().add(numdays,'days').format("YYYY-MM-DD"),
                        "edate":moment().format("YYYY-MM-DD"),
                        "elems":elems
                    }
            }
        }

    // data is loading - boolean - to control the spinner
    @observable wxgraph_dataIsLoading = false
    @action wxgraph_setDataIsLoading = (b) => {
        this.wxgraph_dataIsLoading = b;
    }
    @computed get wxgraph_getDataIsLoading() {
        return this.wxgraph_dataIsLoading;
    }

    // GDD tool data download - download data using parameters
    @action wxgraph_downloadData = () => {
        console.log("Call wxgraph_downloadData")
        this.wxgraph_setDataIsLoading(true);
        return axios
          .post(`${protocol}//data.rcc-acis.org/StnData`, this.wxgraph_getAcisParams)
          .then(res => {
            console.log('SUCCESS downloading from ACIS');
            console.log(res);
            this.wxgraph_setClimateData(res.data.data.slice(0));
            this.wxgraph_setClimateSummary()
            this.wxgraph_setDataIsLoading(false);
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

