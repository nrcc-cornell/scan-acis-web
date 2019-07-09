///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import { observable, computed, action } from 'mobx';
import axios from 'axios';
import moment from 'moment';

const protocol = window.location.protocol;

//utils
const arrSum = arr => arr.reduce((a,b) => a + b, 0)
const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
const getMtdStartLabel = (s) => { return moment(s,"YYYY-MM-DD").format("MMM")+' 1' }
const getStdStartLabel = (s) => {
        let month = moment(s,'YYYY-MM-DD').month() + 1
        let DJF = [12,1,2]
        let MAM = [3,4,5]
        let JJA = [6,7,8]
        let SON = [9,10,11]
        if (DJF.includes(month)) { return 'Dec 1' }
        if (MAM.includes(month)) { return 'Mar 1' }
        if (JJA.includes(month)) { return 'Jun 1' }
        if (SON.includes(month)) { return 'Sep 1' }
        return '';
    }
const getStdStartString = (s) => {
        let month = moment(s,'YYYY-MM-DD').month() + 1
        let DJF = [12,1,2]
        let MAM = [3,4,5]
        let JJA = [6,7,8]
        let SON = [9,10,11]
        if (DJF.includes(month)) { return '12-1' }
        if (MAM.includes(month)) { return '3-1' }
        if (JJA.includes(month)) { return '6-1' }
        if (SON.includes(month)) { return '9-1' }
        return '';
    }

//current date
const date_current = moment().format('YYYY-MM-DD')
//const date_current = "2019-03-15"

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
    /// -     description (one sentence description of tool)
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
            let title, description, thumbnail, url, onclick
            let pathToImages = './thumbnails/'
            if (name==='gddtool') {
                title = 'Growing Degree Day Calculator'
                description = 'Monitor heat accumulation throughout the growing season.'
                thumbnail = pathToImages+'GddTool-thumbnail.png'
                url = '/tools/growing-degree-day'
            } else if (name==='waterdef') {
                title = 'Water Deficit Calculator'
                description = 'Track changes in the available soil water content.'
                thumbnail = pathToImages+'WaterDeficitCalc-thumbnail.png'
                url = '/tools/water-deficit-calculator'
            } else if (name==='wxgrapher') {
                title = 'Weather Grapher'
                description = 'View data for multiple variables and timescales.'
                thumbnail = pathToImages+'WxGrapher-thumbnail.png'
                url = '/tools/weather-grapher'
            } else if (name==='livestock') {
                title = 'Livestock Heat Index'
                description = 'Assess dangerous conditions for livestock by the hour.'
                thumbnail = pathToImages+'Livestock-thumbnail.png'
                url = '/tools/livestock-heat-index'
            } else {
            }
            onclick = () => {this.setActivePage(3); this.setToolName(name)}
            return {'name':name, 'title':title, 'description':description, 'thumbnail':thumbnail, 'url':url, 'onclick':onclick}
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
    //@observable location = {"uid":29861,"state":"NY","ll":[-76.1038,43.1111],"name":"SYRACUSE HANCOCK INTL AP", "sid":"KSYR", "network":5};
    @observable location = null
    @action setLocation = (l) => {
        let uidString = (this.getLocation) ? this.getLocation.uid.toString() : ''
        if (uidString !== l.toString()) {
            this.location = (this.getLocations) ? this.getLocations.find(obj => obj.uid === l) : null
            if (this.getToolName==='gddtool' && this.toolIsSelected) { this.gddtool_downloadData() }
            if (this.getToolName==='wxgrapher' && this.toolIsSelected) { this.wxgraph_downloadData() }
            if (this.getToolName==='livestock' && this.toolIsSelected) { this.livestock_downloadData() }
        };
    }
    // set location from select menu
    @action setSelectedLocation = (t) => {
            if (this.getLocation.uid.toString() !== t.value) {
                this.location = this.getLocations.find(obj => obj.uid.toString() === t.value);
                if (this.getToolName==='gddtool' && this.toolIsSelected) { this.gddtool_downloadData() }
                if (this.getToolName==='wxgrapher' && this.toolIsSelected) { this.wxgraph_downloadData() }
                if (this.getToolName==='livestock' && this.toolIsSelected) { this.livestock_downloadData() }
            }
            if (this.getShowModalMap) { this.setShowModalMap(false) };
            // update location for front page explorer also
            if (this.getLocation_explorer.uid.toString() !== t.value) {
                this.setSelectedLocation_explorer(t);
            }
        };
    @computed get getLocation() { return this.location };

    // get currently selected location object (for station explorer)
    //@observable location_explorer = {"uid":29861,"state":"NY","ll":[-76.1038,43.1111],"name":"SYRACUSE HANCOCK INTL AP", "sid":"KSYR", "network":5};
    @observable location_explorer = null;
    @action setLocation_explorer = (l) => {
        this.location_explorer = this.getLocations.find(obj => obj.uid === l);
        // download data for table
        this.explorerClimateSummary_downloadData()
        this.explorer_downloadData()
    }
    // set location from select menu
    @action setSelectedLocation_explorer = (t) => {
            if (this.getLocation_explorer.uid.toString() !== t.value) {
                this.location_explorer = this.getLocations.find(obj => obj.uid.toString() === t.value);
            }
            // update location for tools also
            if (this.getLocation.uid.toString() !== t.value) {
                this.setSelectedLocation(t);
            }
            // download data for table
            this.explorerClimateSummary_downloadData()
            this.explorer_downloadData()
            // update data view for station explorer
            //this.setDataView_explorer('climate');
        };
    @computed get getLocation_explorer() { return this.location_explorer };

    // all locations
    //@observable locations = []
    @observable locations = null;
    @action setLocations = (l) => {
        if (this.getLocations) { this.locations.clear() };
        this.locations = l
        //this.locations.replace(l)
        //console.log('setting locations');
        //console.log(this.getLocations);
    }
    @computed get getLocations() { return this.locations };

    @action stationOnEachFeature = (feature, layer) => {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
        layer.on({
            click: () => {
                this.setLocation(feature.id);
                this.setLocation_explorer(feature.id);
                //this.setDataView_explorer('climate');
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
        //console.log(feature);
        let porStart,porEnd
        if (feature.properties && feature.properties.name) {
            porStart = feature.properties.sdate;
            porEnd = (feature.properties.edate && feature.properties.edate.slice(0,4)==='9999') ? 'present' : feature.properties.edate;
            layer.bindPopup(feature.properties.name+', '+feature.properties.state+'<br/>'+porStart+' to '+porEnd);
        }
        layer.on({
            preclick: () => {
                layer.closePopup();
            },
            click: () => {
                // set to feature currently moused over
                this.setLocation(feature.id);
                this.setLocation_explorer(feature.id);
                //this.setDataView_explorer('climate');
                layer.openPopup();
                //if in modal, close
                if (this.getShowModalMap) { this.setShowModalMap(false) };
            },
            mouseover: () => {
                // set to feature currently moused over
                //this.setLocation(feature.id);
                //this.setLocation_explorer(feature.id);
                //this.setDataView_explorer('climate');
                layer.openPopup();
            },
            mouseout: () => {
                // reset to previous tool location selection
                //this.setLocation_explorer(this.getLocation);
                layer.closePopup();
            },
        });
    }

    stationFeatureStyle = (feature) => {
        // SCAN network is 17
        // T-SCAN network is 19
        return {
            radius: 4,
            weight: 1,
            opacity: 1.0,
            color: 'white',
            fillColor: (feature.properties.network===17) ? 'blue' : 'red',
            fillOpacity: 1.0,
        };
    }

    about_stationFeatureStyle = (feature) => {
        // SCAN network is 17
        // T-SCAN network is 19
        return {
            radius: 2,
            weight: 1,
            opacity: 1.0,
            color: 'white',
            fillColor: (feature.properties.network===17) ? 'blue' : 'red',
            fillOpacity: 1.0,
            interactive: false,
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
                    "network": loc.network,
                    "sdate": loc.sdate,
                    "edate": loc.edate,
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
            //    if (this.getToolName==='livestock') { this.livestock_downloadData() }
            //}
        }
    @computed get getShowModalMap() {
        return this.showModalMap
    }

    // download list of station info
    @action downloadStationInfo = () => {
        fetch(process.env.PUBLIC_URL + "/data/scan_stations.json")
             .then(r => r.json())
             .then(data => {
               //console.log(locs);
               this.setLocations(data['locs']);
               //this.setLocation(data['locs'][30].uid);
               //this.setLocation_explorer(data['locs'][30].uid);
               // setting location to Centralia Lake, KS - center of the U.S.
               // 85677 is the UID of this site
               this.setLocation(85677);
               this.setLocation_explorer(85677);
               this.setDataView_explorer('weather');
               this.setDatesForLocations({'date':data['date'],'ytd_start':data['ytd_start'],'std_start':data['std_start'],'mtd_start':data['mtd_start']});
               if (this.getToolName==='gddtool') {this.gddtool_downloadData}
               if (this.getToolName==='wxgrapher') {this.wxgraph_downloadData}
               if (this.getToolName==='livestock') {this.livestock_downloadData}
             });
    }

    // show the location picker modal map
    @observable datesForLocations={};
    @action setDatesForLocations = (d) => {
            this.datesForLocations=d
        }
    @computed get getDatesForLocations() {
        return this.datesForLocations
    }

    // station explorer data view
    // 'climate': show climate summary
    // 'weather': show latest conditions
    @observable dataView_explorer = 'weather';
    @action setDataView_explorer = (d) => {
            this.dataView_explorer=d
        }
    @computed get getDataView_explorer() {
        return this.dataView_explorer
    }


    // action for changing map setting via buttons
    // - this will center and zoom map on Alaska, Hawaii or PR
    //@observable mapSettings = {'mapCenter':[37.0, -95.7], 'zoomLevel':4}
    //@action updateMapSettings = (loc) => {
    //    if (loc==='puerto_rico') {
    //        this.mapSettings = {'mapCenter':[18.25, -66.0], 'zoomLevel':6}
    //    } else if (loc==='alaska') {
    //        this.mapSettings = {'mapCenter':[64.20, -149.50], 'zoomLevel':4}
    //    } else if (loc==='hawaii') {
    //        this.mapSettings = {'mapCenter':[19.90, -155.60], 'zoomLevel':6}
    //    } else {
    //        this.mapSettings = {'mapCenter':[37.0, -95.7], 'zoomLevel':4}
    //    }
    //}
    //@action updateMapSettingsManually = (s) => {
    //    this.mapSettings = s; 
    //}
    //@computed get getMapSettings() {
    //    return this.mapSettings
    //}

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
        let thisYear = moment(date_current,'YYYY-MM-DD').year();
        //let thisYear = '2018';
        return thisYear
    };

    @observable planting_date = moment('01/01/'+this.latestSelectableYear,'MM-DD-YYYY');
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
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'obs': NaN,
                'ave': NaN,
                'recent': NaN,
                'max_por': NaN,
                'min_por': NaN,
                'max_minus_min': NaN,
                }];
    @action gddtool_initClimateSummary = () => {
        let dataObjArray = [{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'obs': NaN,
                'ave': NaN,
                'recent': NaN,
                'max_por': NaN,
                'min_por': NaN,
                'max_minus_min': NaN,
            }];
        this.gddtool_climateSummary = dataObjArray
    }
    @action gddtool_setClimateSummary = () => {
        let average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        let year_planting = this.getPlantingYear
        let this_year = this.latestSelectableYear
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
                //if ((data[i][1] !== -999) && (data[idxPlantingDate][1] !== -999)) {
                if ((data[i][1] !== -999) && (data[idxPlantingDate][1] !== -999) && (data[i][1] !== 'M') && (data[idxPlantingDate][1] !=='M')) {
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
                //if (y!=='2018') {
                //if (y!==this_year) {
                if (y!==this_year.toString()) {
                    if (data_by_date[d][y]) { ave_data.push(data_by_date[d][y]) }
                    //ave_data.push(data_by_date[d][y])
                }
            });
            ave = (ave_data.length<5) ? NaN : average(ave_data);

            // get recent array: 15-year ave
            let recent_data = []
            yearsArray.forEach(function (y) {
                //if (y<='2017' && y>='2003') {
                if (y<=(parseInt(this_year,10)-1).toString() && y>=(parseInt(this_year,10)-15).toString()) {
                    if (data_by_date[d][y]) { recent_data.push(data_by_date[d][y]) }
                    //recent_data.push(data_by_date[d][y])
                }
            });
            recent = (recent_data.length!==15) ? NaN : average(recent_data);

            // all year values (except current year) for this date
            //let valArray = Object.values(data_by_date[d])
            let valArray = []
            yearsArray.forEach(function (y) {
                //if (y!=='2018') {
                //if (y!==this_year) {
                if (y!==this_year.toString()) {
                    if (data_by_date[d][y]) { valArray.push(data_by_date[d][y]) }
                    //valArray.push(data_by_date[d][y])
                }
            });
            //console.log(d,valArray);
            if (valArray.length>=5) {
                // get max_por array: max value in POR
                max_por = Math.max(...valArray);
                // get min_por array: min value in POR
                min_por = Math.min(...valArray);
                // max minus min for this date
                max_minus_min = max_por - min_por
            } else {
                max_por = NaN;
                min_por = NaN;
                max_minus_min = NaN;
            }

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
                "reduce":"sum",
                "maxmissing":1
            }]
            if (this.gddtool_getBase==='50' && this.gddtool_getIsMethod8650) {
                elems[0]["limit"]=[50,86]
            };

            return {
                    //"sid":this.getLocation.uid.toString(),
                    "sid":this.getLocation.sid,
                    "sdate":"1981-01-01",
                    "edate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
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
          //.post(`${protocol}//data.rcc-acis.org/StnData`, this.getAcisParams)
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, this.getAcisParams)
          .then(res => {
            console.log('SUCCESS downloading from ACIS');
            console.log(res);
            if (res.data.hasOwnProperty('error')) {
                this.gddtool_setClimateData(null);
                this.gddtool_initClimateSummary()
            } else {
                this.gddtool_setClimateData(res.data.data.slice(0));
                this.gddtool_setClimateSummary()
            }
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
            if (this.getToolName==='wxgrapher') { this.wxgraph_downloadData() }
        }
    @action wxgraph_setExtSwitchManual = (b) => {
            this.wxgraph_extSwitch = b
        }
    @computed get wxgraph_getExtSwitch() {
        return this.wxgraph_extSwitch
    }

    @observable grapher_date = moment(date_current,'YYYY-MM-DD');
    @action setGrapherDate = (v) => {
      this.grapher_date = v
      if (this.getToolName==='wxgrapher') { this.wxgraph_downloadData() }
    };
    @computed get getGrapherDate() {
      return this.grapher_date
    };
    @computed get getGrapherYear() {
      return this.getGrapherDate.format('YYYY')
    };

    // for component: VarPicker
    @observable wxgraph_vars={
            airtemp : true,
            rainfall : true,
            soiltemp : true,
            soilmoist : true,
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
            airtemp_label : 'Temp > 100°F',
            rainfall_label : 'Temp > 90°F',
            soiltemp_label : 'Temp > 80°F',
            soilmoist_label : 'Precip > 4 Inches',
            humidity_label : 'Precip > 3 Inches',
            solarrad_label : 'Precip > 2 Inches',
            wind_label : 'Precip > 1 Inch',
          };
        } else {
          return {
            airtemp_label : 'Air Temperature',
            rainfall_label : 'Rainfall',
            soiltemp_label : 'Soil Temperature',
            soilmoist_label : 'Soil Moisture',
            humidity_label : 'Relative Humidity',
            solarrad_label : 'Solar Radiation',
            wind_label : 'Wind Speed',
            winddir_label : 'Wind Direction',
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
            airtemp_units : (this.wxgraph_getUnitsTemp==='degreeF') ? '°F' : '°C',
            rainfall_units : this.wxgraph_getUnitsPrcp,
            soiltemp_units : (this.wxgraph_getUnitsTemp==='degreeF') ? '°F' : '°C',
            soilmoist_units : '%',
            humidity_units : '%',
            solarrad_units : (this.wxgraph_getTimeFrame==='two_days') ? 'W/m2' : 'langleys',
            wind_units : 'mph',
            winddir_units : 'deg',
            leafwet_units : 'min',
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
    //     solar : total solar radiation for day (W/m2 for hourly inst, langleys for daily sum)
    //     wind : average wind speed for day (mph)
    //     leafwet : average leaf wetness for day (minutes)
    @observable wxgraph_climateSummary = {'por':[{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt': NaN,
                'pcpn': NaN,
                'soilt': NaN,
                'soilm': NaN,
                'humid': NaN,
                'solar': NaN,
                'wind': NaN,
                'leafwet': NaN,
                }],'two_years':[{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt': NaN,
                'pcpn': NaN,
                'soilt': NaN,
                'soilm': NaN,
                'humid': NaN,
                'solar': NaN,
                'wind': NaN,
                'leafwet': NaN,
                }],'two_months':[{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt': NaN,
                'pcpn': NaN,
                'soilt': NaN,
                'soilm': NaN,
                'humid': NaN,
                'solar': NaN,
                'wind': NaN,
                'leafwet': NaN,
                }],'two_days':[{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt': NaN,
                'pcpn': NaN,
                'soilt': NaN,
                'soilm': NaN,
                'humid': NaN,
                'solar': NaN,
                'wind': NaN,
                'leafwet': NaN,
                }]};
    @action wxgraph_initClimateSummary = () => {
        let dataObjArray = [{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt': NaN,
                'pcpn': NaN,
                'soilt': NaN,
                'soilm': NaN,
                'humid': NaN,
                'solar': NaN,
                'wind': NaN,
                'leafwet': NaN,
            }];
        this.wxgraph_climateSummary = {'por':dataObjArray,'two_years':dataObjArray,'two_months':dataObjArray,'two_days':dataObjArray}
    }
    @action wxgraph_setClimateSummary = () => {
        let data = this.wxgraph_getClimateData;
        let dataObjArray_hours = [];
        let dataObjArray_days = [];
        let dataObjArray_months = [];
        let dataObjArray_years = [];
        let dataObjArray_extremes = [];
        let i, dateToday, numHours, numFutureMissingHours;
        let formattedHourString
        let timeFrame = this.wxgraph_getTimeFrame
        let extSwitch = this.wxgraph_getExtSwitch
        data.forEach(function (d) {
            if (timeFrame==='two_months') {
              // daily data
              dataObjArray_days.push({
                'date':d[0],
                'avgt':(d[1]==='M') ? NaN : parseFloat(d[1]).toFixed(1),
                'maxt':(d[2]==='M') ? NaN : parseFloat(d[2]).toFixed(1),
                'mint':(d[3]==='M') ? NaN : parseFloat(d[3]).toFixed(1),
                'pcpn':(d[4]==='M' || parseFloat(d[4])<0.0) ? NaN : ((d[4]==='T') ? 0.00 : parseFloat(d[4])).toFixed(2),
                'soilt2in':(d[5]==='M') ? NaN : parseFloat(d[5]).toFixed(1),
                'soilt4in':(d[6]==='M') ? NaN : parseFloat(d[6]).toFixed(1),
                'soilt8in':(d[7]==='M') ? NaN : parseFloat(d[7]).toFixed(1),
                'soilt20in':(d[8]==='M') ? NaN : parseFloat(d[8]).toFixed(1),
                'soilt40in':(d[9]==='M') ? NaN : parseFloat(d[9]).toFixed(1),
                'soilm2in':(d[10]==='M' || parseFloat(d[10])<0.0) ? NaN : parseFloat(d[10]).toFixed(1),
                'soilm4in':(d[11]==='M' || parseFloat(d[11])<0.0) ? NaN : parseFloat(d[11]).toFixed(1),
                'soilm8in':(d[12]==='M' || parseFloat(d[12])<0.0) ? NaN : parseFloat(d[12]).toFixed(1),
                'soilm20in':(d[13]==='M' || parseFloat(d[13])<0.0) ? NaN : parseFloat(d[13]).toFixed(1),
                'soilm40in':(d[14]==='M' || parseFloat(d[14])<0.0) ? NaN : parseFloat(d[14]).toFixed(1),
                'humid':NaN,
                'solar':(d[15]==='M' || parseFloat(d[15])<0.0) ? NaN : parseFloat(d[15]).toFixed(1),
                'windspdmax':(d[16]==='M' || parseFloat(d[16])<0.0) ? NaN : parseFloat(d[16]).toFixed(1),
                'windspdave':(d[17]==='M' || parseFloat(d[17])<0.0) ? NaN : parseFloat(d[17]).toFixed(1),
                // not using wind speed from daily+, looks to be averaged incorrectly
                //'winddirave':(d[18]==='M' || parseFloat(d[18])<0.0 || parseFloat(d[18])>360.0) ? NaN : parseFloat(d[18]).toFixed(1),
                'winddirave':NaN,
                'leafwet':NaN,
              })
            } else if (timeFrame==='two_years') {
              // monthly data
              dataObjArray_months.push({
                'date':d[0],
                'avgt':(d[1]==='M') ? NaN : parseFloat(d[1]).toFixed(1),
                'maxt':(d[2]==='M') ? NaN : parseFloat(d[2]).toFixed(1),
                'mint':(d[3]==='M') ? NaN : parseFloat(d[3]).toFixed(1),
                'pcpn':(d[4]==='M' || parseFloat(d[4])<0.0) ? NaN : ((d[4]==='T') ? 0.00 : parseFloat(d[4])).toFixed(2),
                'soilt2in':(d[5]==='M') ? NaN : parseFloat(d[5]).toFixed(1),
                'soilt4in':(d[6]==='M') ? NaN : parseFloat(d[6]).toFixed(1),
                'soilt8in':(d[7]==='M') ? NaN : parseFloat(d[7]).toFixed(1),
                'soilt20in':(d[8]==='M') ? NaN : parseFloat(d[8]).toFixed(1),
                'soilt40in':(d[9]==='M') ? NaN : parseFloat(d[9]).toFixed(1),
                'soilm2in':(d[10]==='M' || parseFloat(d[10])<0.0) ? NaN : parseFloat(d[10]).toFixed(1),
                'soilm4in':(d[11]==='M' || parseFloat(d[11])<0.0) ? NaN : parseFloat(d[11]).toFixed(1),
                'soilm8in':(d[12]==='M' || parseFloat(d[12])<0.0) ? NaN : parseFloat(d[12]).toFixed(1),
                'soilm20in':(d[13]==='M' || parseFloat(d[13])<0.0) ? NaN : parseFloat(d[13]).toFixed(1),
                'soilm40in':(d[14]==='M' || parseFloat(d[14])<0.0) ? NaN : parseFloat(d[14]).toFixed(1),
                'humid':NaN,
                'solar':(d[15]==='M' || parseFloat(d[15])<0.0) ? NaN : parseFloat(d[15]).toFixed(1),
                'windspdmax':(d[16]==='M' || parseFloat(d[16])<0.0) ? NaN : parseFloat(d[16]).toFixed(1),
                'windspdave':(d[17]==='M' || parseFloat(d[17])<0.0) ? NaN : parseFloat(d[17]).toFixed(1),
                // not using wind speed from daily+, looks to be averaged incorrectly
                //'winddirave':(d[18]==='M' || parseFloat(d[18])<0.0 || parseFloat(d[18])>360.0) ? NaN : parseFloat(d[18]).toFixed(1),
                'winddirave':NaN,
                'leafwet':NaN,
              })
            } else if (timeFrame==='por') {
              // yearly data
              if (!extSwitch) {
                  dataObjArray_years.push({
                    'date':d[0],
                    'avgt':(d[1]==='M') ? NaN : parseFloat(d[1]).toFixed(1),
                    'maxt':(d[2]==='M') ? NaN : parseFloat(d[2]).toFixed(1),
                    'mint':(d[3]==='M') ? NaN : parseFloat(d[3]).toFixed(1),
                    'pcpn':(d[4]==='M' || parseFloat(d[4])<0.0) ? NaN : ((d[4]==='T') ? 0.00 : parseFloat(d[4])).toFixed(2),
                    'soilt2in':(d[5]==='M') ? NaN : parseFloat(d[5]).toFixed(1),
                    'soilt4in':(d[6]==='M') ? NaN : parseFloat(d[6]).toFixed(1),
                    'soilt8in':(d[7]==='M') ? NaN : parseFloat(d[7]).toFixed(1),
                    'soilt20in':(d[8]==='M') ? NaN : parseFloat(d[8]).toFixed(1),
                    'soilt40in':(d[9]==='M') ? NaN : parseFloat(d[9]).toFixed(1),
                    'soilm2in':(d[10]==='M' || parseFloat(d[10])<0.0) ? NaN : parseFloat(d[10]).toFixed(1),
                    'soilm4in':(d[11]==='M' || parseFloat(d[11])<0.0) ? NaN : parseFloat(d[11]).toFixed(1),
                    'soilm8in':(d[12]==='M' || parseFloat(d[12])<0.0) ? NaN : parseFloat(d[12]).toFixed(1),
                    'soilm20in':(d[13]==='M' || parseFloat(d[13])<0.0) ? NaN : parseFloat(d[13]).toFixed(1),
                    'soilm40in':(d[14]==='M' || parseFloat(d[14])<0.0) ? NaN : parseFloat(d[14]).toFixed(1),
                    'humid':NaN,
                    'solar':(d[15]==='M' || parseFloat(d[15])<0.0) ? NaN : parseFloat(d[15]).toFixed(1),
                    'windspdmax':(d[16]==='M' || parseFloat(d[16])<0.0) ? NaN : parseFloat(d[16]).toFixed(1),
                    'windspdave':(d[17]==='M' || parseFloat(d[17])<0.0) ? NaN : parseFloat(d[17]).toFixed(1),
                    // not using wind speed from daily+, looks to be averaged incorrectly
                    //'winddirave':(d[18]==='M' || parseFloat(d[18])<0.0 || parseFloat(d[18])>360.0) ? NaN : parseFloat(d[18]).toFixed(1),
                    'winddirave':NaN,
                    'leafwet':NaN,
                  })
              } else {
                  dataObjArray_extremes.push({
                    'date':d[0],
                    'cnt_t_gt_100':(d[1]==='M') ? NaN : parseInt(d[1],10),
                    'cnt_t_gt_90':(d[2]==='M') ? NaN : parseInt(d[2],10),
                    'cnt_t_gt_80':(d[3]==='M') ? NaN : parseInt(d[3],10),
                    'cnt_p_gt_4':(d[4]==='M') ? NaN : parseInt(d[4],10),
                    'cnt_p_gt_3':(d[5]==='M') ? NaN : parseInt(d[5],10),
                    'cnt_p_gt_2':(d[6]==='M') ? NaN : parseInt(d[6],10),
                    'cnt_p_gt_1':(d[7]==='M') ? NaN : parseInt(d[7],10),
                  })
              }
            } else {
              // hourly data
              dateToday = d[0]
              // hourly data
              //if (dateToday<moment(date_current,'YYYY-MM-DD').add(-3,'days').format('YYYY-MM-DD')) { return }
              if (dateToday===data[data.length-4][0]) {
                  // first day: only use last hour (midnight)
                  formattedHourString = moment(dateToday,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD")+' 00:00'
                  dataObjArray_hours.push({
                      //'date':dateToday+' 24',
                      'date':formattedHourString,
                      'avgt':(d[1][23]==='M') ? NaN : parseFloat(d[1][23]).toFixed(1),
                      'maxt':(d[2][23]==='M') ? NaN : parseFloat(d[2][23]).toFixed(1),
                      'mint':(d[3][23]==='M') ? NaN : parseFloat(d[3][23]).toFixed(1),
                      'pcpn':(d[4][23]==='M' || parseFloat(d[4][23])<0.0) ? NaN : ((d[4][23]==='T') ? 0.00 : parseFloat(d[4][23])).toFixed(2),
                      'soilt2in':(d[5][23]==='M') ? NaN : parseFloat(d[5][23]).toFixed(1),
                      'soilt4in':(d[6][23]==='M') ? NaN : parseFloat(d[6][23]).toFixed(1),
                      'soilt8in':(d[7][23]==='M') ? NaN : parseFloat(d[7][23]).toFixed(1),
                      'soilt20in':(d[8][23]==='M') ? NaN : parseFloat(d[8][23]).toFixed(1),
                      'soilt40in':(d[9][23]==='M') ? NaN : parseFloat(d[9][23]).toFixed(1),
                      'soilm2in':(d[10][23]==='M' || parseFloat(d[10][23])<0.0) ? NaN : parseFloat(d[10][23]).toFixed(1),
                      'soilm4in':(d[11][23]==='M' || parseFloat(d[11][23])<0.0) ? NaN : parseFloat(d[11][23]).toFixed(1),
                      'soilm8in':(d[12][23]==='M' || parseFloat(d[12][23])<0.0) ? NaN : parseFloat(d[12][23]).toFixed(1),
                      'soilm20in':(d[13][23]==='M' || parseFloat(d[13][23])<0.0) ? NaN : parseFloat(d[13][23]).toFixed(1),
                      'soilm40in':(d[14][23]==='M' || parseFloat(d[14][23])<0.0) ? NaN : parseFloat(d[14][23]).toFixed(1),
                      'humid':(d[15][23]==='M' || parseFloat(d[15][23])<0.0 || parseFloat(d[15][23])>100.0) ? NaN : parseFloat(d[15][23]).toFixed(1),
                      'solar':(d[16][23]==='M' || parseFloat(d[16][23])<0.0) ? NaN : parseFloat(d[16][23]).toFixed(1),
                      'windspdmax':(d[17][23]==='M' || parseFloat(d[17][23])<0.0) ? NaN : parseFloat(d[17][23]).toFixed(1),
                      'windspdave':(d[18][23]==='M' || parseFloat(d[18][23])<0.0) ? NaN : parseFloat(d[18][23]).toFixed(1),
                      'winddirave':(d[19][23]==='M' || parseFloat(d[19][23])<0.0 || parseFloat(d[19][23])>360.0) ? NaN : parseFloat(d[19][23]).toFixed(1),
                      'leafwet':NaN,
                  })
              } else if (dateToday===data[data.length-1][0]) {
                  // last day: leave off future hours with missing data
                  numHours = d[1].length
                  numFutureMissingHours = 0
                  for (i = numHours-1; i >= 0; i--) { 
                      if (d[1][i]==='M') {
                          numFutureMissingHours += 1;
                      } else {
                          break;
                      }
                  }
                  numHours -= numFutureMissingHours
                  for (i = 0; i < numHours; i++) { 
                      // format hour
                      if (i<=8) {
                          formattedHourString = dateToday+' 0'+(i+1).toString()+':00'
                      } else if (i>8 && i<23) {
                          formattedHourString = dateToday+' '+(i+1).toString()+':00'
                      } else if (i===23) {
                          formattedHourString = moment(dateToday,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD")+' 00:00'
                      } else {
                      }
                      dataObjArray_hours.push({
                          //'date':(i+1>=10) ? dateToday+' '+(i+1).toString() : dateToday+' 0'+(i+1).toString(),
                          'date':formattedHourString,
                          'avgt':(d[1][i]==='M') ? NaN : parseFloat(d[1][i]).toFixed(1),
                          'maxt':(d[2][i]==='M') ? NaN : parseFloat(d[2][i]).toFixed(1),
                          'mint':(d[3][i]==='M') ? NaN : parseFloat(d[3][i]).toFixed(1),
                          'pcpn':(d[4][i]==='M' || parseFloat(d[4][i])<0.0) ? NaN : ((d[4][i]==='T') ? 0.00 : parseFloat(d[4][i])).toFixed(2),
                          'soilt2in':(d[5][i]==='M') ? NaN : parseFloat(d[5][i]).toFixed(1),
                          'soilt4in':(d[6][i]==='M') ? NaN : parseFloat(d[6][i]).toFixed(1),
                          'soilt8in':(d[7][i]==='M') ? NaN : parseFloat(d[7][i]).toFixed(1),
                          'soilt20in':(d[8][i]==='M') ? NaN : parseFloat(d[8][i]).toFixed(1),
                          'soilt40in':(d[9][i]==='M') ? NaN : parseFloat(d[9][i]).toFixed(1),
                          'soilm2in':(d[10][i]==='M' || parseFloat(d[10][i])<0.0) ? NaN : parseFloat(d[10][i]).toFixed(1),
                          'soilm4in':(d[11][i]==='M' || parseFloat(d[11][i])<0.0) ? NaN : parseFloat(d[11][i]).toFixed(1),
                          'soilm8in':(d[12][i]==='M' || parseFloat(d[12][i])<0.0) ? NaN : parseFloat(d[12][i]).toFixed(1),
                          'soilm20in':(d[13][i]==='M' || parseFloat(d[13][i])<0.0) ? NaN : parseFloat(d[13][i]).toFixed(1),
                          'soilm40in':(d[14][i]==='M' || parseFloat(d[14][i])<0.0) ? NaN : parseFloat(d[14][i]).toFixed(1),
                          'humid':(d[15][i]==='M' || parseFloat(d[15][i])<0.0 || parseFloat(d[15][i])>100.0) ? NaN : parseFloat(d[15][i]).toFixed(1),
                          'solar':(d[16][i]==='M' || parseFloat(d[16][i])<0.0) ? NaN : parseFloat(d[16][i]).toFixed(1),
                          'windspdmax':(d[17][i]==='M' || parseFloat(d[17][i])<0.0) ? NaN : parseFloat(d[17][i]).toFixed(1),
                          'windspdave':(d[18][i]==='M' || parseFloat(d[18][i])<0.0) ? NaN : parseFloat(d[18][i]).toFixed(1),
                          'winddirave':(d[19][i]==='M' || parseFloat(d[19][i])<0.0 || parseFloat(d[4][i])>360.0) ? NaN : parseFloat(d[19][i]).toFixed(1),
                          'leafwet':NaN,
                      })
                  }
              } else {
                  numHours = d[1].length
                  for (i = 0; i < numHours; i++) { 
                      // format hour
                      if (i<=8) {
                          formattedHourString = dateToday+' 0'+(i+1).toString()+':00'
                      } else if (i>8 && i<23) {
                          formattedHourString = dateToday+' '+(i+1).toString()+':00'
                      } else if (i===23) {
                          formattedHourString = moment(dateToday,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD")+' 00:00'
                      } else {
                      }
                      dataObjArray_hours.push({
                          //'date':(i+1>=10) ? dateToday+' '+(i+1).toString() : dateToday+' 0'+(i+1).toString(),
                          'date':formattedHourString,
                          'avgt':(d[1][i]==='M') ? NaN : parseFloat(d[1][i]).toFixed(1),
                          'maxt':(d[2][i]==='M') ? NaN : parseFloat(d[2][i]).toFixed(1),
                          'mint':(d[3][i]==='M') ? NaN : parseFloat(d[3][i]).toFixed(1),
                          'pcpn':(d[4][i]==='M' || parseFloat(d[4][i])<0.0) ? NaN : ((d[4][i]==='T') ? 0.00 : parseFloat(d[4][i])).toFixed(2),
                          'soilt2in':(d[5][i]==='M') ? NaN : parseFloat(d[5][i]).toFixed(1),
                          'soilt4in':(d[6][i]==='M') ? NaN : parseFloat(d[6][i]).toFixed(1),
                          'soilt8in':(d[7][i]==='M') ? NaN : parseFloat(d[7][i]).toFixed(1),
                          'soilt20in':(d[8][i]==='M') ? NaN : parseFloat(d[8][i]).toFixed(1),
                          'soilt40in':(d[9][i]==='M') ? NaN : parseFloat(d[9][i]).toFixed(1),
                          'soilm2in':(d[10][i]==='M' || parseFloat(d[10][i])<0.0) ? NaN : parseFloat(d[10][i]).toFixed(1),
                          'soilm4in':(d[11][i]==='M' || parseFloat(d[11][i])<0.0) ? NaN : parseFloat(d[11][i]).toFixed(1),
                          'soilm8in':(d[12][i]==='M' || parseFloat(d[12][i])<0.0) ? NaN : parseFloat(d[12][i]).toFixed(1),
                          'soilm20in':(d[13][i]==='M' || parseFloat(d[13][i])<0.0) ? NaN : parseFloat(d[13][i]).toFixed(1),
                          'soilm40in':(d[14][i]==='M' || parseFloat(d[14][i])<0.0) ? NaN : parseFloat(d[14][i]).toFixed(1),
                          'humid':(d[15][i]==='M' || parseFloat(d[15][i])<0.0 || parseFloat(d[15][i])>100.0) ? NaN : parseFloat(d[15][i]).toFixed(1),
                          'solar':(d[16][i]==='M' || parseFloat(d[16][i])<0.0) ? NaN : parseFloat(d[16][i]).toFixed(1),
                          'windspdmax':(d[17][i]==='M' || parseFloat(d[17][i])<0.0) ? NaN : parseFloat(d[17][i]).toFixed(1),
                          'windspdave':(d[18][i]==='M' || parseFloat(d[18][i])<0.0) ? NaN : parseFloat(d[18][i]).toFixed(1),
                          'winddirave':(d[19][i]==='M' || parseFloat(d[19][i])<0.0 || parseFloat(d[4][i])>360.0) ? NaN : parseFloat(d[19][i]).toFixed(1),
                          'leafwet':NaN,
                      })
                  }
              }
            }
        })

        this.wxgraph_climateSummary = {'extremes':dataObjArray_extremes,'por':dataObjArray_years,'two_years':dataObjArray_months,'two_months':dataObjArray_days,'two_days':dataObjArray_hours}
        //this.wxgraph_climateSummary = [dataObjArray_years, dataObjArray_months, dataObjArray_days, dataObjArray_hours]
    }
    @computed get wxgraph_getClimateSummary() {
        return this.wxgraph_climateSummary
    }

    // time frame to view data
    // - options are 'por', 'two_years', 'two_months', 'two_days'
    @observable wxgraph_timeFrame = 'two_months'
    //@observable wxgraph_timeFrame = 'two_days'
    @action wxgraph_setTimeFrame = (t) => {
        // has the time frame changed?
        let changed = (this.wxgraph_getTimeFrame===t) ? false : true
        // make sure ext switch is off if new time period is not POR
        if (t!=='por' && this.wxgraph_getExtSwitch) { this.wxgraph_setExtSwitchManual(false) }
        // only update and download data if time frame has changed
        if (changed===true) {
            this.wxgraph_timeFrame = t;
            if (this.getToolName==='wxgrapher') { this.wxgraph_downloadData() }
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
            if (this.getToolName==='wxgrapher') {this.wxgraph_downloadData()}
        }
    }
    @computed get wxgraph_getTimeFrame() {
        return this.wxgraph_timeFrame;
    }

    // temperature units (as defined in ACIS: 'degreeC' or 'degreeF')
    @observable wxgraph_unitsTemp = 'degreeF'
    @action wxgraph_setUnitsTemp = (u) => {
        this.wxgraph_unitsTemp = u
    }
    @action wxgraph_setSelectedUnitsTemp = (u) => {
            if (this.wxgraph_getUnitsTemp !== u) {
                this.wxgraph_unitsTemp = u.value;
                if (this.getToolName==='wxgrapher') {this.wxgraph_downloadData()}
            }
        };
    @action wxgraph_setUnitsTempFromRadioGroup = (e) => {
        let t = e.target.value;
        // have the units changed?
        let changed = (this.wxgraph_getUnitsTemp===t) ? false : true
        // only update and download data if time frame has changed
        if (changed===true) {
            this.wxgraph_unitsTemp = t;
            if (this.getToolName==='wxgrapher') {this.wxgraph_downloadData()}
        }
    }
    @computed get wxgraph_getUnitsTemp() {
        return this.wxgraph_unitsTemp;
    }

    // precipitation units (as defined in ACIS: 'inches', 'cm' or 'mm')
    @observable wxgraph_unitsPrcp = 'inches'
    @action wxgraph_setUnitsPrcp = (u) => {
        this.wxgraph_unitsPrcp = u
    }
    @action wxgraph_setSelectedUnitsPrcp = (u) => {
            if (this.wxgraph_getUnitsPrcp !== u) {
                this.wxgraph_unitsPrcp = u.value;
                if (this.getToolName==='wxgrapher') {this.wxgraph_downloadData()}
            }
        };
    @action wxgraph_setUnitsPrcpFromRadioGroup = (e) => {
        let u = e.target.value;
        // have the units changed?
        let changed = (this.wxgraph_getUnitsPrcp===u) ? false : true
        // only update and download data if time frame has changed
        if (changed===true) {
            this.wxgraph_unitsPrcp = u;
            if (this.getToolName==='wxgrapher') {this.wxgraph_downloadData()}
        }
    }
    @computed get wxgraph_getUnitsPrcp() {
        return this.wxgraph_unitsPrcp;
    }

    // Wx Grapher tool data download - set parameters
    @computed get wxgraph_getAcisParams() {
            let elems
            let numdays
            let unitsTemp = this.wxgraph_getUnitsTemp
            let unitsPrcp = this.wxgraph_getUnitsPrcp
            if (this.wxgraph_getTimeFrame==='two_days') {
                elems = [
                    {"vX":23, "units":unitsTemp}, //hourly temp, inst
                    {"vX":124, "units":unitsTemp}, //hourly temp, max
                    {"vX":125, "units":unitsTemp}, //hourly temp, min
                    {"vX":5, "units":unitsPrcp}, //hourly pcpn, sum
                    {"vX":120,"vN":70, "units":unitsTemp}, //hourly soil temperature @ 2", inst
                    {"vX":120,"vN":102, "units":unitsTemp}, //hourly soil temperature @ 4", inst
                    {"vX":120,"vN":166, "units":unitsTemp}, //hourly soil temperature @ 8", inst
                    {"vX":120,"vN":294, "units":unitsTemp}, //hourly soil temperature @ 20", inst
                    {"vX":120,"vN":326, "units":unitsTemp}, //hourly soil temperature @ 40", inst
                    {"vX":104,"vN":68}, //hourly soil moisture @ 2", ave
                    {"vX":104,"vN":100}, //hourly soil moisture @ 4", ave
                    {"vX":104,"vN":164}, //hourly soil moisture @ 8", ave
                    {"vX":104,"vN":292}, //hourly soil moisture @ 20", ave
                    {"vX":104,"vN":324}, //hourly soil moisture @ 40", ave
                    {"vX":24}, //hourly relative humidity, inst
                    {"vX":149}, //hourly solar radiation, ave
                    {"vX":42}, //hourly wind speed, peak, max
                    {"vX":128}, //hourly wind speed, average, ave
                    {"vX":130}, //hourly wind direction, average, ave
                ]
                numdays=-3
            } else if (this.wxgraph_getTimeFrame==='two_months') {
                elems = [
                    {"name":"avgt","interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily average temperature, ave
                    {"vX":1,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily maximum temperature, max
                    {"vX":2,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily minimum temperature, min
                    {"vX":4,"interval":[0,0,1],"duration":"dly","units":unitsPrcp}, // daily precipitation, sum
                    {"vX":69,"vN":67,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 2", ave
                    {"vX":69,"vN":99,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 4", ave
                    {"vX":69,"vN":163,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 8", ave
                    {"vX":69,"vN":291,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 20", ave
                    {"vX":69,"vN":323,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 40", ave
                    {"vX":68,"vN":65,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 2", ave
                    {"vX":68,"vN":97,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 4", ave
                    {"vX":68,"vN":161,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 8", ave
                    {"vX":68,"vN":289,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 20", ave
                    {"vX":68,"vN":321,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 40", ave
                    //{"vX":71,"interval":[0,0,1],"duration":"dly"}, // daily relative humidity, ave
                    {"vX":70,"interval":[0,0,1],"duration":"dly"}, // daily solar radiation, sum
                    {"vX":77,"interval":[0,0,1],"duration":"dly"}, // daily wind speed, maximum, max
                    {"vX":89,"interval":[0,0,1],"duration":"dly"}, // daily wind speed, average, ave
                    {"vX":101,"interval":[0,0,1],"duration":"dly"}, // daily wind direction, average, ave
                ]
                numdays=-60
            } else if (this.wxgraph_getTimeFrame==='two_years') {
                elems = [
                    {"name":"avgt","interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly average temperature, ave
                    {"vX":1,"interval":[0,1],"duration":"mly","reduce":{"reduce":"max"},"maxmissing":3,"units":unitsTemp}, // monthly maximum temperature, max
                    {"vX":2,"interval":[0,1],"duration":"mly","reduce":{"reduce":"min"},"maxmissing":3,"units":unitsTemp}, // monthly minimum temperature, min
                    {"vX":4,"interval":[0,1],"duration":"mly","reduce":{"reduce":"sum"},"maxmissing":3,"units":unitsPrcp}, // monthly precipitation, sum
                    {"vX":69,"vN":67,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 2", ave
                    {"vX":69,"vN":99,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 4", ave
                    {"vX":69,"vN":163,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 8", ave
                    {"vX":69,"vN":291,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 20", ave
                    {"vX":69,"vN":323,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 40", ave
                    {"vX":68,"vN":65,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 2", ave
                    {"vX":68,"vN":97,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 4", ave
                    {"vX":68,"vN":161,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 8", ave
                    {"vX":68,"vN":289,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 20", ave
                    {"vX":68,"vN":321,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 40", ave
                    //{"vX":71,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly relative humidity, ave
                    {"vX":70,"interval":[0,1],"duration":"mly","reduce":{"reduce":"sum"},"maxmissing":3}, // monthly solar radiation, sum
                    {"vX":77,"interval":[0,1],"duration":"mly","reduce":{"reduce":"max"},"maxmissing":3}, // monthly wind speed, maximum, max
                    {"vX":89,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly wind speed, average, ave
                    {"vX":101,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly wind direction, average, ave
                ]
                numdays=-730
            } else if (this.wxgraph_getTimeFrame==='por') {
                //if (!this.wxgraph_getExtSwitch) {
                if (!this.wxgraph_getExtSwitch) {
                    elems = [
                        {"name":"avgt","interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp},
                        {"vX":1,"interval":[1],"duration":"yly","reduce":{"reduce":"max"},"maxmissing":10,"units":unitsTemp}, // annual maximum temperature, max
                        {"vX":2,"interval":[1],"duration":"yly","reduce":{"reduce":"min"},"maxmissing":10,"units":unitsTemp}, // annual minimum temperature, min
                        {"vX":4,"interval":[1],"duration":"yly","reduce":{"reduce":"sum"},"maxmissing":10,"units":unitsPrcp}, // annual precipitation, sum
                        {"vX":69,"vN":67,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 2", ave
                        {"vX":69,"vN":99,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 4", ave
                        {"vX":69,"vN":163,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 8", ave
                        {"vX":69,"vN":291,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 20", ave
                        {"vX":69,"vN":323,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 40", ave
                        {"vX":68,"vN":65,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 2", ave
                        {"vX":68,"vN":97,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 4", ave
                        {"vX":68,"vN":161,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 8", ave
                        {"vX":68,"vN":289,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 20", ave
                        {"vX":68,"vN":321,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 40", ave
                        //{"vX":71,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual relative humidity, ave
                        {"vX":70,"interval":[1],"duration":"yly","reduce":{"reduce":"sum"},"maxmissing":10}, // annual solar radiation, sum
                        {"vX":77,"interval":[1],"duration":"yly","reduce":{"reduce":"max"},"maxmissing":10}, //annual wind speed, maximum, max
                        {"vX":89,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, //annual wind speed, average, ave
                        {"vX":101,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, //annual wind direction, average, ave
                    ]
                } else {
                    elems = [
                        {"vX":1,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_100"},"maxmissing":10}, // number of days > 100F, count
                        {"vX":1,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_90"},"maxmissing":10}, // number of days > 90F, count
                        {"vX":1,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_80"},"maxmissing":10}, // number of days > 80F, count
                        {"vX":4,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_4"},"maxmissing":10}, // number of days > 4", count
                        {"vX":4,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_3"},"maxmissing":10}, // number of days > 3", count
                        {"vX":4,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_2"},"maxmissing":10}, // number of days > 2", count
                        {"vX":4,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_1"},"maxmissing":10}, // number of days > 1", count
                    ]
                }
            }

            if (this.wxgraph_getTimeFrame==='por') {
                return {
                        "sid":this.getLocation.sid,
                        "sdate":"por",
                        "edate":"por",
                        "elems":elems
                    }
            } else if (this.wxgraph_getTimeFrame==='two_years' || this.wxgraph_getTimeFrame==="two_months") {
                return {
                        "sid":this.getLocation.sid,
                        //"sdate":moment(date_current,'YYYY-MM-DD').add(numdays,'days').format("YYYY-MM-DD"),
                        //"edate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
                        "sdate":moment(this.getGrapherDate.format('YYYY-MM-DD'),'YYYY-MM-DD').add(numdays,'days').format("YYYY-MM-DD"),
                        "edate":moment(this.getGrapherDate.format('YYYY-MM-DD'),'YYYY-MM-DD').format("YYYY-MM-DD"),
                        "elems":elems
                    }
            } else {
                return {
                        "sid":this.getLocation.sid,
                        //"sdate":moment(date_current,'YYYY-MM-DD').add(numdays,'days').format("YYYY-MM-DD"),
                        //"edate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
                        "sdate":moment(this.getGrapherDate.format('YYYY-MM-DD'),'YYYY-MM-DD').add(numdays,'days').format("YYYY-MM-DD"),
                        "edate":moment(this.getGrapherDate.format('YYYY-MM-DD'),'YYYY-MM-DD').format("YYYY-MM-DD"),
                        "elems":elems,
                        "meta":""
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

    // Wx Grapher tool daily data download - download data using parameters
    @action wxgraph_downloadData = () => {
        console.log("Call wxgraph_downloadData")
        this.wxgraph_setDataIsLoading(true);
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, this.wxgraph_getAcisParams)
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, this.wxgraph_getAcisParams)
          .then(res => {
            console.log('SUCCESS downloading from ACIS');
            console.log(res);
            if (res.data.hasOwnProperty('error')) {
                console.log('Error: resetting data to null');
                this.wxgraph_setClimateData(null);
                this.wxgraph_initClimateSummary()
            } else {
                this.wxgraph_setClimateData(res.data.data.slice(0));
                this.wxgraph_setClimateSummary()
            }
            this.wxgraph_setDataIsLoading(false);
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    ////////////////////////////////////
    // Station Explorer: download data, assign climate data
    ////////////////////////////////////

    // climate data saved
    // - the full hourly request downloaded from ACIS
    @observable explorer_climateData = null;
    @action explorer_setClimateData = (res) => {
        this.explorer_climateData = res
    }
    @computed get explorer_getClimateData() {
        return this.explorer_climateData
    }

    // climate data saved
    // - the full climate summary request downloaded from ACIS
    @observable explorerClimateSummary_climateData = null;
    @action explorerClimateSummary_setClimateData = (res) => {
        this.explorerClimateSummary_climateData = res
    }
    @computed get explorerClimateSummary_getClimateData() {
        return this.explorerClimateSummary_climateData
    }

    // latest hourly data saved here: to be used in station explorer table
    // - data includes:
    //     date : date of observation
    //     avgt : average temperature for day (F)
    //     pcpn : accumulated precipitation for day (in)
    //     soilt : average temperature for day (F)
    //     soilm : average soil moisture for day (%)
    //     humid : average humidity for day (%)
    //     solar : total solar radiation for day (W/m2 for hourly inst, langleys for daily sum)
    //     wind : average wind speed for day (mph)
    //     leafwet : average leaf wetness for day (minutes)
    @observable explorer_latestConditions = {
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt':NaN,
                'maxt':NaN,
                'mint':NaN,
                'pcpn':NaN,
                'soilt2in':NaN,
                'soilt4in':NaN,
                'soilt8in':NaN,
                'soilt20in':NaN,
                'soilt40in':NaN,
                'soilm2in':NaN,
                'soilm4in':NaN,
                'soilm8in':NaN,
                'soilm20in':NaN,
                'soilm40in':NaN,
                'humid':NaN,
                'solar':NaN,
                'windspdmax':NaN,
                'windspdave':NaN,
                'winddirave':NaN,
                'leafwet':NaN,
        };

    @action explorer_initLatestConditions = () => {
        let dataObjOut = {
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt':NaN,
                'maxt':NaN,
                'mint':NaN,
                'pcpn':NaN,
                'soilt2in':NaN,
                'soilt4in':NaN,
                'soilt8in':NaN,
                'soilt20in':NaN,
                'soilt40in':NaN,
                'soilm2in':NaN,
                'soilm4in':NaN,
                'soilm8in':NaN,
                'soilm20in':NaN,
                'soilm40in':NaN,
                'humid':NaN,
                'solar':NaN,
                'windspdmax':NaN,
                'windspdave':NaN,
                'winddirave':NaN,
                'leafwet':NaN,
            };
        this.explorer_latestConditions = dataObjOut
    }

    @action explorer_setLatestConditions = () => {
        let data = this.explorer_getClimateData;
        let dataObjOut = {};
        let i, dateToday, numHours, numFutureMissingHours;
        let formattedHourString
        data.forEach(function (d) {
              dateToday = d[0]
              numHours = d[1].length
              numFutureMissingHours = 0
              for (i = numHours-1; i >= 0; i--) { 
                  if (d[1][i]==='M') {
                      numFutureMissingHours += 1;
                  } else {
                      break;
                  }
              }
              if (numHours===numFutureMissingHours) {return};
              // continue below, if today has some valid hours
              numHours -= numFutureMissingHours
              for (i = 0; i < numHours; i++) { 
                  // format hour
                  if (i<=8) {
                      formattedHourString = dateToday+' 0'+(i+1).toString()+':00'
                  } else if (i>8 && i<23) {
                      formattedHourString = dateToday+' '+(i+1).toString()+':00'
                  } else if (i===23) {
                      formattedHourString = moment(dateToday,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD")+' 00:00'
                  } else {
                  }
                  // assign this hour to dataObjOut
                  // We'll keep overwriting this object. The last hour written to this object is the last hour of available data.
                  dataObjOut = {
                      'date':formattedHourString,
                      'avgt':(d[1][i]==='M') ? 'M' : parseFloat(d[1][i]).toFixed(1).toString()+String.fromCharCode(176)+'F',
                      'maxt':(d[2][i]==='M') ? 'M' : parseFloat(d[2][i]).toFixed(1).toString()+String.fromCharCode(176)+'F',
                      'mint':(d[3][i]==='M') ? 'M' : parseFloat(d[3][i]).toFixed(1).toString()+String.fromCharCode(176)+'F',
                      'pcpn':(d[4][i]==='M' || parseFloat(d[4][i])<0.0) ? 'M' : ((d[4][i]==='T') ? 'T' : parseFloat(d[4][i])).toFixed(2).toString()+'"',
                      'soilt2in':(d[5][i]==='M') ? 'M' : parseFloat(d[5][i]).toFixed(0).toString()+String.fromCharCode(176)+'F',
                      'soilt4in':(d[6][i]==='M') ? 'M' : parseFloat(d[6][i]).toFixed(0).toString()+String.fromCharCode(176)+'F',
                      'soilt8in':(d[7][i]==='M') ? 'M' : parseFloat(d[7][i]).toFixed(0).toString()+String.fromCharCode(176)+'F',
                      'soilt20in':(d[8][i]==='M') ? 'M' : parseFloat(d[8][i]).toFixed(0).toString()+String.fromCharCode(176)+'F',
                      'soilt40in':(d[9][i]==='M') ? 'M' : parseFloat(d[9][i]).toFixed(0).toString()+String.fromCharCode(176)+'F',
                      'soilm2in':(d[10][i]==='M' || parseFloat(d[10][i])<0.0) ? 'M' : parseFloat(d[10][i]).toFixed(0).toString()+'%',
                      'soilm4in':(d[11][i]==='M' || parseFloat(d[11][i])<0.0) ? 'M' : parseFloat(d[11][i]).toFixed(0).toString()+'%',
                      'soilm8in':(d[12][i]==='M' || parseFloat(d[12][i])<0.0) ? 'M' : parseFloat(d[12][i]).toFixed(0).toString()+'%',
                      'soilm20in':(d[13][i]==='M' || parseFloat(d[13][i])<0.0) ? 'M' : parseFloat(d[13][i]).toFixed(0).toString()+'%',
                      'soilm40in':(d[14][i]==='M' || parseFloat(d[14][i])<0.0) ? 'M' : parseFloat(d[14][i]).toFixed(0).toString()+'%',
                      'humid':(d[15][i]==='M' || parseFloat(d[15][i])<0.0 || parseFloat(d[15][i])>100.0) ? 'M' : parseFloat(d[15][i]).toFixed(0).toString()+'%',
                      'solar':(d[16][i]==='M' || parseFloat(d[16][i])<0.0) ? 'M' : parseFloat(d[16][i]).toFixed(1).toString()+' W/m2',
                      'windspdmax':(d[17][i]==='M' || parseFloat(d[17][i])<0.0) ? 'M' : parseFloat(d[17][i]).toFixed(1).toString()+' mph',
                      'windspdave':(d[18][i]==='M' || parseFloat(d[18][i])<0.0) ? 'M' : parseFloat(d[18][i]).toFixed(1).toString()+' mph',
                      'winddirave':(d[19][i]==='M' || parseFloat(d[19][i])<0.0 || parseFloat(d[4][i])>360.0) ? 'M' : parseFloat(d[19][i]).toFixed(0).toString()+String.fromCharCode(176),
                      'leafwet':'M',
                  }
              }
        })
        this.explorer_latestConditions = dataObjOut
    }

    @computed get explorer_getLatestConditions() {
        return this.explorer_latestConditions
    }

    // station climate summary saved here: to be used in station explorer table
    // - data includes:
    @observable explorer_climateSummary = {
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'p_ytd_o':'M',
                'p_ytd_n':'M',
                'p_std_o':'M',
                'p_std_n':'M',
                'p_mtd_o':'M',
                'p_mtd_n':'M',
                't_ytd_o':'M',
                't_ytd_n':'M',
                't_std_o':'M',
                't_std_n':'M',
                't_mtd_o':'M',
                't_mtd_n':'M',
        };

    @action explorer_initClimateSummary = () => {
        let dataObjOut = {
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'p_ytd_o':'M',
                'p_ytd_n':'M',
                'p_std_o':'M',
                'p_std_n':'M',
                'p_mtd_o':'M',
                'p_mtd_n':'M',
                't_ytd_o':'M',
                't_ytd_n':'M',
                't_std_o':'M',
                't_std_n':'M',
                't_mtd_o':'M',
                't_mtd_n':'M',
            };
        this.explorer_climateSummary = dataObjOut
    }

    @action explorer_setClimateSummary = () => {
        let d = this.explorerClimateSummary_getClimateData;
        let dataObjOut = {};
        dataObjOut = {
            'ytd_start':'Jan 1',
            'std_start':getStdStartLabel(d[0]),
            'mtd_start':getMtdStartLabel(d[0]),
            'date':d[0],
            'p_ytd_o':(d[1]==='M' || parseFloat(d[1])<0.0) ? 'M' : ((d[1]==='T') ? 'T' : parseFloat(d[1])).toFixed(2).toString()+'"',
            'p_ytd_n':(d[2]==='M' || parseFloat(d[2])<0.0) ? 'M' : ((d[2]==='T') ? 'T' : parseFloat(d[2])).toFixed(2).toString()+'"',
            'p_std_o':(d[3]==='M' || parseFloat(d[3])<0.0) ? 'M' : ((d[3]==='T') ? 'T' : parseFloat(d[3])).toFixed(2).toString()+'"',
            'p_std_n':(d[4]==='M' || parseFloat(d[4])<0.0) ? 'M' : ((d[4]==='T') ? 'T' : parseFloat(d[4])).toFixed(2).toString()+'"',
            'p_mtd_o':(d[5]==='M' || parseFloat(d[5])<0.0) ? 'M' : ((d[5]==='T') ? 'T' : parseFloat(d[5])).toFixed(2).toString()+'"',
            'p_mtd_n':(d[6]==='M' || parseFloat(d[6])<0.0) ? 'M' : ((d[6]==='T') ? 'T' : parseFloat(d[6])).toFixed(2).toString()+'"',
            't_ytd_o':(d[7]==='M') ? 'M' : parseFloat(d[7]).toFixed(1).toString()+String.fromCharCode(176)+'F',
            't_ytd_n':(d[8]==='M') ? 'M' : parseFloat(d[8]).toFixed(1).toString()+String.fromCharCode(176)+'F',
            't_std_o':(d[9]==='M') ? 'M' : parseFloat(d[9]).toFixed(1).toString()+String.fromCharCode(176)+'F',
            't_std_n':(d[10]==='M') ? 'M' : parseFloat(d[10]).toFixed(1).toString()+String.fromCharCode(176)+'F',
            't_mtd_o':(d[11]==='M') ? 'M' : parseFloat(d[11]).toFixed(1).toString()+String.fromCharCode(176)+'F',
            't_mtd_n':(d[12]==='M') ? 'M' : parseFloat(d[12]).toFixed(1).toString()+String.fromCharCode(176)+'F',
        }
        this.explorer_climateSummary = dataObjOut
    }

    @computed get explorer_getClimateSummary() {
        return this.explorer_climateSummary
    }

    // ACIS parameters: hourly call for last few days
    @computed get explorer_getAcisParams() {
            let elems
            let numdays
            elems = [
                {"vX":23}, //hourly temp, inst
                {"vX":124}, //hourly temp, max
                {"vX":125}, //hourly temp, min
                {"vX":5}, //hourly pcpn, sum
                {"vX":120,"vN":70}, //hourly soil temperature @ 2", inst
                {"vX":120,"vN":102}, //hourly soil temperature @ 4", inst
                {"vX":120,"vN":166}, //hourly soil temperature @ 8", inst
                {"vX":120,"vN":294}, //hourly soil temperature @ 20", inst
                {"vX":120,"vN":326}, //hourly soil temperature @ 40", inst
                {"vX":104,"vN":68}, //hourly soil moisture @ 2", ave
                {"vX":104,"vN":100}, //hourly soil moisture @ 4", ave
                {"vX":104,"vN":164}, //hourly soil moisture @ 8", ave
                {"vX":104,"vN":292}, //hourly soil moisture @ 20", ave
                {"vX":104,"vN":324}, //hourly soil moisture @ 40", ave
                {"vX":24}, //hourly relative humidity, inst
                {"vX":149}, //hourly solar radiation, ave
                {"vX":42}, //hourly wind speed, peak, max
                {"vX":128}, //hourly wind speed, average, ave
                {"vX":130}, //hourly wind direction, average, ave
            ]
            numdays=-60
            return {
                "sid":this.getLocation.sid,
                "sdate":moment(date_current,'YYYY-MM-DD').add(numdays,'days').format("YYYY-MM-DD"),
                "edate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
                "elems":elems,
                "meta":""
            }
    }

    // ACIS parameters: climate summary call
    @computed get explorerClimateSummary_getAcisParams() {
            let elems
            elems=[
                {"name":"pcpn","duration":"ytd","reduce":"sum","prec":2,"maxmissing":"1"},
                {"name":"pcpn","duration":"ytd","reduce":"sum","prec":2,"maxmissing":"1","normal":"departure"},
                {"name":"pcpn","duration":"std","reduce":"sum","season_start":getStdStartString(date_current),"prec":2,"maxmissing":"1"},
                {"name":"pcpn","duration":"std","reduce":"sum","season_start":getStdStartString(date_current),"prec":2,"maxmissing":"1","normal":"departure"},
                {"name":"pcpn","duration":"mtd","reduce":"sum","prec":2,"maxmissing":"1"},
                {"name":"pcpn","duration":"mtd","reduce":"sum","prec":2,"maxmissing":"1","normal":"departure"},
                {"name":"avgt","duration":"ytd","reduce":"mean","prec":1,"maxmissing":"1"},
                {"name":"avgt","duration":"ytd","reduce":"mean","prec":1,"maxmissing":"1","normal":"departure"},
                {"name":"avgt","duration":"std","reduce":"mean","season_start":getStdStartString(date_current),"prec":1,"maxmissing":"1"},
                {"name":"avgt","duration":"std","reduce":"mean","season_start":getStdStartString(date_current),"prec":1,"maxmissing":"1","normal":"departure"},
                {"name":"avgt","duration":"mtd","reduce":"mean","prec":1,"maxmissing":"1"},
                {"name":"avgt","duration":"mtd","reduce":"mean","prec":1,"maxmissing":"1","normal":"departure"},
            ]
            return {
                "sid":this.getLocation.sid,
                "sdate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
                "edate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
                "elems":elems,
                "meta":""
            }
    }

    // data is loading - boolean - to control the spinner
    @observable explorer_dataIsLoading = false
    @action explorer_setDataIsLoading = (b) => {
        this.explorer_dataIsLoading = b;
    }
    @computed get explorer_getDataIsLoading() {
        return this.explorer_dataIsLoading;
    }

    // data is loading - boolean - to control the spinner
    @observable explorerClimateSummary_dataIsLoading = false
    @action explorerClimateSummary_setDataIsLoading = (b) => {
        this.explorerClimateSummary_dataIsLoading = b;
    }
    @computed get explorerClimateSummary_getDataIsLoading() {
        return this.explorerClimateSummary_dataIsLoading;
    }

    // Station explorer hourly data (latest conditions) download
    @action explorer_downloadData = () => {
        console.log("Call explorer_downloadData")
        this.explorer_initLatestConditions();
        this.explorer_setDataIsLoading(true);
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, this.explorer_getAcisParams)
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, this.explorer_getAcisParams)
          .then(res => {
            console.log('SUCCESS downloading from ACIS');
            console.log(res);
            if (res.data.hasOwnProperty('error')) {
                console.log('Error: resetting data to null');
                this.explorer_setClimateData(null);
                this.explorer_initLatestConditions()
            } else {
                this.explorer_setClimateData(res.data.data.slice(0));
                this.explorer_setLatestConditions()
            }
            this.explorer_setDataIsLoading(false);
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    // Station explorer hourly data (latest conditions) download
    @action explorerClimateSummary_downloadData = () => {
        console.log("Call explorerClimateSummary_downloadData")
        this.explorer_initClimateSummary();
        this.explorerClimateSummary_setDataIsLoading(true);
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, this.explorer_getAcisParams)
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, this.explorerClimateSummary_getAcisParams)
          .then(res => {
            console.log('SUCCESS downloading climate summary from ACIS');
            console.log(res);
            if (res.data.hasOwnProperty('error')) {
                console.log('Error: resetting data to null');
                this.explorerClimateSummary_setClimateData(null);
                this.explorer_initClimateSummary()
            } else {
                //this.explorerClimateSummary_setClimateData(res.data.data.slice(0));
                this.explorerClimateSummary_setClimateData(res.data.data[0]);
                this.explorer_setClimateSummary()
            }
            this.explorerClimateSummary_setDataIsLoading(false);
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    ////////////////////////////////////
    /// TOOL: LIVESTOCK HEAT INDEX
    ////////////////////////////////////
    @observable livestock_vars={
            airtemp : true,
            humidity : true,
            solarrad : true,
            wind : true,
        };
    @action livestock_setVars = name => event => {
            this.livestock_vars[name] = event.target.checked
        }
    @computed get livestock_getVars() {
        return this.livestock_vars
    }
    @computed get livestock_getVarLabels() {
          return {
            airtemp_label : 'Air Temperature',
            humidity_label : 'Relative Humidity',
            solarrad_label : 'Solar Radiation',
            wind_label : 'Wind',
          };
    }
    @computed get livestock_getVarUnits() {
        let varUnits = {}
          varUnits = {
            airtemp_units : '°F',
            humidity_units : '%',
            solarrad_units : 'W/m2',
            wind_units : 'mph',
          };
        return varUnits
    }

    // livestock to view data
    // - options are 'cattle', 'poultry', 'swine'
    @observable livestock_livestockType = 'cattle'
    @action livestock_setLivestockType = (t) => {
        // has the livestock changed?
        let changed = (this.livestock_getLivestockType===t) ? false : true
        // only update and download data if livestock has changed
        if (changed===true) {
            this.livestock_livestockType = t;
        }
    }
    @action livestock_setLivestockTypeFromRadioGroup = (e) => {
        let t = e.target.value;
        // has the livestock changed?
        let changed = (this.livestock_getLivestockType===t) ? false : true
        // only update and download data if time frame has changed
        if (changed===true) {
            this.livestock_livestockType = t;
        }
    }
    @computed get livestock_getLivestockType() {
        return this.livestock_livestockType;
    }

    // Livestock Heat Index tool data download - set parameters
    @computed get livestock_getAcisParams() {
            let elems
            let numdays
            let dateToday
            elems = [
                {"vX":23}, //temp
                {"vX":24}, //relative humidity
                {"vX":149}, //solar radiation
                {"vX":128}, //wind speed
            ]
            numdays=-2

            return {
                "sid":this.getLocation.sid,
                "sdate":moment(date_current,'YYYY-MM-DD').add(numdays,'days').format("YYYY-MM-DD"),
                "edate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
                // former live
                //"sdate":moment().add(numdays,'days').format("YYYY-MM-DD"),
                //"edate":moment().format("YYYY-MM-DD"),
                // testing until data are up-to-date
                //"sdate":moment('2019-02-17','YYYY-MM-DD').add(numdays,'days').format("YYYY-MM-DD"),
                //"edate":moment('2019-02-17','YYYY-MM-DD').format("YYYY-MM-DD"),
                "elems":elems,
                "meta":""
            }
        }

    // data is loading - boolean - to control the spinner
    @observable livestock_dataIsLoading = false
    @action livestock_setDataIsLoading = (b) => {
        this.livestock_dataIsLoading = b;
    }
    @computed get livestock_getDataIsLoading() {
        return this.livestock_dataIsLoading;
    }

    // climate data saved in this var
    // - the full request downloaded from ACIS
    @observable livestock_climateData = null;
    @action livestock_setClimateData = (res) => {
        this.livestock_climateData = res
    }
    @computed get livestock_getClimateData() {
        return this.livestock_climateData
    }

    // summary for livestock heat index
    // - data includes:
    //     date : date of observation
    //     temp : temperature for hour (F)
    //     humid : humidity for hour (%)
    //     solar : total solar radiation for hour (W/m2)
    //     wind : wind speed for hour (mph)
    @observable livestock_climateSummary = [{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt': NaN,
                'humid': NaN,
                'solar': NaN,
                'wind': NaN,
                }]
    @action livestock_initClimateSummary = () => {
        let dataObjArray = [{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt': NaN,
                'humid': NaN,
                'solar': NaN,
                'wind': NaN,
            }];
        this.livestock_climateSummary = dataObjArray;
    }
    @action livestock_setClimateSummary = () => {
        let data = this.livestock_getClimateData;
        let dataObjArray_hours = [];
        let i, dateToday, numHours, numFutureMissingHours;
        //let livestockType = this.livestock_getLivestockType;
        let formattedHourString
        let tvar,hvar,svar,wvar
        let cattleIdx

        // hourly data for two days
        data.forEach(function (d) {
              dateToday = d[0]
              // hourly data
              if (dateToday===data[0][0]) {
                  // first day: only use last hour (midnight)
                  tvar = (d[1][23]==='M') ? NaN : parseFloat(d[1][23])
                  hvar = (d[2][23]==='M' || parseFloat(d[2][23])<0.0 || parseFloat(d[2][23])>100.0) ? NaN : parseFloat(d[2][23])
                  svar = (d[3][23]==='M' || parseFloat(d[3][23])<0.0) ? NaN : parseFloat(d[3][23])
                  wvar = (d[4][23]==='M' || parseFloat(d[4][23])<0.0) ? NaN : parseFloat(d[4][23])
                  // use estimate of solar radiation, if unavailable
                  //if (!svar) { svar = 1000 };
                  if (!isNaN(tvar) && !isNaN(hvar) && !isNaN(svar) && !isNaN(wvar)) {
                      //https://www.ars.usda.gov/plains-area/clay-center-ne/marc/docs/heat-stress/forecastingheatstress/
                      cattleIdx = (2.83*tvar) + (0.58*hvar) - (0.76*wvar) + (0.039*svar) - 196.4
                      cattleIdx = (cattleIdx<40) ? 40 : parseInt(cattleIdx,10)
                      // THI from https://www.progressivedairy.com/topics/herd-health/how-do-i-determine-how-do-i-calculate-temperature-humidity-index-thi
                      //cattleIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                  } else {
                      cattleIdx = NaN
                  }
                  //format hour
                  formattedHourString = moment(dateToday,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD")+' 00:00'
                  dataObjArray_hours.push({
                      'date':formattedHourString,
                      'avgt':tvar,
                      'humid':hvar,
                      'solar':svar,
                      'wind':wvar,
                      'cattle':cattleIdx,
                  })
              } else if (dateToday===data[data.length-1][0]) {
                  // last day: leave off future hours with missing data
                  numHours = d[1].length
                  numFutureMissingHours = 0
                  for (i = numHours-1; i >= 0; i--) { 
                      if (d[1][i]==='M') {
                          numFutureMissingHours += 1;
                      } else {
                          break;
                      }
                  }
                  numHours -= numFutureMissingHours
                  for (i = 0; i < numHours; i++) { 
                      tvar = (d[1][i]==='M') ? NaN : parseFloat(d[1][i])
                      hvar = (d[2][i]==='M' || parseFloat(d[2][i])<0.0 || parseFloat(d[2][i])>100.0) ? NaN : parseFloat(d[2][i])
                      svar = (d[3][i]==='M' || parseFloat(d[3][i])<0.0) ? NaN : parseFloat(d[3][i])
                      wvar = (d[4][i]==='M' || parseFloat(d[4][i])<0.0) ? NaN : parseFloat(d[4][i])
                      // use estimate of solar radiation, if unavailable
                      //if (!svar) { svar = 1000 };
                      if (!isNaN(tvar) && !isNaN(hvar) && !isNaN(svar) && !isNaN(wvar)) {
                          //https://www.ars.usda.gov/plains-area/clay-center-ne/marc/docs/heat-stress/forecastingheatstress/
                          cattleIdx = (2.83*tvar) + (0.58*hvar) - (0.76*wvar) + (0.039*svar) - 196.4
                          cattleIdx = (cattleIdx<40) ? 40 : parseInt(cattleIdx,10)
                          // THI from https://www.progressivedairy.com/topics/herd-health/how-do-i-determine-how-do-i-calculate-temperature-humidity-index-thi
                          //cattleIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                      } else {
                          cattleIdx = NaN
                      }
                      // format hour
                      if (i<=8) {
                          formattedHourString = dateToday+' 0'+(i+1).toString()+':00'
                      } else if (i>8 && i<23) {
                          formattedHourString = dateToday+' '+(i+1).toString()+':00'
                      } else if (i===23) {
                          formattedHourString = moment(dateToday,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD")+' 00:00'
                      } else {
                      }
                      dataObjArray_hours.push({
                          //'date':(i+1>=10) ? dateToday+' '+(i+1).toString()+':00' : dateToday+' 0'+(i+1).toString()+':00',
                          'date':formattedHourString,
                          'avgt':tvar,
                          'humid':hvar,
                          'solar':svar,
                          'wind':wvar,
                          'cattle':cattleIdx,
                      })
                  }
              } else {
                  numHours = d[1].length
                  for (i = 0; i < numHours; i++) { 
                      tvar = (d[1][i]==='M') ? NaN : parseFloat(d[1][i])
                      hvar = (d[2][i]==='M' || parseFloat(d[2][i])<0.0 || parseFloat(d[2][i])>100.0) ? NaN : parseFloat(d[2][i])
                      svar = (d[3][i]==='M' || parseFloat(d[3][i])<0.0) ? NaN : parseFloat(d[3][i])
                      wvar = (d[4][i]==='M' || parseFloat(d[4][i])<0.0) ? NaN : parseFloat(d[4][i])
                      // use estimate of solar radiation, if unavailable
                      //if (!svar) { svar = 1000 };
                      if (!isNaN(tvar) && !isNaN(hvar) && !isNaN(svar) && !isNaN(wvar)) {
                          //https://www.ars.usda.gov/plains-area/clay-center-ne/marc/docs/heat-stress/forecastingheatstress/
                          cattleIdx = (2.83*tvar) + (0.58*hvar) - (0.76*wvar) + (0.039*svar) - 196.4
                          cattleIdx = (cattleIdx<40) ? 40 : parseInt(cattleIdx,10)
                          // THI from https://www.progressivedairy.com/topics/herd-health/how-do-i-determine-how-do-i-calculate-temperature-humidity-index-thi
                          //cattleIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                      } else {
                          cattleIdx = NaN
                      }
                      // format hour
                      if (i<=8) {
                          formattedHourString = dateToday+' 0'+(i+1).toString()+':00'
                      } else if (i>8 && i<23) {
                          formattedHourString = dateToday+' '+(i+1).toString()+':00'
                      } else if (i===23) {
                          formattedHourString = moment(dateToday,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD")+' 00:00'
                      } else {
                      }
                      dataObjArray_hours.push({
                          'date':formattedHourString,
                          'avgt':tvar,
                          'humid':hvar,
                          'solar':svar,
                          'wind':wvar,
                          'cattle':cattleIdx,
                      })
                  }
              }
          })

        this.livestock_climateSummary = dataObjArray_hours
    }
    @computed get livestock_getClimateSummary() {
        return this.livestock_climateSummary
    }

    // Livestock Heat Index tool daily data download - download data using parameters
    @action livestock_downloadData = () => {
        console.log("Call livestock_downloadData")
        this.livestock_setDataIsLoading(true);
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, this.wxgraph_getAcisParams)
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, this.livestock_getAcisParams)
          .then(res => {
            console.log('SUCCESS downloading from ACIS');
            //console.log(res);
            if (res.data.hasOwnProperty('error')) {
                console.log('Error: resetting data to null');
                this.livestock_setClimateData(null);
                this.livestock_initClimateSummary()
            } else {
                this.livestock_setClimateData(res.data.data.slice(0));
                this.livestock_setClimateSummary()
            }
            this.livestock_setDataIsLoading(false);
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    ////////////////////////////////////
    /// STEM: Instrumentation info
    ////////////////////////////////////
    // instrument options are:
    //   - 'wind', 'solarrad', 'precip', 'rh_and_temp', 'soil'
    @observable stem_instrument = 'wind';
    @action stem_setInstrument = (i) => {
        this.stem_instrument = i
    }
    @computed get stem_getInstrument() {
        return this.stem_instrument
    }
    @computed get stem_getInstrumentName() {
        let name = null;
        if (this.stem_getInstrument==='wind') { name = 'Wind Speed & Direction' }
        if (this.stem_getInstrument==='solarrad') { name = 'Solar Radiation' }
        if (this.stem_getInstrument==='precip') { name = 'Precipitation' }
        if (this.stem_getInstrument==='rh_and_temp') { name = 'Relative Humidity & Air Temperature' }
        if (this.stem_getInstrument==='soil') { name = 'Soil Moisture & Temperature' }
        return name
    }

    // run these on initial load
    constructor() {
        this.downloadStationInfo()
    }

}

