import { observable, computed, action } from 'mobx';
import axios from 'axios';
import moment from 'moment';
import { parse, format, subHours } from 'date-fns';
import { heatindex as calculateHeatIndex, windchill as calculateWindChill } from '../components/tools/WindHeat/windheatModels';

//utils
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
    toolNameArray = ['gddtool','waterdef','wxgrapher','livestock','windrose','windheat','pawpaw','blueberryGrowth','blueberryHarvest']
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
            } else if (name==='windrose') {
                title = 'Wind Rose Diagram'
                description = 'Summarize wind speed and direction over time.'
                thumbnail = pathToImages+'WindRose-thumbnail.png'
                url = '/tools/wind-rose'
            } else if (name==='windheat') {
                title = 'Wind Chill & Heat Index'
                description = 'Visualize year to date wind chill and heat index.'
                thumbnail = pathToImages+'WindHeat-thumbnail.png'
                url = '/tools/wind-chill-heat-index'
            } else if (name==='pawpaw') {
                title = 'Pawpaw Growth'
                description = 'See year to date and historic information about Pawpaw fruit growth.'
                thumbnail = pathToImages+'Pawpaw-thumbnail.png'
                url = '/tools/fruit-tool'
                onclick = () => this.fruittool_handleFruitSelect('pawpaw')
            } else if (name==='blueberryGrowth') {
                title = 'Lowbush Blueberry Growth'
                description = 'See year to date and historic information about Lowbush Blueberry fruit growth.'
                thumbnail = pathToImages+'Lowbush-Blueberry-Growth-thumbnail.png'
                url = '/tools/fruit-tool'
                onclick = () => this.fruittool_handleFruitSelect('blueberryGrowth')
            } else if (name==='blueberryHarvest') {
                title = 'Lowbush Blueberry Harvest'
                description = 'See year to date and historic information about Lowbush Blueberry harvest.'
                thumbnail = pathToImages+'Lowbush-Blueberry-Harvest-thumbnail.png'
                url = '/tools/fruit-tool'
                onclick = () => this.fruittool_handleFruitSelect('blueberryHarvest')
            } else {
            }
            return {'name':name, 'title':title, 'description':description, 'thumbnail':thumbnail, 'url':url, 'onclick':onclick}
        };

        @observable outputType = 'chart';
        @action setOutputType = (changeEvent) => {
            this.outputType = changeEvent.target.value
    }
    // set outputType from select menu
    @action setSelectedOutputType = (t) => {
        if (this.getOutputType !== t) {
            this.outputType = t;
            }
        };
    @computed get getOutputType() { return this.outputType };
    @observable outputTypePickerInfo = {
        title: 'Output Type',
        name: 'output type',
        options: [
            { label: 'Chart', value: 'chart' },
            { label: 'Table', value: 'table' }
        ],
        type: 'radio',
    };
        
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
            if (this.getToolName==='windheat' && this.toolIsSelected) { this.windheat_downloadData() }
            if (['pawpaw','blueberryGrowth','blueberryHarvest'].includes(this.getToolName) && this.toolIsSelected) { this.fruittool_downloadData() }
            // save location to local storage
            localStorage.setItem("SCAN-ACIS-TOOLS.uid",l.toString())
        };
    }
    // set location from select menu
    @action setSelectedLocation = (t) => {
            if (this.getLocation.uid.toString() !== t.value) {
                this.location = this.getLocations.find(obj => obj.uid.toString() === t.value);
                if (this.getToolName==='gddtool' && this.toolIsSelected) { this.gddtool_downloadData() }
                if (this.getToolName==='wxgrapher' && this.toolIsSelected) { this.wxgraph_downloadData() }
                if (this.getToolName==='livestock' && this.toolIsSelected) { this.livestock_downloadData() }
                if (this.getToolName==='windheat' && this.toolIsSelected) { this.windheat_downloadData() }
                if (['pawpaw','blueberryGrowth','blueberryHarvest'].includes(this.getToolName) && this.toolIsSelected) { this.fruittool_downloadData() }
                // save location to local storage
                localStorage.setItem("SCAN-ACIS-TOOLS.uid",t.value)
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
        this.explorer_downloadDailyData()
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
            this.explorer_downloadDailyData()
        };
    @computed get getLocation_explorer() { return this.location_explorer };

    // all locations
    @observable locations = null;
    @action setLocations = (l) => {
        if (this.getLocations) { this.locations.clear() };
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
                this.setLocation_explorer(feature.id);
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
        }
    @computed get getShowModalMap() {
        return this.showModalMap
    }

    // download list of station info
    @action downloadStationInfo = () => {
        fetch(process.env.PUBLIC_URL + "/data/scan_stations.json")
             .then(r => r.json())
             .then(data => {
               this.setLocations(data['locs']);

               // set saved location from local storage if it exists, otherwise set default station
               if (localStorage.getItem("SCAN-ACIS-TOOLS.uid")) {
                   this.setLocation(parseInt(localStorage.getItem("SCAN-ACIS-TOOLS.uid"),10))
                   this.setLocation_explorer(parseInt(localStorage.getItem("SCAN-ACIS-TOOLS.uid"),10))
               } else {
                   // if location is not saved, set initial location to Centralia Lake, KS - center of the U.S.
                   // 85677 is the UID of this site
                   this.setLocation(85677);
                   this.setLocation_explorer(85677);
               }

               this.setDataView_explorer('weather');
               this.setInfoView_explorer('info');
               this.setDatesForLocations({'date':data['date'],'ytd_start':data['ytd_start'],'std_start':data['std_start'],'mtd_start':data['mtd_start']});
               // download of data for water deficit calculator and wind chill/heat index are done within tool
               // here are initial downloads for others:
               if (this.getToolName==='gddtool') {this.gddtool_downloadData()}
               if (this.getToolName==='wxgrapher') {this.wxgraph_downloadData()}
               if (this.getToolName==='livestock') {this.livestock_downloadData()}
               if (this.getToolName==='windheat') {this.windheat_downloadData()}
               if (['pawpaw','blueberryGrowth','blueberryHarvest'].includes(this.getToolName)) {this.fruittool_downloadData()}
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

    // station explorer info view
    // 'info': show station information
    // 'status': show station status
    @observable infoView_explorer = 'info';
    @action setInfoView_explorer = (d) => {
            this.infoView_explorer=d
        }
    @computed get getInfoView_explorer() {
        return this.infoView_explorer
    }

    // station explorer status page
    @observable explorer_status_page = 0;
    @action setExplorer_status_page = (d) => {
            this.explorer_status_page=d
        }
    @computed get getExplorer_status_page() {
        return this.explorer_status_page
    }


    //////////////////////////////////////////////
    /// TOOL: GDD Calculator
    //////////////////////////////////////////////
    // Gdd base selection
    // For Components: GddBaseSelect
    @observable gddtool_base='50';
    @action gddtool_setBase = (e) => {
            this.gddtool_base = e.target.value
            this.gddtool_downloadData()
        }
    @action gddtool_setBaseManually = (v) => {
            this.gddtool_base = v
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
      this.gddtool_setClimateSummary()
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
        // data_by_date will hold data for all years that will be included in averages/max/min
        let data_by_date = {}
        // data_by_date_for_obs will hold data only for the current planting year selection
        let data_by_date_for_obs = {}
        let time_obj
        let isLeapYear = moment([year_planting]).isLeapYear()
        let yearsMissing=[]

        // find years with missing data - these years are held in yearsMissing
        for (var i = 0, len = data.length; i < len; i++) {
            time_obj = moment(data[i][0],'YYYY-MM-DD')
            let year = time_obj.format('YYYY')
            let numMiss = data[i][1][1]
            if (numMiss>10) {
                if (!yearsMissing.includes(year)) { yearsMissing.push(year) }
            }
        };

        // format data into object by date
        for (i = 0, len = data.length; i < len; i++) {
            time_obj = moment(data[i][0],'YYYY-MM-DD')
            let year = time_obj.format('YYYY')
            let month = time_obj.format('MM')
            let day = time_obj.format('DD')
            let month_day = month+'-'+day
            if (month_day===this.getPlantingDate.format('MM')+'-'+this.getPlantingDate.format('DD')) { idxPlantingDate = i };

            // first, data for current planting year selected
            if (year===year_planting) {
              if (month_day>=this.getPlantingDate.format('MM')+'-'+this.getPlantingDate.format('DD')) {
                if (!data_by_date_for_obs.hasOwnProperty(month_day)) { data_by_date_for_obs[month_day] = {} };
                if ((data[i][1][1]===0) && (data[i][1][0] !== -999) && (data[idxPlantingDate][1][0] !== -999) && (data[i][1][0] !== 'M') && (data[idxPlantingDate][1][0] !=='M')) {
                    data_by_date_for_obs[month_day][year] = data[i][1][0] - data[idxPlantingDate][1][0];
                } else {
                    data_by_date_for_obs[month_day][year] = NaN
                }
              };
            }

            // next, data used for averages and extremes
            if (yearsMissing.includes(year)) { continue }
            if (month_day>=this.getPlantingDate.format('MM')+'-'+this.getPlantingDate.format('DD')) {
                if (!data_by_date.hasOwnProperty(month_day)) { data_by_date[month_day] = {} };
                if ((data[i][1][0] !== -999) && (data[idxPlantingDate][1][0] !== -999) && (data[i][1][0] !== 'M') && (data[idxPlantingDate][1][0] !=='M')) {
                    data_by_date[month_day][year] = data[i][1][0] - data[idxPlantingDate][1][0];
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
        datesArray.forEach(function (d) {
            // skip 2/29 if its not a leap year
            if (d==='02-29' && !isLeapYear) { return }

            // get array of all years observing this date
            let yearsArray = Object.keys(data_by_date[d])

            // get obs array: for this planting year
            if (data_by_date_for_obs.hasOwnProperty(d)) {
              if (data_by_date_for_obs[d].hasOwnProperty(year_planting)) {
                obs = data_by_date_for_obs[d][year_planting];
              } else {
                obs = NaN;
              }
            } else {
              obs = NaN;
            }

            // get ave array: POR ave
            let ave_data = []
            yearsArray.forEach(function (y) {
                if (y!==this_year.toString()) {
                    if (isNaN(data_by_date[d][y])===false) { ave_data.push(data_by_date[d][y]) }
                }
            });
            ave = (ave_data.length<5) ? NaN : average(ave_data);

            // get recent array: 15-year ave
            let recent_data = []
            yearsArray.forEach(function (y) {
                if (y<=(parseInt(this_year,10)-1).toString()) {
                    if (isNaN(data_by_date[d][y])===false) { recent_data.push(data_by_date[d][y]) }
                }
            });
            recent = (recent_data.length < 15) ? NaN : average(recent_data.slice(0,15));
            // recent = (recent_data.length!==15) ? NaN : average(recent_data);

            // all year values (except current year) for this date
            let valArray = []
            yearsArray.forEach(function (y) {
                if (y!==this_year.toString()) {
                    if (isNaN(data_by_date[d][y])===false) { valArray.push(data_by_date[d][y]) }
                }
            });
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
                //"name":"gdd"+this.gddtool_getBase,
                "name":"gdd",
                "vN":23,
                "base":parseInt(this.gddtool_getBase,10),
                "interval":[0,0,1],
                "duration":"std",
                "season_start":[1,1],
                //"reduce":"sum",
                //"maxmissing":1
                "reduce":{"add":"mcnt","reduce":"sum"},
                //"maxmissing":0
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

    // GDD tool data download - set parameters
    @computed get getAcisParams_tscan() {
            let elems = [{
                //"name":"gdd"+this.gddtool_getBase,
                "name":"gdd",
		"vN":24,
                "base":parseInt(this.gddtool_getBase,10),
                "interval":[0,0,1],
                "duration":"std",
                "season_start":[1,1],
                //"reduce":"sum",
                //"maxmissing":1
                "reduce":{"add":"mcnt","reduce":"sum"},
                //"maxmissing":0
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
	let params = (this.getLocation.sid.split(' ')[1]==='17') ? this.getAcisParams : this.getAcisParams_tscan
        this.gddtool_setDataIsLoading(true);
        return axios
          .post('https://data.nrcc.rcc-acis.org/StnData', params)
          .then(res => {
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
            console.error(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }


    //////////////////////////////////////////////
    /// TOOL: Fruit tool
    //////////////////////////////////////////////
    // Fruit information needed for calculations
    @observable fruit_info={
        'pawpaw': {
            name: 'pawpaw',
            label: 'Pawpaw',
            startDateStr: '04-01',
            seasonStart: [4,1],
            gddBase: '50'
        },
        'blueberryGrowth': {
            name: 'blueberryGrowth',
            label: 'Lowbush Blueberry Growth',
            startDateStr: '04-01',
            seasonStart: [4,1],
            gddBase: '32'
        },
        'blueberryHarvest': {
            name: 'blueberryHarvest',
            label: 'Lowbush Blueberry Harvest',
            startDateStr: '05-01',
            seasonStart: [5,1],
            gddBase: '41'
        }
    };

    // Fruit tool Gdd base selection
    @observable fruittool_base='50';
    @action fruittool_setBase = (e) => {
            this.fruittool_base = e.target.value
            this.fruittool_downloadData()
        }
    @action fruittool_setBaseManually = (v) => {
            this.fruittool_base = v
            this.fruittool_downloadData()
        }
    @computed get fruittool_getBase() {
        return this.fruittool_base
    }

    @action fruittool_handleFruitSelect = (fruitName) => {
        this.setToolName(fruitName);
        this.fruittool_setBaseManually(this.fruit_info[fruitName].gddBase);
    }

    @action fruittool_setFruitFromRadioGroup = (t) => {
        // only update it fruit changed
        if (this.toolName !== t) {
            this.fruittool_handleFruitSelect(t);
        }
    }

    // climate data saved in this var
    // - the full request downloaded from ACIS
    @observable fruittool_climateData = {};
    @action fruittool_setClimateData = (startDate, gddBase, res) => {
        if (!this.fruittool_climateData.hasOwnProperty(startDate)) {
            this.fruittool_climateData[startDate] = {};
        }

        this.fruittool_climateData[startDate][gddBase] = res
    }
    @computed get fruittool_getClimateData() {
        const startDate = this.fruit_info[this.getToolName].startDateStr;
        const gddBase = this.fruittool_getBase;

        if (this.fruittool_climateData.hasOwnProperty(startDate) && this.fruittool_climateData[startDate].hasOwnProperty(gddBase)) {
            return this.fruittool_climateData[startDate][gddBase];
        } else {
            return null;
        }
    }

    // selected year in fruit tool
    @observable fruittool_selectedYear = this.latestSelectableYear;
    @action fruittool_setSelectedYear = (res) => {
        this.fruittool_selectedYear = res
    }
    @computed get fruittool_getSelectedYear() {
        return this.fruittool_selectedYear
    }

    @computed get fruittool_selectedYearMissing() {
        const selectedYear = this.fruittool_selectedYear;
        const selectedYearData = this.fruittool_climateSummary.data_by_year[selectedYear];
        return selectedYearData ? { percentMissing: selectedYearData.percentMissing, missing: selectedYearData.missing, days: selectedYearData.gddObs.length } : { percentMissing: 0, missing: 0, days: 0 };
    }

    @observable fruittool_climateSummary = {
        years_missing: [],
        years_included: [],
        data_by_year: {},
        summary_data: [{
            'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
            'ave': NaN,
            'max_por': NaN,
            'min_por': NaN,
            'max_minus_min': NaN,
        }]
    };
    @action fruittool_initClimateSummary = () => {
        this.fruittool_climateSummary = {
            years_missing: [],
            years_included: [],
            data_by_year: {},
            summary_data: [{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'ave': NaN,
                'max_por': NaN,
                'min_por': NaN,
                'max_minus_min': NaN,
            }]
        }
    }
    @action fruittool_setClimateSummary = () => {
        const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        const periodLen = 15;
        
        const data = this.fruittool_getClimateData;
        if (data === null) {
            this.fruittool_initClimateSummary();
            return;
        }

        const seasonStart = this.fruit_info[this.getToolName].startDateStr;
        
        const data_by_date = {};
        const data_by_year = {};
        const years_missing = [];
        
        // This flag is used to skip days until we get to the first full year of data
        let startCollecting = false;

        let currentYear = data[0][0].slice(0,4);
        let currentMissing = 0;
        let readyForFirstFreeze = false;
        data.forEach(([dateStr, [gddStr, numMissing], mintStr], i) => {
            const year = dateStr.slice(0,4);
            const mmdd = dateStr.slice(5);

            // On seasonStart reset flags and trackers and determine if the finished season is "missing"
            if (mmdd === seasonStart) {
                if (startCollecting) {
                    // If the last numMissing before the first freeze was more than 10, consider year missing
                    //      This pattern effectively only considers the active season
                    if (currentMissing > 10) {
                        years_missing.push(currentYear);
                    }
                    data_by_year[currentYear].missing = currentMissing;
                    const ffi = data_by_year[currentYear].firstFreezeIdx
                    data_by_year[currentYear].percentMissing = currentMissing / (ffi === null ? data_by_year[currentYear].gddObs.length : ffi) * 100;
                    currentMissing = 0;
                    readyForFirstFreeze = false;
                } else {
                    startCollecting = true;
                }
                currentYear = year;
            }
            
            // One and after seasonStart
            if (startCollecting && mmdd >= seasonStart) {
                // Make sure day is in object
                if (!Object.keys(data_by_date).includes(mmdd)) {
                    data_by_date[mmdd] = {};
                }

                // Make sure the year is in object
                if (!Object.keys(data_by_year).includes(year)) {
                    data_by_year[year] = { firstFreezeDate: null, firstFreezeIdx: null, lastSpringFreezeDate: null, lastSpringFreezeIdx: null, gddObs: [], missing: null };
                }
    
                // Parse GDD from ACIS into NaN or float
                const gdd = (gddStr === -999 || gddStr === 'M') ? NaN : parseFloat(gddStr);

                // If we have not yet passed the first freeze, find out how many days are missing
                if (data_by_year[year].firstFreezeDate === null) {
                    currentMissing = numMissing;
                }
    
                // Add GDD to date if not current year (because this object is used for calculating POR and Recent stats where we do not include the current year)
                if (year.toString() !== this.latestSelectableYear.toString()) {
                    data_by_date[mmdd][year] = gdd;
                }
                
                // Check if we should start looking for freezing temperatures
                if (mmdd === '07-01') {
                    readyForFirstFreeze = true;
                }
                
                // Parse mint and determine if first freeze, store date if yes
                const mint = parseFloat(mintStr);
                if (readyForFirstFreeze && data_by_year[year].firstFreezeDate === null && mint < 32) {
                    data_by_year[year].firstFreezeDate = year + '-' + mmdd;
                    data_by_year[year].firstFreezeIdx = data_by_year[year].gddObs.length;
                }

                if (!readyForFirstFreeze && mint < 32) {
                    data_by_year[year].lastSpringFreezeDate = year + '-' + mmdd;
                    data_by_year[year].lastSpringFreezeIdx = data_by_year[year].gddObs.length;
                }

                data_by_year[year].gddObs.push(gdd);
            }

            if (i === data.length - 1) {
                data_by_year[currentYear].missing = currentMissing;
                const ffi = data_by_year[currentYear].firstFreezeIdx
                data_by_year[currentYear].percentMissing = currentMissing / (ffi === null ? data_by_year[currentYear].gddObs.length : ffi) * 100;
            }
        });        
        
        // get a sorted array of keys
        const datesArray = Object.keys(data_by_date)
        datesArray.sort();

        
        const years_included = Array.from({ length: periodLen }, (_, i) => parseInt(this.latestSelectableYear) - i - 1).filter(y => !years_missing.includes(y))
        const summary_data = [];
        datesArray.forEach(function (d) {
            // skip until seasonStart
            if (d < seasonStart) { return }

            const annualDayData = [];
            const ys = [];
            years_included.forEach(function (y) {
                if (!years_missing.includes(String(y)) && isNaN(data_by_date[d][y])===false) {
                    ys.push(y);
                    annualDayData.push(data_by_date[d][y]);
                }
            });

            let por_min, por_max, por_avg, por_max_minus_min;
            if (annualDayData.length<5) {
                por_min = NaN;
                por_max = NaN;
                por_avg = NaN;
                por_max_minus_min = NaN;
            } else {
                por_min = Math.min(...annualDayData);
                por_max = Math.max(...annualDayData);
                por_max_minus_min = por_max - por_min;
                por_avg = average(annualDayData);
            }

            // data summary
            summary_data.push({
                'date': d,
                'ave': parseInt(por_avg,10),
                'max_por': parseInt(por_max,10),
                'min_por': parseInt(por_min,10),
                'max_minus_min': parseInt(por_max_minus_min,10),
            })
        });

        this.fruittool_climateSummary = {
            summary_data,
            years_missing,
            years_included,
            data_by_year
        };
    }
    @computed get fruittool_getClimateSummaryYearsInPOR() {
        return this.fruittool_climateSummary.years_included;
    }
    
    @computed get fruittool_getClimateSummary() {
        const springFreezes = this.fruittool_getLastSpringFreezes;
        const selectedYear = this.fruittool_selectedYear;
        const selectedYearObs = selectedYear in this.fruittool_climateSummary.data_by_year ? this.fruittool_climateSummary.data_by_year[selectedYear].gddObs : [];
        const dataWithObs = this.fruittool_climateSummary.summary_data.map((summary_obj, i) => {
          const newObj = {...summary_obj};
          if (springFreezes && newObj.date in springFreezes) {
            newObj.springFreezes = { num: -springFreezes[newObj.date].length, label: springFreezes[newObj.date].toSorted().join(',\u00A0') };
          } else {
            newObj.springFreezes = { num: 0, label: '' };
          }
          newObj.date = selectedYear + '-' + newObj.date;
          newObj.obs = selectedYearObs.length <= i ? NaN : selectedYearObs[i];
          return newObj;
        });
        
        return dataWithObs
    }

    @computed get fruittool_getHistoricalSummary() {
        const fruitInfo = {
            pawpaw: [{
                key: 'veryEarly',
                range: [2400,2499],
            },{
                key: 'early',
                range: [2500,2599],
            },{
                key: 'middle',
                range: [2600,2699],
            },{
                key: 'late',
                range: [2700,2799],
            },{
                key: 'veryLate',
                range: [2800,2899],
            }],
            blueberryGrowth: [{
                key: 'flowering',
                range: [390,390],
            },{
                key: 'fruiting',
                range: [600,600],
            }],
            blueberryHarvest: [{
                key: 'optimal',
                range: [1000,1300],
            }]
        };
        
        const data = this.fruittool_climateSummary.data_by_year;
        const info = fruitInfo[this.getToolName];
        const isScatter = this.getToolName === 'blueberryGrowth';
        const years = Object.keys(data);
        years.sort();
        
        const results = years.map(year => {
            const { firstFreezeDate, firstFreezeIdx, gddObs, percentMissing } = data[year];
            
            let categories = {};
            if (percentMissing >= 25) {
                categories['transparent'] = 0;
                for (const infoObj of info) {
                    categories[infoObj.key] = 0;
                }
            } else {
                let lastIdx = gddObs.findIndex(v => info[0].range[0] <= v);
                categories['transparent'] = lastIdx;
    
                for (const infoObj of info) {
                    const v = infoObj.range[1] === Infinity ? gddObs.length - 1 : gddObs.findIndex(v => infoObj.range[1] <= v);
                    if (isScatter && v >= 0) {
                        categories[infoObj.key] = v;
                    } else if (firstFreezeIdx !== null && (v < 0 || firstFreezeIdx < v)) {
                        categories[infoObj.key] = firstFreezeIdx - lastIdx;
                        lastIdx = firstFreezeIdx;
                    } else if (firstFreezeIdx === null && v < 0) {
                        categories[infoObj.key] = gddObs.length - 1 - lastIdx;
                        lastIdx = gddObs.length - 1;
                    } else {
                        categories[infoObj.key] = v - lastIdx;
                        lastIdx = v;
                    }
                }
            }

            return {
                year,
                firstFreezeDate: percentMissing >= 25 ? null : firstFreezeDate,
                firstFreezeIdx: percentMissing >= 25 ? null : firstFreezeIdx,
                isComplete: gddObs.length === 275,
                isMissing: percentMissing >= 2.5,
                percentMissing: percentMissing,
                isScatter,
                categories
            };
        });

        const firstToShow = results.findIndex(d => d.percentMissing < 25);
        return results.slice(firstToShow);
    }

    @computed get fruittool_getYearOptions() {
        const years = Object.keys(this.fruittool_climateSummary.data_by_year).filter(year => this.fruittool_climateSummary.data_by_year[year].percentMissing < 25);
        years.sort((a,b) => b-a);
        return years;
    }
    
    @computed get fruittool_getSelectedYearFirstFreeze() {
        const selectedYear = this.fruittool_selectedYear;
        const selectedYearFirstFreeze = selectedYear in this.fruittool_climateSummary.data_by_year ? this.fruittool_climateSummary.data_by_year[selectedYear].firstFreezeDate : null;
        return selectedYearFirstFreeze;
    }
    
    @computed get fruittool_getLastSpringFreezes() {
        const years = this.fruittool_getYearOptions;
        return years.reduce((acc,y) => {
            const yearLastSpringFreezeDate = this.fruittool_climateSummary.data_by_year[y].lastSpringFreezeDate;
            if (yearLastSpringFreezeDate) {
                const mmdd = yearLastSpringFreezeDate.slice(5);
                if (!(mmdd in acc)) {
                    acc[mmdd] = [];
                }
                acc[mmdd].push(y)
            }
            return acc;
        }, {});
    }
    
    // Fruit tool data download - set parameters
    @computed get fruit_getAcisParams() {
        const seasonStart = this.fruit_info[this.getToolName].seasonStart;
        
        let elems = [{
                "name":"gdd",
                "vN":23,
                "base":parseInt(this.fruittool_getBase,10),
                "interval":[0,0,1],
                "duration":"std",
                "season_start":seasonStart,
                "reduce":{"add": "mcnt", "reduce": "sum"},
            },{
                "vX":2,"vN":23,"interval":[0,0,1],"duration":"dly" // daily mint
            }]

            return {
                    "sid":this.getLocation.sid,
                    "sdate":"por",
                    "edate": "por",
                    "elems":elems
                }
        }

    // Fruit tool data download - set parameters
    @computed get fruit_getAcisParams_tscan() {
            const seasonStart = this.fruit_info[this.getToolName].seasonStart;


            let elems = [{
                "name":"gdd",
                "vN":24,
                "base":parseInt(this.fruittool_getBase,10),
                "interval":[0,0,1],
                "duration":"std",
                "season_start":seasonStart,
                "reduce":{"add": "mcnt", "reduce": "sum"},
            },{
                "vX":2,"vN":24,"interval":[0,0,1],"duration":"dly" // daily mint
            }]

            return {
                    "sid":this.getLocation.sid,
                    "sdate":"por",
                    "edate":"por",
                    "elems":elems
                }
        }

    // data is loading - boolean - to control the spinner
    @observable fruittool_dataIsLoading = false
    @action fruittool_setDataIsLoading = (b) => {
        this.fruittool_dataIsLoading = b;
    }
    @computed get fruittool_getDataIsLoading() {
        return this.fruittool_dataIsLoading;
    }

    // Fruit tool data download - download data using parameters
    @action fruittool_downloadData = () => {
        if (this.fruit_info.hasOwnProperty(this.getToolName)) {
            const startDate = this.fruit_info[this.getToolName].startDateStr;
            const gddBase = this.fruittool_getBase;
    
            this.fruittool_setDataIsLoading(true);
            let params = (this.getLocation.sid.split(' ')[1]==='17') ? this.fruit_getAcisParams : this.fruit_getAcisParams_tscan
            return axios
                .post('https://data.nrcc.rcc-acis.org/StnData', params)
                .then(res => {
                if (res.data.hasOwnProperty('error')) {
                    this.fruittool_setClimateData(startDate, gddBase, null);
                    this.fruittool_initClimateSummary()
                } else {
                    this.fruittool_setClimateData(startDate, gddBase, res.data.data.slice(0));
                    this.fruittool_setClimateSummary()
                }
                this.fruittool_setDataIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                });
        }
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

    @observable wxgraph_tempThreshold='90';
    @action wxgraph_setTempThreshold = (v) => {
            if (this.wxgraph_getTempThreshold!==v) {
                this.wxgraph_tempThreshold = v
                if (this.getToolName==='wxgrapher') {this.wxgraph_downloadData()}
            }
        }
    @computed get wxgraph_getTempThreshold() {
        return this.wxgraph_tempThreshold
    }

    @observable wxgraph_precipThreshold='2';
    @action wxgraph_setPrecipThreshold = (v) => {
            if (this.wxgraph_getPrecipThreshold!==v) {
                this.wxgraph_precipThreshold = v
                if (this.getToolName==='wxgrapher') {this.wxgraph_downloadData()}
            }
        }
    @computed get wxgraph_getPrecipThreshold() {
        return this.wxgraph_precipThreshold
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
            winddir : false,
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
            humidity_label : (this.wxgraph_getTimeFrame!=='two_days') ? 'Relative Humidity *' : 'Relative Humidity',
            solarrad_label : 'Solar Radiation',
            wind_label : 'Wind Speed',
            winddir_label : (this.wxgraph_getTimeFrame!=='two_days') ? 'Wind Direction *' : 'Wind Direction',
            leafwet_label : (this.wxgraph_getTimeFrame!=='two_days') ? 'Leaf Wetness *' : 'Leaf Wetness',
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
            solarrad_units : (this.wxgraph_getTimeFrame==='two_days') ? 'Wm⁻²' : 'langleys',
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
    //     solar : total solar radiation for day Wm⁻² for hourly inst, langleys for daily sum)
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
        let network = this.getLocation.sid.split(' ')[1]
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
                // leaf wetness not available daily+ ?
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
                // leaf wetness not available daily+ ?
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
                    // leaf wetness not available daily+ ?
                    'leafwet':NaN,
                  })
              } else {
                  dataObjArray_extremes.push({
                    'date':d[0],
                    'cnt_t':(d[1]==='M') ? NaN : parseInt(d[1],10),
                    'cnt_p':(d[2]==='M') ? NaN : parseInt(d[2],10),
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
                  if (network==='19') {
                    dataObjArray_hours.push({
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
                      'leafwet':(d[20][23]==='M' || parseFloat(d[20][23])<0.0) ? NaN : parseFloat(d[20][23]).toFixed(0),
                    })
                  } else {
                    dataObjArray_hours.push({
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
                  }
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
                      if (network==='19') {
                        dataObjArray_hours.push({
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
                          'leafwet':(d[20][i]==='M' || parseFloat(d[20][i])<0.0) ? NaN : parseFloat(d[20][i]).toFixed(0),
                        })
                      } else {
                        dataObjArray_hours.push({
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
		      if (network==='19') {
                        dataObjArray_hours.push({
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
                          'leafwet':(d[20][i]==='M' || parseFloat(d[20][i])<0.0) ? NaN : parseFloat(d[20][i]).toFixed(0),
                        })
                      } else {
                        dataObjArray_hours.push({
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
    @action wxgraph_setTimeFrameFromRadioGroup = (t) => {
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
    @action wxgraph_setUnitsTempFromRadioGroup = (t) => {
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
    @action wxgraph_setUnitsPrcpFromRadioGroup = (u) => {
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
                    {"name":"avgt","vN":23,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily average temperature, ave
                    {"vX":1,"vN":23,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily maximum temperature, max
                    {"vX":2,"vN":23,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily minimum temperature, min
                    {"vX":4,"vN":22,"interval":[0,0,1],"duration":"dly","units":unitsPrcp}, // daily precipitation, sum
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
                    {"vX":70,"vN":5,"interval":[0,0,1],"duration":"dly"}, // daily solar radiation, sum
                    {"vX":77,"vN":5,"interval":[0,0,1],"duration":"dly"}, // daily wind speed, maximum, max
                    {"vX":89,"vN":6,"interval":[0,0,1],"duration":"dly"}, // daily wind speed, average, ave
                    {"vX":101,"vN":1,"interval":[0,0,1],"duration":"dly"}, // daily wind direction, average, ave
                ]
                numdays=-60
            } else if (this.wxgraph_getTimeFrame==='two_years') {
                elems = [
                    {"name":"avgt","vN":23,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly average temperature, ave
                    {"vX":1,"vN":23,"interval":[0,1],"duration":"mly","reduce":{"reduce":"max"},"maxmissing":3,"units":unitsTemp}, // monthly maximum temperature, max
                    {"vX":2,"vN":23,"interval":[0,1],"duration":"mly","reduce":{"reduce":"min"},"maxmissing":3,"units":unitsTemp}, // monthly minimum temperature, min
                    {"vX":4,"vN":22,"interval":[0,1],"duration":"mly","reduce":{"reduce":"sum"},"maxmissing":3,"units":unitsPrcp}, // monthly precipitation, sum
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
                    {"vX":70,"vN":5,"interval":[0,1],"duration":"mly","reduce":{"reduce":"sum"},"maxmissing":3}, // monthly solar radiation, sum
                    {"vX":77,"vN":5,"interval":[0,1],"duration":"mly","reduce":{"reduce":"max"},"maxmissing":3}, // monthly wind speed, maximum, max
                    {"vX":89,"vN":6,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly wind speed, average, ave
                    {"vX":101,"vN":1,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly wind direction, average, ave
                ]
                numdays=-730
            } else if (this.wxgraph_getTimeFrame==='por') {
                //if (!this.wxgraph_getExtSwitch) {
                if (!this.wxgraph_getExtSwitch) {
                    elems = [
                        {"name":"avgt","vN":23,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp},
                        {"vX":1,"vN":23,"interval":[1],"duration":"yly","reduce":{"reduce":"max"},"maxmissing":10,"units":unitsTemp}, // annual maximum temperature, max
                        {"vX":2,"vN":23,"interval":[1],"duration":"yly","reduce":{"reduce":"min"},"maxmissing":10,"units":unitsTemp}, // annual minimum temperature, min
                        {"vX":4,"vN":22,"interval":[1],"duration":"yly","reduce":{"reduce":"sum"},"maxmissing":10,"units":unitsPrcp}, // annual precipitation, sum
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
                        {"vX":70,"vN":5,"interval":[1],"duration":"yly","reduce":{"reduce":"sum"},"maxmissing":10}, // annual solar radiation, sum
                        {"vX":77,"vN":5,"interval":[1],"duration":"yly","reduce":{"reduce":"max"},"maxmissing":10}, //annual wind speed, maximum, max
                        {"vX":89,"vN":6,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, //annual wind speed, average, ave
                        {"vX":101,"vN":1,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, //annual wind direction, average, ave
                    ]
                } else {
                    elems = [
                        {"vX":1,"vN":23,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_"+this.wxgraph_getTempThreshold},"maxmissing":10}, // number of days > F, count
                        {"vX":4,"vN":22,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_"+this.wxgraph_getPrecipThreshold},"maxmissing":10}, // number of days > ", count
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

    // Wx Grapher tool data download - set parameters
    @computed get wxgraph_getAcisParams_tscan() {
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
                    {"vX":120,"vN":71, "units":unitsTemp}, //hourly soil temperature @ 2", inst
                    {"vX":120,"vN":103, "units":unitsTemp}, //hourly soil temperature @ 4", inst
                    {"vX":120,"vN":167, "units":unitsTemp}, //hourly soil temperature @ 8", inst
                    {"vX":120,"vN":295, "units":unitsTemp}, //hourly soil temperature @ 20", inst
                    {"vX":120,"vN":327, "units":unitsTemp}, //hourly soil temperature @ 40", inst
                    {"vX":104,"vN":69}, //hourly soil moisture @ 2", ave
                    {"vX":104,"vN":101}, //hourly soil moisture @ 4", ave
                    {"vX":104,"vN":165}, //hourly soil moisture @ 8", ave
                    {"vX":104,"vN":293}, //hourly soil moisture @ 20", ave
                    {"vX":104,"vN":325}, //hourly soil moisture @ 40", ave
                    {"vX":24}, //hourly relative humidity, inst
                    {"vX":149}, //hourly solar radiation, ave
                    {"vX":42}, //hourly wind speed, peak, max
                    {"vX":128}, //hourly wind speed, average, ave
                    {"vX":130}, //hourly wind direction, average, ave
                    {"vX":118,"vN":9}, //hourly leaf wetness, sum, minutes
                ]
                numdays=-3
            } else if (this.wxgraph_getTimeFrame==='two_months') {
                elems = [
                    {"name":"avgt","vN":24,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily average temperature, ave
                    {"vX":1,"vN":24,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily maximum temperature, max
                    {"vX":2,"vN":24,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily minimum temperature, min
                    {"vX":4,"vN":23,"interval":[0,0,1],"duration":"dly","units":unitsPrcp}, // daily precipitation, sum
                    {"vX":69,"vN":68,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 2", ave
                    {"vX":69,"vN":100,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 4", ave
                    {"vX":69,"vN":164,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 8", ave
                    {"vX":69,"vN":292,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 20", ave
                    {"vX":69,"vN":324,"interval":[0,0,1],"duration":"dly","units":unitsTemp}, // daily soil temperature @ 40", ave
                    {"vX":68,"vN":66,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 2", ave
                    {"vX":68,"vN":98,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 4", ave
                    {"vX":68,"vN":162,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 8", ave
                    {"vX":68,"vN":290,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 20", ave
                    {"vX":68,"vN":322,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 40", ave
                    //{"vX":71,"interval":[0,0,1],"duration":"dly"}, // daily relative humidity, ave
                    {"vX":70,"vN":6,"interval":[0,0,1],"duration":"dly"}, // daily solar radiation, sum
                    {"vX":77,"vN":6,"interval":[0,0,1],"duration":"dly"}, // daily wind speed, maximum, max
                    {"vX":89,"vN":7,"interval":[0,0,1],"duration":"dly"}, // daily wind speed, average, ave
                    {"vX":101,"vN":2,"interval":[0,0,1],"duration":"dly"}, // daily wind direction, average, ave
                    //{"vX":118,"vN":9,"interval":[0,0,1],"duration":"dly"}, // daily leaf wetness, sum, minutes
                ]
                numdays=-60
            } else if (this.wxgraph_getTimeFrame==='two_years') {
                elems = [
                    {"name":"avgt","vN":24,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly average temperature, ave
                    {"vX":1,"vN":24,"interval":[0,1],"duration":"mly","reduce":{"reduce":"max"},"maxmissing":3,"units":unitsTemp}, // monthly maximum temperature, max
                    {"vX":2,"vN":24,"interval":[0,1],"duration":"mly","reduce":{"reduce":"min"},"maxmissing":3,"units":unitsTemp}, // monthly minimum temperature, min
                    {"vX":4,"vN":23,"interval":[0,1],"duration":"mly","reduce":{"reduce":"sum"},"maxmissing":3,"units":unitsPrcp}, // monthly precipitation, sum
                    {"vX":69,"vN":68,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 2", ave
                    {"vX":69,"vN":100,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 4", ave
                    {"vX":69,"vN":164,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 8", ave
                    {"vX":69,"vN":292,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 20", ave
                    {"vX":69,"vN":324,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3,"units":unitsTemp}, // monthly soil temperature @ 40", ave
                    {"vX":68,"vN":66,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 2", ave
                    {"vX":68,"vN":98,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 4", ave
                    {"vX":68,"vN":162,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 8", ave
                    {"vX":68,"vN":290,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 20", ave
                    {"vX":68,"vN":322,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly soil moisture @ 40", ave
                    //{"vX":71,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly relative humidity, ave
                    {"vX":70,"vN":6,"interval":[0,1],"duration":"mly","reduce":{"reduce":"sum"},"maxmissing":3}, // monthly solar radiation, sum
                    {"vX":77,"vN":6,"interval":[0,1],"duration":"mly","reduce":{"reduce":"max"},"maxmissing":3}, // monthly wind speed, maximum, max
                    {"vX":89,"vN":7,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly wind speed, average, ave
                    {"vX":101,"vN":2,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly wind direction, average, ave
                    //{"vX":118,"vN":9,"interval":[0,1],"duration":"mly","reduce":{"reduce":"mean"},"maxmissing":3}, // monthly leaf wetness, ave, minutes/day
                ]
                numdays=-730
            } else if (this.wxgraph_getTimeFrame==='por') {
                //if (!this.wxgraph_getExtSwitch) {
                if (!this.wxgraph_getExtSwitch) {
                    elems = [
                        {"name":"avgt","vN":24,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp},
                        {"vX":1,"vN":24,"interval":[1],"duration":"yly","reduce":{"reduce":"max"},"maxmissing":10,"units":unitsTemp}, // annual maximum temperature, max
                        {"vX":2,"vN":24,"interval":[1],"duration":"yly","reduce":{"reduce":"min"},"maxmissing":10,"units":unitsTemp}, // annual minimum temperature, min
                        {"vX":4,"vN":23,"interval":[1],"duration":"yly","reduce":{"reduce":"sum"},"maxmissing":10,"units":unitsPrcp}, // annual precipitation, sum
                        {"vX":69,"vN":68,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 2", ave
                        {"vX":69,"vN":100,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 4", ave
                        {"vX":69,"vN":164,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 8", ave
                        {"vX":69,"vN":292,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 20", ave
                        {"vX":69,"vN":324,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10,"units":unitsTemp}, // annual soil temperature @ 40", ave
                        {"vX":68,"vN":66,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 2", ave
                        {"vX":68,"vN":98,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 4", ave
                        {"vX":68,"vN":162,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 8", ave
                        {"vX":68,"vN":290,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 20", ave
                        {"vX":68,"vN":322,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual soil moisture @ 40", ave
                        //{"vX":71,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, // annual relative humidity, ave
                        {"vX":70,"vN":6,"interval":[1],"duration":"yly","reduce":{"reduce":"sum"},"maxmissing":10}, // annual solar radiation, sum
                        {"vX":77,"vN":6,"interval":[1],"duration":"yly","reduce":{"reduce":"max"},"maxmissing":10}, //annual wind speed, maximum, max
                        {"vX":89,"vN":7,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, //annual wind speed, average, ave
                        {"vX":101,"vN":2,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, //annual wind direction, average, ave
                        //{"vX":118,"vN":9,"interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10}, //annual leaf wetness, average, minutes/day
                    ]
                } else {
                    elems = [
                        {"vX":1,"vN":24,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_"+this.wxgraph_getTempThreshold},"maxmissing":10}, // number of days > F, count
                        {"vX":4,"vN":23,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_gt_"+this.wxgraph_getPrecipThreshold},"maxmissing":10}, // number of days > ", count
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
        let params = (this.getLocation.sid.split(' ')[1]==='17') ? this.wxgraph_getAcisParams : this.wxgraph_getAcisParams_tscan
        this.wxgraph_setDataIsLoading(true);
        return axios
          .post('https://data.nrcc.rcc-acis.org/StnData', params)
          .then(res => {
            if (res.data.hasOwnProperty('error')) {
                this.wxgraph_setClimateData(null);
                this.wxgraph_initClimateSummary()
            } else {
                this.wxgraph_setClimateData(res.data.data.slice(0));
                this.wxgraph_setClimateSummary()
            }
            this.wxgraph_setDataIsLoading(false);
          })
          .catch(err => {
            console.error(
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

    @observable explorer_dailyClimateData = null;
    @action explorer_setDailyClimateData = (res) => {
        this.explorer_dailyClimateData = res
    }
    @computed get explorer_getDailyClimateData() {
        return this.explorer_dailyClimateData
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
    //     solar : total solar radiation for day (Wm⁻² for hourly inst, langleys for daily sum)
    //     wind : average wind speed for day (mph)
    //     leafwet : average leaf wetness for day (minutes)
    @observable explorer_latestConditions = {
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt':'M',
                'maxt':'M',
                'mint':'M',
                'pcpn':'M',
                'soilt2in':'M',
                'soilt4in':'M',
                'soilt8in':'M',
                'soilt20in':'M',
                'soilt40in':'M',
                'soilm2in':'M',
                'soilm4in':'M',
                'soilm8in':'M',
                'soilm20in':'M',
                'soilm40in':'M',
                'humid':'M',
                'solar':'M',
                'windspdmax':'M',
                'windspdave':'M',
                'winddirave':'M',
                'leafwet':'M',
                'avgt_last': 'M',
                'maxt_last': 'M',
                'mint_last': 'M',
                'pcpn_last': 'M',
                'soilt2in_last': 'M',
                'soilt4in_last': 'M',
                'soilt8in_last': 'M',
                'soilt20in_last': 'M',
                'soilt40in_last': 'M',
                'soilm2in_last': 'M',
                'soilm4in_last': 'M',
                'soilm8in_last': 'M',
                'soilm20in_last': 'M',
                'soilm40in_last': 'M',
                'humid_last': 'M',
                'solar_last': 'M',
                'windspdmax_last': 'M',
                'windspdave_last': 'M',
                'winddirave_last': 'M'
        };

    @action explorer_initLatestConditions = () => {
        let dataObjOut = {
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt':'M',
                'maxt':'M',
                'mint':'M',
                'pcpn':'M',
                'soilt2in':'M',
                'soilt4in':'M',
                'soilt8in':'M',
                'soilt20in':'M',
                'soilt40in':'M',
                'soilm2in':'M',
                'soilm4in':'M',
                'soilm8in':'M',
                'soilm20in':'M',
                'soilm40in':'M',
                'humid':'M',
                'solar':'M',
                'windspdmax':'M',
                'windspdave':'M',
                'winddirave':'M',
                'leafwet':'M',
                'avgt_last': 'M',
                'maxt_last': 'M',
                'mint_last': 'M',
                'pcpn_last': 'M',
                'soilt2in_last': 'M',
                'soilt4in_last': 'M',
                'soilt8in_last': 'M',
                'soilt20in_last': 'M',
                'soilt40in_last': 'M',
                'soilm2in_last': 'M',
                'soilm4in_last': 'M',
                'soilm8in_last': 'M',
                'soilm20in_last': 'M',
                'soilm40in_last': 'M',
                'humid_last': 'M',
                'solar_last': 'M',
                'windspdmax_last': 'M',
                'windspdave_last': 'M',
                'winddirave_last': 'M',
                'soilm_last': '--',
                'soilt_last': '--',
            };
        this.explorer_latestConditions = dataObjOut
    }

    @action explorer_setLatestConditions = () => {
        let data = this.explorer_getClimateData;
        let dataObjOut = {
                'date': 'M',
                'avgt':'M',
                'maxt':'M',
                'mint':'M',
                'pcpn':'M',
                'soilt2in':'M',
                'soilt4in':'M',
                'soilt8in':'M',
                'soilt20in':'M',
                'soilt40in':'M',
                'soilm2in':'M',
                'soilm4in':'M',
                'soilm8in':'M',
                'soilm20in':'M',
                'soilm40in':'M',
                'humid':'M',
                'solar':'M',
                'windspdmax':'M',
                'windspdave':'M',
                'winddirave':'M',
                'leafwet':'M',
                'avgt_last': 'M',
                'maxt_last': 'M',
                'mint_last': 'M',
                'pcpn_last': 'M',
                'soilt2in_last': 'M',
                'soilt4in_last': 'M',
                'soilt8in_last': 'M',
                'soilt20in_last': 'M',
                'soilt40in_last': 'M',
                'soilm2in_last': 'M',
                'soilm4in_last': 'M',
                'soilm8in_last': 'M',
                'soilm20in_last': 'M',
                'soilm40in_last': 'M',
                'humid_last': 'M',
                'solar_last': 'M',
                'windspdmax_last': 'M',
                'windspdave_last': 'M',
                'winddirave_last': 'M',
                'soilm_last': '--',
                'soilt_last': '--',
            };
        let i, dateToday, numHours, numFutureMissingHours;
        let formattedHourString
        data.forEach(function (d, idx) {
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
                      'solar':(d[16][i]==='M' || parseFloat(d[16][i])<0.0) ? 'M' : parseFloat(d[16][i]).toFixed(1).toString()+' Wm⁻²',
                      'windspdmax':(d[17][i]==='M' || parseFloat(d[17][i])<0.0) ? 'M' : parseFloat(d[17][i]).toFixed(1).toString()+' mph',
                      'windspdave':(d[18][i]==='M' || parseFloat(d[18][i])<0.0) ? 'M' : parseFloat(d[18][i]).toFixed(1).toString()+' mph',
                      'winddirave':(d[19][i]==='M' || parseFloat(d[19][i])<0.0 || parseFloat(d[4][i])>360.0) ? 'M' : parseFloat(d[19][i]).toFixed(0).toString()+String.fromCharCode(176),
                      'leafwet':'M',
                      'avgt_last':(d[1][i]==='M') ? ('avgt_last' in dataObjOut ? dataObjOut.avgt_last : 'M') : formattedHourString,
                      'maxt_last':(d[2][i]==='M') ? ('maxt_last' in dataObjOut ? dataObjOut.maxt_last : 'M') : formattedHourString,
                      'mint_last':(d[3][i]==='M') ? ('mint_last' in dataObjOut ? dataObjOut.mint_last : 'M') : formattedHourString,
                      'pcpn_last':(d[4][i]==='M') ? ('pcpn_last' in dataObjOut ? dataObjOut.pcpn_last : 'M') : formattedHourString,
                      'soilt2in_last':(d[5][i]==='M') ? ('soilt2in_last' in dataObjOut ? dataObjOut.soilt2in_last : 'M') : formattedHourString,
                      'soilt4in_last':(d[6][i]==='M') ? ('soilt4in_last' in dataObjOut ? dataObjOut.soilt4in_last : 'M') : formattedHourString,
                      'soilt8in_last':(d[7][i]==='M') ? ('soilt8in_last' in dataObjOut ? dataObjOut.soilt8in_last : 'M') : formattedHourString,
                      'soilt20in_last':(d[8][i]==='M') ? ('soilt20in_last' in dataObjOut ? dataObjOut.soilt20in_last : 'M') : formattedHourString,
                      'soilt40in_last':(d[9][i]==='M') ? ('soilt40in_last' in dataObjOut ? dataObjOut.soilt40in_last : 'M') : formattedHourString,
                      'soilm2in_last':(d[10][i]==='M') ? ('soilm2in_last' in dataObjOut ? dataObjOut.soilm2in_last : 'M') : formattedHourString,
                      'soilm4in_last':(d[11][i]==='M') ? ('soilm4in_last' in dataObjOut ? dataObjOut.soilm4in_last : 'M') : formattedHourString,
                      'soilm8in_last':(d[12][i]==='M') ? ('soilm8in_last' in dataObjOut ? dataObjOut.soilm8in_last : 'M') : formattedHourString,
                      'soilm20in_last':(d[13][i]==='M') ? ('soilm20in_last' in dataObjOut ? dataObjOut.soilm20in_last : 'M') : formattedHourString,
                      'soilm40in_last':(d[14][i]==='M') ? ('soilm40in_last' in dataObjOut ? dataObjOut.soilm40in_last : 'M') : formattedHourString,
                      'humid_last':(d[15][i]==='M') ? ('humid_last' in dataObjOut ? dataObjOut.humid_last : 'M') : formattedHourString,
                      'solar_last':(d[16][i]==='M') ? ('solar_last' in dataObjOut ? dataObjOut.solar_last : 'M') : formattedHourString,
                      'windspdmax_last':(d[17][i]==='M') ? ('windspdmax_last' in dataObjOut ? dataObjOut.windspdmax_last : 'M') : formattedHourString,
                      'windspdave_last':(d[18][i]==='M') ? ('windspdave_last' in dataObjOut ? dataObjOut.windspdave_last : 'M') : formattedHourString,
                      'winddirave_last':(d[19][i]==='M') ? ('winddirave_last' in dataObjOut ? dataObjOut.winddirave_last : 'M') : formattedHourString,
                      'soilm_last': '--',
                      'soilt_last': '--',
                  }
              }
        })
        this.explorer_latestConditions = dataObjOut;
    }

    @computed get explorer_getLatestConditions() {
        return this.explorer_latestConditions
    }

    @observable explorer_latestDailyConditions = {
            'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
            'avgt_last': 'M',
            'maxt_last': 'M',
            'mint_last': 'M',
            'pcpn_last': 'M',
            'soilm_last': 'M',
            'soilt_last': 'M',
            'soilt2in_last': '--',
            'soilt4in_last': '--',
            'soilt8in_last': '--',
            'soilt20in_last': '--',
            'soilt40in_last': '--',
            'soilm2in_last': '--',
            'soilm4in_last': '--',
            'soilm8in_last': '--',
            'soilm20in_last': '--',
            'soilm40in_last': '--',
            'humid_last': 'M',
            'solar_last': 'M',
            'windspdmax_last': 'M',
            'windspdave_last': 'M',
            'winddirave_last': 'M'
    };

    @action explorer_initLatestDailyConditions = () => {
        let dataObjOut = {
            'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
            'avgt_last': 'M',
            'maxt_last': 'M',
            'mint_last': 'M',
            'pcpn_last': 'M',
            'soilm_last': 'M',
            'soilt_last': 'M',
            'soilt2in_last': '--',
            'soilt4in_last': '--',
            'soilt8in_last': '--',
            'soilt20in_last': '--',
            'soilt40in_last': '--',
            'soilm2in_last': '--',
            'soilm4in_last': '--',
            'soilm8in_last': '--',
            'soilm20in_last': '--',
            'soilm40in_last': '--',
            'humid_last': 'M',
            'solar_last': 'M',
            'windspdmax_last': 'M',
            'windspdave_last': 'M',
            'winddirave_last': 'M'
        };
        this.explorer_latestDailyConditions = dataObjOut
    }

    @action explorer_setLatestDailyConditions = () => {
        let data = this.explorer_getDailyClimateData;
        let dataObjOut = {
            'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
            'avgt_last': 'M',
            'maxt_last': 'M',
            'mint_last': 'M',
            'pcpn_last': 'M',
            'soilm_last': 'M',
            'soilt_last': 'M',
            'soilt2in_last': '--',
            'soilt4in_last': '--',
            'soilt8in_last': '--',
            'soilt20in_last': '--',
            'soilt40in_last': '--',
            'soilm2in_last': '--',
            'soilm4in_last': '--',
            'soilm8in_last': '--',
            'soilm20in_last': '--',
            'soilm40in_last': '--',
            'humid_last': 'M',
            'solar_last': 'M',
            'windspdmax_last': 'M',
            'windspdave_last': 'M',
            'winddirave_last': 'M'
        };

        data.forEach(function (d) {
            dataObjOut = {
                'avgt_last':(d[1]==='M') ? ('avgt_last' in dataObjOut ? dataObjOut.avgt_last : 'M') : d[0],
                'maxt_last':(d[2]==='M') ? ('maxt_last' in dataObjOut ? dataObjOut.maxt_last : 'M') : d[0],
                'mint_last':(d[3]==='M') ? ('mint_last' in dataObjOut ? dataObjOut.mint_last : 'M') : d[0],
                'pcpn_last':(d[4]==='M') ? ('pcpn_last' in dataObjOut ? dataObjOut.pcpn_last : 'M') : d[0],
                'soilm_last':(d[5]==='M') ? ('soilm_last' in dataObjOut ? dataObjOut.soilm_last : 'M') : d[0],
                'soilt_last':(d[6]==='M') ? ('soilt_last' in dataObjOut ? dataObjOut.soilt_last : 'M') : d[0],
                'humid_last':(d[7]==='M') ? ('humid_last' in dataObjOut ? dataObjOut.humid_last : 'M') : d[0],
                'solar_last':(d[8]==='M') ? ('solar_last' in dataObjOut ? dataObjOut.solar_last : 'M') : d[0],
                'windspdmax_last':(d[9]==='M') ? ('windspdmax_last' in dataObjOut ? dataObjOut.windspdmax_last : 'M') : d[0],
                'windspdave_last':(d[10]==='M') ? ('windspdave_last' in dataObjOut ? dataObjOut.windspdave_last : 'M') : d[0],
                'winddirave_last':(d[11]==='M') ? ('winddirave_last' in dataObjOut ? dataObjOut.winddirave_last : 'M') : d[0],
                'soilt2in_last': '--',
                'soilt4in_last': '--',
                'soilt8in_last': '--',
                'soilt20in_last': '--',
                'soilt40in_last': '--',
                'soilm2in_last': '--',
                'soilm4in_last': '--',
                'soilm8in_last': '--',
                'soilm20in_last': '--',
                'soilm40in_last': '--',
            }
        })
        this.explorer_latestDailyConditions = dataObjOut;
    }

    @computed get explorer_getLatestDailyConditions() {
        return this.explorer_latestDailyConditions
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
        const [
            date,
            p_today,
            [p_ytd_o, p_ytd_n],
            [p_std_o, p_std_n],
            [p_mtd_o, p_mtd_n],
            t_today,
            [t_ytd_o, t_ytd_n],
            [t_std_o, t_std_n],
            [t_mtd_o, t_mtd_n]
        ] = this.explorerClimateSummary_getClimateData;

        const p_today_adjustment = p_today === 'M' ? 1 : 0;
        const t_today_adjustment = t_today === 'M' ? 1 : 0;
        
        const missing_percent_threshold = 5;
        const too_much_missing = (num_missing, total) => {
            // Return true if (<10 days and any missing) or (<20 days and >1 missing) or (<30 days and >2 missing) or (>=30 days and >5% missing)
            return  (total < 10 && num_missing > 0) ||
                    (total < 20 && num_missing > 1) ||
                    (total < 30 && num_missing > 2) ||
                    (30 <= total && (num_missing / total * 100) >= missing_percent_threshold)
        };
        const ytd_start = 'Jan 1';
        const ytd_days = moment(date, 'YYYY-MM-DD').diff(moment(`${date.slice(0,4)} ${ytd_start}`, 'YYYY MMM D'), 'days') + 1;
        const std_start = getStdStartLabel(date);
        const std_days = moment(date, 'YYYY-MM-DD').diff(moment(`${date.slice(0,4)} ${std_start}`, 'YYYY MMM D'), 'days') + 1;
        const mtd_start = getMtdStartLabel(date);
        const mtd_days = moment(date, 'YYYY-MM-DD').diff(moment(`${date.slice(0,4)} ${mtd_start}`, 'YYYY MMM D'), 'days') + 1;

        const dataObjOut = {
            ytd_start,
            std_start,
            mtd_start,
            date,
            'p_ytd_o':(p_ytd_o==='M' || too_much_missing(p_ytd_n - p_today_adjustment, ytd_days - p_today_adjustment) || parseFloat(p_ytd_o)<0.0) ? 'M' : ((p_ytd_o==='T') ? 'T' : parseFloat(p_ytd_o)).toFixed(2).toString()+'"',
            'p_ytd_n':(p_ytd_n==='M') ? 'M' : parseInt(p_ytd_n - p_today_adjustment, 10),
            'p_std_o':(p_std_o==='M' || too_much_missing(p_std_n - p_today_adjustment, std_days - p_today_adjustment) || parseFloat(p_std_o)<0.0) ? 'M' : ((p_std_o==='T') ? 'T' : parseFloat(p_std_o)).toFixed(2).toString()+'"',
            'p_std_n':(p_std_n==='M') ? 'M' : parseInt(p_std_n - p_today_adjustment, 10),
            'p_mtd_o':(p_mtd_o==='M' || too_much_missing(p_mtd_n - p_today_adjustment, mtd_days - p_today_adjustment) || parseFloat(p_mtd_o)<0.0) ? 'M' : ((p_mtd_o==='T') ? 'T' : parseFloat(p_mtd_o)).toFixed(2).toString()+'"',
            'p_mtd_n':(p_mtd_n==='M') ? 'M' : parseInt(p_mtd_n - p_today_adjustment, 10),
            't_ytd_o':(t_ytd_o==='M' || too_much_missing(t_ytd_n - t_today_adjustment, ytd_days - t_today_adjustment)) ? 'M' : parseFloat(t_ytd_o).toFixed(1).toString()+String.fromCharCode(176)+'F',
            't_ytd_n':(t_ytd_n==='M') ? 'M' : parseInt(t_ytd_n - t_today_adjustment, 10),
            't_std_o':(t_std_o==='M' || too_much_missing(t_std_n - t_today_adjustment, std_days - t_today_adjustment)) ? 'M' : parseFloat(t_std_o).toFixed(1).toString()+String.fromCharCode(176)+'F',
            't_std_n':(t_std_n==='M') ? 'M' : parseInt(t_std_n - t_today_adjustment, 10),
            't_mtd_o':(t_mtd_o==='M' || too_much_missing(t_mtd_n - t_today_adjustment, mtd_days - t_today_adjustment)) ? 'M' : parseFloat(t_mtd_o).toFixed(1).toString()+String.fromCharCode(176)+'F',
            't_mtd_n':(t_mtd_n==='M') ? 'M' : parseInt(t_mtd_n - t_today_adjustment, 10),
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

    // ACIS parameters: hourly call for last few days
    @computed get explorer_getAcisParams_tscan() {
            let elems
            let numdays
            elems = [
                {"vX":23}, //hourly temp, inst
                {"vX":124}, //hourly temp, max
                {"vX":125}, //hourly temp, min
                {"vX":5}, //hourly pcpn, sum
                {"vX":120,"vN":71}, //hourly soil temperature @ 2", inst
                {"vX":120,"vN":103}, //hourly soil temperature @ 4", inst
                {"vX":120,"vN":167}, //hourly soil temperature @ 8", inst
                {"vX":120,"vN":295}, //hourly soil temperature @ 20", inst
                {"vX":120,"vN":327}, //hourly soil temperature @ 40", inst
                {"vX":104,"vN":69}, //hourly soil moisture @ 2", ave
                {"vX":104,"vN":101}, //hourly soil moisture @ 4", ave
                {"vX":104,"vN":165}, //hourly soil moisture @ 8", ave
                {"vX":104,"vN":293}, //hourly soil moisture @ 20", ave
                {"vX":104,"vN":325}, //hourly soil moisture @ 40", ave
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

    // ACIS parameters: daily call for last few days
    @computed get explorer_getDailyAcisParams() {
            let elems
            let numdays
            elems = [
                {"vX":43}, //daily temp, ave
                {"vX":1,"vN":23}, //daily temp, max
                {"vX":2,"vN":23}, //daily temp, min
                {"vX":4,"vN":22}, //daily pcpn, sum
                {"vX":68,"vN":1}, //daily soil moisture, ave
                {"vX":69,"vN":3}, //daily soil temperature, ave
                {"vX":71}, //daily relative humidity, ave
                {"vX":70,"vN":5}, //daily solar radiation, sum
                {"vX":77,"vN":5}, //daily wind speed, peak, max
                {"vX":89,"vN":6}, //daily wind speed, average, ave
                {"vX":101,"vN":1}, //daily wind direction, average, ave
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

    // ACIS parameters: daily call for last few days
    @computed get explorer_getDailyAcisParams_tscan() {
            let elems
            let numdays
            elems = [
                {"vX":43}, //daily temp, ave
                {"vX":1,"vN":24}, //daily temp, max
                {"vX":2,"vN":24}, //daily temp, min
                {"vX":4,"vN":23}, //daily pcpn, sum
                {"vX":68,"vN":2}, //daily soil moisture, ave
                {"vX":69,"vN":4}, //daily soil temperature, ave
                {"vX":71}, //daily relative humidity, ave
                {"vX":70,"vN":6}, //daily solar radiation, sum
                {"vX":77,"vN":6}, //daily wind speed, peak, max
                {"vX":89,"vN":7}, //daily wind speed, average, ave
                {"vX":101,"vN":2}, //daily wind direction, average, ave
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
    @action explorerClimateSummary_getAcisParams = (isTSCAN) => {
        const pcpnMinor = isTSCAN ? 23 : 22;
        const avgtMinor = isTSCAN ? 24 : 23;

        const elems=[
            {"name":"pcpn","vN":pcpnMinor},
            {"name":"pcpn","vN":pcpnMinor,"duration":"ytd","reduce":{"reduce":"sum", "add":"mcnt"},"prec":2},
            {"name":"pcpn","vN":pcpnMinor,"duration":"std","reduce":{"reduce":"sum", "add":"mcnt"},"season_start":getStdStartString(date_current),"prec":2},
            {"name":"pcpn","vN":pcpnMinor,"duration":"mtd","reduce":{"reduce":"sum", "add":"mcnt"},"prec":2},
            {"name":"avgt","vN":avgtMinor},
            {"name":"avgt","vN":avgtMinor,"duration":"ytd","reduce":{"reduce":"mean", "add":"mcnt"},"prec":1},
            {"name":"avgt","vN":avgtMinor,"duration":"std","reduce":{"reduce":"mean", "add":"mcnt"},"season_start":getStdStartString(date_current),"prec":1},
            {"name":"avgt","vN":avgtMinor,"duration":"mtd","reduce":{"reduce":"mean", "add":"mcnt"},"prec":1},
        ]
        return {
            "sid":this.getLocation.sid,
            "sdate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
            "edate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
            "elems":elems,
            "meta":""
        }
    };

    // data is loading - boolean - to control the spinner
    @observable explorer_dataIsLoading = false
    @action explorer_setDataIsLoading = (b) => {
        this.explorer_dataIsLoading = b;
    }
    @computed get explorer_getDataIsLoading() {
        return this.explorer_dataIsLoading;
    }

    @observable explorer_dailyDataIsLoading = false
    @action explorer_setDailyDataIsLoading = (b) => {
        this.explorer_dailyDataIsLoading = b;
    }
    @computed get explorer_getDailyDataIsLoading() {
        return this.explorer_dailyDataIsLoading;
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
        let params = (this.getLocation.sid.split(' ')[1]==='17') ? this.explorer_getAcisParams : this.explorer_getAcisParams_tscan
        this.explorer_initLatestConditions();
        this.explorer_setDataIsLoading(true);
        return axios
          .post('https://data.nrcc.rcc-acis.org/StnData', params)
          .then(res => {
            if (res.data.hasOwnProperty('error')) {
                console.error('Error: resetting data to null');
                this.explorer_setClimateData(null);
                this.explorer_initLatestConditions()
            } else {
                this.explorer_setClimateData(res.data.data.slice(0));
                this.explorer_setLatestConditions()
            }
            this.explorer_setDataIsLoading(false);
          })
          .catch(err => {
            console.error(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    // Station explorer daily data (latest conditions) download
    @action explorer_downloadDailyData = () => {
        let params = (this.getLocation.sid.split(' ')[1]==='17') ? this.explorer_getDailyAcisParams : this.explorer_getDailyAcisParams_tscan
        this.explorer_initLatestDailyConditions();
        this.explorer_setDailyDataIsLoading(true);
        return axios
          .post('https://data.nrcc.rcc-acis.org/StnData', params)
          .then(res => {
            if (res.data.hasOwnProperty('error')) {
                console.error('Error: resetting data to null');
                this.explorer_setDailyClimateData(null);
                this.explorer_initLatestDailyConditions()
            } else {
                this.explorer_setDailyClimateData(res.data.data.slice(0));
                this.explorer_setLatestDailyConditions()
            }
            this.explorer_setDailyDataIsLoading(false);
          })
          .catch(err => {
            console.error(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    // Station explorer hourly data (latest conditions) download
    @action explorerClimateSummary_downloadData = () => {
        let params = this.explorerClimateSummary_getAcisParams(this.getLocation.sid.split(' ')[1] !== '17')
        this.explorer_initClimateSummary();
        this.explorerClimateSummary_setDataIsLoading(true);
        return axios
          .post('https://data.nrcc.rcc-acis.org/StnData', params)
          .then(res => {
            if (res.data.hasOwnProperty('error')) {
                console.error('Error: resetting data to null');
                this.explorerClimateSummary_setClimateData(null);
                this.explorer_initClimateSummary()
            } else {
                this.explorerClimateSummary_setClimateData(res.data.data[0]);
                this.explorer_setClimateSummary()
            }
            this.explorerClimateSummary_setDataIsLoading(false);
          })
          .catch(err => {
            console.error(
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
            solarrad_units : 'Wm⁻²',
            wind_units : 'mph',
          };
        return varUnits
    }

    // livestock to view data
    // - options are 'cattle', 'cow', 'biganimal', 'smallanimal'
    @observable livestock_livestockType = 'cattle'
    @action livestock_setLivestockType = (t) => {
        // has the livestock changed?
        let changed = (this.livestock_getLivestockType===t) ? false : true
        // only update and download data if livestock has changed
        if (changed===true) {
            this.livestock_livestockType = t;
        }
    }
    @action livestock_setLivestockTypeFromRadioGroup = (t) => {
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
            //let dateToday
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
    //     solar : total solar radiation for hour (Wm⁻²)
    //     wind : wind speed for hour (mph)
    @observable livestock_climateSummary = [{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt': null,
                'humid': null,
                'solar': null,
                'wind': null,
                }]
    @action livestock_initClimateSummary = () => {
        let dataObjArray = [{
                'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
                'avgt': null,
                'humid': null,
                'solar': null,
                'wind': null,
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
        let cattleIdx,cowIdx,bigAnimalIdx,smallAnimalIdx

        // hourly data for two days
        data.forEach(function (d) {
              dateToday = d[0]
              // hourly data
              if (dateToday===data[0][0]) {
                  // first day: only use last hour (midnight)
                  tvar = (d[1][23]==='M') ? null : parseFloat(d[1][23])
                  hvar = (d[2][23]==='M' || parseFloat(d[2][23])<0.0 || parseFloat(d[2][23])>100.0) ? null : parseFloat(d[2][23])
                  svar = (d[3][23]==='M' || parseFloat(d[3][23])<0.0) ? null : parseFloat(d[3][23])
                  wvar = (d[4][23]==='M' || parseFloat(d[4][23])<0.0) ? null : parseFloat(d[4][23])
                  // use estimate of solar radiation, if unavailable
                  //if (!svar) { svar = 1000 };
                  if (tvar && hvar && svar && wvar) {
                      //https://www.ars.usda.gov/plains-area/clay-center-ne/marc/docs/heat-stress/forecastingheatstress/
                      cattleIdx = (2.83*tvar) + (0.58*hvar) - (0.76*wvar) + (0.039*svar) - 196.4
                      cattleIdx = (cattleIdx<40) ? 40 : parseInt(cattleIdx,10)
                  } else {
                      cattleIdx = null
                  }
                  if (tvar && hvar) {
                      //THI from https://www.progressivedairy.com/topics/herd-health/how-do-i-determine-how-do-i-calculate-temperature-humidity-index-thi
                      cowIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                      bigAnimalIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                      smallAnimalIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                      // If a very low number, set to 60 for graphing the 'Normal' level
                      cowIdx = (cowIdx<60) ? 60 : parseInt(cowIdx,10)
                      bigAnimalIdx = (bigAnimalIdx<66) ? 66 : parseInt(bigAnimalIdx,10)
                      smallAnimalIdx = (smallAnimalIdx<76) ? 76 : parseInt(smallAnimalIdx,10)
                  } else {
                      cowIdx = null
                      bigAnimalIdx = null
                      smallAnimalIdx = null
                  }
                  //format hour
                  formattedHourString = moment(dateToday,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD")+' 00:00'
                  dataObjArray_hours.push({
                      'date':formattedHourString,
                      'avgt':(tvar) ? tvar : 'M',
                      'humid':(hvar) ? hvar : 'M',
                      'solar':(svar) ? svar : 'M',
                      'wind':(wvar) ? wvar : 'M',
                      'cattle':(cattleIdx) ? cattleIdx : 'M',
                      'cow':(cowIdx) ? cowIdx : 'M',
                      'biganimal':(bigAnimalIdx) ? bigAnimalIdx : 'M',
                      'smallanimal':(smallAnimalIdx) ? smallAnimalIdx : 'M'
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
                      tvar = (d[1][i]==='M') ? null : parseFloat(d[1][i])
                      hvar = (d[2][i]==='M' || parseFloat(d[2][i])<0.0 || parseFloat(d[2][i])>100.0) ? null : parseFloat(d[2][i])
                      svar = (d[3][i]==='M' || parseFloat(d[3][i])<0.0) ? null : parseFloat(d[3][i])
                      wvar = (d[4][i]==='M' || parseFloat(d[4][i])<0.0) ? null : parseFloat(d[4][i])
                      // use estimate of solar radiation, if unavailable
                      //if (!svar) { svar = 1000 };
                      if (tvar && hvar && svar && wvar) {
                          //https://www.ars.usda.gov/plains-area/clay-center-ne/marc/docs/heat-stress/forecastingheatstress/
                          cattleIdx = (2.83*tvar) + (0.58*hvar) - (0.76*wvar) + (0.039*svar) - 196.4
                          cattleIdx = (cattleIdx<40) ? 40 : parseInt(cattleIdx,10)
                          // THI from https://www.progressivedairy.com/topics/herd-health/how-do-i-determine-how-do-i-calculate-temperature-humidity-index-thi
                          //cattleIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                      } else {
                          cattleIdx = null
                      }
                      if (tvar && hvar) {
                          //THI from https://www.progressivedairy.com/topics/herd-health/how-do-i-determine-how-do-i-calculate-temperature-humidity-index-thi
                          cowIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                          bigAnimalIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                          smallAnimalIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                          // If a very low number, set to 60 for graphing the 'Normal' level
                          cowIdx = (cowIdx<60) ? 60 : parseInt(cowIdx,10)
                          bigAnimalIdx = (bigAnimalIdx<66) ? 66 : parseInt(bigAnimalIdx,10)
                          smallAnimalIdx = (smallAnimalIdx<76) ? 76 : parseInt(smallAnimalIdx,10)
                      } else {
                          cowIdx = null
                          bigAnimalIdx = null
                          smallAnimalIdx = null
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
                          'avgt':(tvar) ? tvar : 'M',
                          'humid':(hvar) ? hvar : 'M',
                          'solar':(svar) ? svar : 'M',
                          'wind':(wvar) ? wvar : 'M',
                          'cattle':(cattleIdx) ? cattleIdx : 'M',
                          'cow':(cowIdx) ? cowIdx : 'M',
                          'biganimal':(bigAnimalIdx) ? bigAnimalIdx : 'M',
                          'smallanimal':(smallAnimalIdx) ? smallAnimalIdx : 'M',
                      })
                  }
              } else {
                  numHours = d[1].length
                  for (i = 0; i < numHours; i++) { 
                      tvar = (d[1][i]==='M') ? null : parseFloat(d[1][i])
                      hvar = (d[2][i]==='M' || parseFloat(d[2][i])<0.0 || parseFloat(d[2][i])>100.0) ? null : parseFloat(d[2][i])
                      svar = (d[3][i]==='M' || parseFloat(d[3][i])<0.0) ? null : parseFloat(d[3][i])
                      wvar = (d[4][i]==='M' || parseFloat(d[4][i])<0.0) ? null : parseFloat(d[4][i])
                      // use estimate of solar radiation, if unavailable
                      //if (!svar) { svar = 1000 };
                      if (tvar && hvar && svar && wvar) {
                          //https://www.ars.usda.gov/plains-area/clay-center-ne/marc/docs/heat-stress/forecastingheatstress/
                          cattleIdx = (2.83*tvar) + (0.58*hvar) - (0.76*wvar) + (0.039*svar) - 196.4
                          cattleIdx = (cattleIdx<40) ? 40 : parseInt(cattleIdx,10)
                          // THI from https://www.progressivedairy.com/topics/herd-health/how-do-i-determine-how-do-i-calculate-temperature-humidity-index-thi
                          //cattleIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                      } else {
                          cattleIdx = null
                      }
                      if (tvar && hvar) {
                          //THI from https://www.progressivedairy.com/topics/herd-health/how-do-i-determine-how-do-i-calculate-temperature-humidity-index-thi
                          cowIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                          bigAnimalIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                          smallAnimalIdx = tvar-(0.55-(0.55*hvar/100.))*(tvar-58)
                          // If a very low number, set to 60 for graphing the 'Normal' level
                          cowIdx = (cowIdx<60) ? 60 : parseInt(cowIdx,10)
                          bigAnimalIdx = (bigAnimalIdx<66) ? 66 : parseInt(bigAnimalIdx,10)
                          smallAnimalIdx = (smallAnimalIdx<76) ? 76 : parseInt(smallAnimalIdx,10)
                      } else {
                          cowIdx = null
                          bigAnimalIdx = null
                          smallAnimalIdx = null
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
                          'avgt':(tvar) ? tvar : 'M',
                          'humid':(hvar) ? hvar : 'M',
                          'solar':(svar) ? svar : 'M',
                          'wind':(wvar) ? wvar : 'M',
                          'cattle':(cattleIdx) ? cattleIdx : 'M',
                          'cow':(cowIdx) ? cowIdx : 'M',
                          'biganimal':(bigAnimalIdx) ? bigAnimalIdx : 'M',
                          'smallanimal':(smallAnimalIdx) ? smallAnimalIdx : 'M',
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
        this.livestock_setDataIsLoading(true);
        return axios
          .post('https://data.nrcc.rcc-acis.org/StnData', this.livestock_getAcisParams)
          .then(res => {
            if (res.data.hasOwnProperty('error')) {
                console.error('Error: resetting data to null');
                this.livestock_setClimateData(null);
                this.livestock_initClimateSummary()
            } else {
                this.livestock_setClimateData(res.data.data.slice(0));
                this.livestock_setClimateSummary()
            }
            this.livestock_setDataIsLoading(false);
          })
          .catch(err => {
            console.error(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    ////////////////////////////////////
    /// TOOL: WIND CHILL / HEAT INDEX
    ////////////////////////////////////
    @observable windheat_vars={
            airtemp : true,
            humidity : true,
            wind : true,
        };
    @action windheat_setVars = name => event => {
            this.windheat_vars[name] = event.target.checked
        }
    @computed get windheat_getVars() {
        return this.windheat_vars
    }
    @computed get windheat_getVarLabels() {
          return {
            airtemp_label : 'Air Temperature',
            humidity_label : 'Relative Humidity',
            wind_label : 'Wind',
          };
    }
    @computed get windheat_getVarUnits() {
        let varUnits = {}
          varUnits = {
            airtemp_units : '°F',
            humidity_units : '%',
            wind_units : 'mph',
          };
        return varUnits
    }

    // windheat to view data
    // - options are 'windchill', 'heatindex'
    @observable windheat_windheatType = 'windchill'
    @action windheat_setwindheatType = (t) => {
        // has the windheat changed?
        let changed = (this.windheat_getWindHeatType===t) ? false : true
        // only update and download data if windheat has changed
        if (changed===true) {
            this.windheat_windheatType = t;
        }
    }
    @action windheat_setwindheatTypeFromRadioGroup = (t) => {
        // has the windheat changed?
        let changed = (this.windheat_getWindHeatType===t) ? false : true
        // only update and download data if time frame has changed
        if (changed===true) {
            this.windheat_windheatType = t;
        }
    }
    @computed get windheat_getWindHeatType() {
        return this.windheat_windheatType;
    }

    // windheat tool daily data download - set parameters
    @computed get windheat_getAcisParams() {
            let elems
            let numdays
            elems = [
                {"vX":23}, //temp
                {"vX":24}, //relative humidity
                {"vX":128}, //wind speed
            ]
            numdays=-3

            return {
                "sid":this.getLocation.sid,
                "sdate":moment(date_current,'YYYY-MM-DD').add(numdays,'days').format("YYYY-MM-DD"),
                "edate":moment(date_current,'YYYY-MM-DD').format("YYYY-MM-DD"),
                "elems":elems,
                "meta":""
            }
        }

    // windheat tool forecast data download - set parameters
    //    get two days before date to ensure plenty of date is retrieved for alignment of hours with observed data
    //    start hour is 23 to handle edge case of a PR/VI station (Atlantic Timezone: GMT -4) and non-daylight savings time date (locHrly would return for Eastern Standard Time: GMT -5)
    @computed get windheat_getLocHrlyParams() {
        const { ll } = this.getLocation;
        return {
            "lon": ll[0],
            "lat": ll[1],
            "tzo": -5,
            "sdate": moment(date_current,'YYYY-MM-DD').add(-3,'days').format("YYYYMMDD23"),
            "edate": "now"
        }
    }

    // data is loading - boolean - to control the spinner
    @observable windheat_dataIsLoading = false
    @action windheat_setDataIsLoading = (b) => {
        this.windheat_dataIsLoading = b;
    }
    @computed get windheat_getDataIsLoading() {
        return this.windheat_dataIsLoading;
    }

    // climate data saved in this var
    // - the full request downloaded from ACIS
    @observable windheat_climateData = null;
    @action windheat_setClimateData = (res) => {
        this.windheat_climateData = res
    }
    @computed get windheat_getClimateData() {
        return this.windheat_climateData
    }

    // forecasted climate data saved in this var
    // - the full request downloaded from locHrly
    @observable windheat_forecastData = null;
    @action windheat_setForecastData = (res) => {
        this.windheat_forecastData = res
    }
    @computed get windheat_getForecastData() {
        return this.windheat_forecastData
    }

    // summary for windheat
    // - data included for both observed and forecasted:
    //     date : date of observation
    //     temp : temperature for hour (F)
    //     humid : humidity for hour (%)
    //     wind : wind speed for hour (mph)
    @observable windheat_climateSummary = [{
        'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
        'avgt': null,
        'humid': null,
        'wind': null,
        'windchill': null,
        'heatindex': null,
        'fcstAvgt': null,
        'fcstHumid': null,
        'fcstWind': null,
        'fcstWindchill': null,
        'fcstHeatindex': null,
    }];
    @action windheat_initClimateSummary = () => {
        this.windheat_climateSummary = [{
            'date': moment(date_current,'YYYY-MM-DD').format('YYYY-MM-DD'),
            'avgt': null,
            'humid': null,
            'wind': null,
            'windchill': null,
            'heatindex': null,
            'fcstAvgt': null,
            'fcstHumid': null,
            'fcstWind': null,
            'fcstWindchill': null,
            'fcstHeatindex': null,
        }];
    }
    @action windheat_setClimateSummary = () => {
        let data = this.windheat_getClimateData;
        let forecastRes = this.windheat_getForecastData;
        let dataObjArray_hours = [];

        const MISSING = 'M';
        const NO_VALUE = '--';

        // hourly data for two days
        data.forEach(function (d) {
            // Extract date
            const dateToday = d[0];
            
            let startIdx = 0;
            let numHours = d[1].length;
            if (dateToday===data[0][0]) {
                // If it is the first day only use the midnight hour (idx = 23)
                startIdx = 23;
            } else if (dateToday===data[data.length-1][0]) {
                // If it is the last day leave off hours from end that have missing data
                let numFutureMissingHours = 0
                for (let i = numHours-1; i >= 0; i--) { 
                    if (d[1][i]===MISSING) {
                        numFutureMissingHours += 1;
                    } else {
                        break;
                    }
                }
                numHours -= numFutureMissingHours  
            }

            // Iterate hours
            for (let i = startIdx; i < numHours; i++) { 
                // Extract data and parse into usable form
                const tvar = (d[1][i]===MISSING) ? MISSING : parseFloat(d[1][i]);
                const hvar = (d[2][i]===MISSING || parseFloat(d[2][i])<0.0 || parseFloat(d[2][i])>100.0) ? MISSING : parseFloat(d[2][i]);
                const wvar = (d[3][i]===MISSING || parseFloat(d[3][i])<0.0) ? MISSING : parseFloat(d[3][i]);
                
                // Calculate heat index and wind chill
                const windchill = (tvar === MISSING || wvar === MISSING) ? MISSING : calculateWindChill(tvar, wvar, MISSING, NO_VALUE);
                const heatindex = (tvar === MISSING || hvar === MISSING) ? MISSING : calculateHeatIndex(tvar, hvar, MISSING, NO_VALUE);

                //format hour
                let formattedHourString; 
                if (i<=8) {
                    formattedHourString = dateToday+' 0'+(i+1).toString()+':00'
                } else if (8<i && i<23) {
                    formattedHourString = dateToday+' '+(i+1).toString()+':00'
                } else if (23<=i) {
                    formattedHourString = moment(dateToday,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD")+' 00:00'
                }

                // construct return
                dataObjArray_hours.push({
                    'date':formattedHourString,
                    'avgt': tvar,
                    'humid': hvar,
                    'wind': wvar,
                    'windchill': windchill,
                    'heatindex': heatindex,
                    'fcstAvgt': NO_VALUE,
                    'fcstHumid': NO_VALUE,
                    'fcstWind': NO_VALUE,
                    'fcstWindchill': NO_VALUE,
                    'fcstHeatindex': NO_VALUE,
                })
            }
        })

        if (forecastRes !== null) {
            // Calculate hour offset difference between locHrly timezone (-4 or -5) and station local timezone (precalculated in scan_stations.json)
            const stationTzo = this.getLocation.tzo;
            const locHrlyTzo = parseInt(forecastRes.data.hrlyData[0][0].slice(-6,-3), 10);
            const tzoDiff = locHrlyTzo - stationTzo;
    
            // Combine locHrly data, it will all be considered forecast data by this tool
            const locHrlyObs = forecastRes.data.hrlyData.map(hrArr => ([hrArr[0], hrArr[3], hrArr[4], hrArr[7]]));
            const locHrlyFcst = forecastRes.data.fcstData.map(hrArr => ([hrArr[0], hrArr[2], hrArr[3], hrArr[6]]));
            const hrlyFcst = locHrlyObs.concat(locHrlyFcst);
    
            // Find index of last observed time in forecast data
            const lastObservedHr = dataObjArray_hours[dataObjArray_hours.length - 1];
            const targetDate = lastObservedHr.date.slice(0,10);
            const targetHr = lastObservedHr.date.slice(11, 13);
            const lastObservedIdx = hrlyFcst.findIndex(hrArr => hrArr[0].slice(0,10) === targetDate && hrArr[0].slice(11, 13) === targetHr);
    
            // If forecast data is available, add it to the return object
            if (lastObservedIdx >= 0) {
                hrlyFcst.slice(lastObservedIdx + 1 + tzoDiff).forEach(([date, tvar, hvar, wvar]) => {
                    // Parse into usable form
                    tvar = (tvar === MISSING) ? MISSING : Math.round(parseFloat(tvar));
                    hvar = (hvar === MISSING || parseFloat(hvar)<0.0 || parseFloat(hvar)>100.0) ? MISSING : Math.round(parseFloat(hvar));
                    // Parse and convert from knots to MPH
                    wvar = (wvar === MISSING || parseFloat(wvar)<0.0) ? MISSING : Math.round(parseFloat(wvar) * 1.151 * 10) / 10;
    
                    // Calculate heat index and wind chill
                    const windchill = (tvar === MISSING || wvar === MISSING) ? MISSING : calculateWindChill(tvar, wvar, MISSING, NO_VALUE);
                    const heatindex = (tvar === MISSING || hvar === MISSING) ? MISSING : calculateHeatIndex(tvar, hvar, MISSING, NO_VALUE);
                
                    // Convert datetime in locHrly timezone to station local timezone and format to match observed
                    let formattedHourString = parse(date, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date());
                    formattedHourString = subHours(formattedHourString, tzoDiff);
                    formattedHourString = format(formattedHourString, "yyyy-MM-dd HH:mm");
                
                    // construct return
                    dataObjArray_hours.push({
                    'date':formattedHourString,
                    'avgt': NO_VALUE,
                    'humid': NO_VALUE,
                    'wind': NO_VALUE,
                    'windchill': NO_VALUE,
                    'heatindex': NO_VALUE,
                    'fcstAvgt': tvar,
                    'fcstHumid': hvar,
                    'fcstWind': wvar,
                    'fcstWindchill': windchill,
                    'fcstHeatindex': heatindex,
                    })
                })
            }
        }

        this.windheat_climateSummary = dataObjArray_hours;
    }
    @computed get windheat_getClimateSummary() {
        return this.windheat_climateSummary
    }

    // windheat tool daily data download - download data using parameters
    @action windheat_downloadData = () => {
        this.windheat_setDataIsLoading(true);
        
        const dailyDataPromise = axios
          .post('https://data.nrcc.rcc-acis.org/StnData', this.windheat_getAcisParams);
        
        const forecastDataPromise = axios
          .post('https://hrly.nrcc.cornell.edu/locHrly', this.windheat_getLocHrlyParams);

        return Promise.all([ dailyDataPromise, forecastDataPromise ])
            .then(([dailyRes, forecastRes]) => {
                if (dailyRes.data.hasOwnProperty('error')) {
                    console.error('Error: resetting data to null');
                    this.windheat_setClimateData(null);
                    this.windheat_setForecastData(null);
                    this.windheat_initClimateSummary()
                } else {
                    this.windheat_setClimateData(dailyRes.data.data.slice(0));
                    this.windheat_setForecastData(typeof forecastRes.data === 'string' ? null : forecastRes);
                    this.windheat_setClimateSummary()
                }
                this.windheat_setDataIsLoading(false);
            })
            .catch(err => {
                console.error(err);
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
    @computed get stem_getInstrumentDesc() {
        let desc = null;
        if (this.stem_getInstrument==='wind') {
            desc = "An <b>anemometer</b> is a device for measuring wind speed, and is one instrument used in a weather station. The term is derived from the Greek word, anemos, meaning wind.<p/>A <b>wind vane</b> is a device that measures the direction of the wind. The wind vane is usually combined with the anemometer. Wind direction is the direction from which the wind is blowing."
        }
        if (this.stem_getInstrument==='solarrad') {
            desc = "A <b>solar radiation</b> sensor measures solar energy from the sun.<p/>Solar radiation is radiant energy emitted by the sun from a nuclear fusion reaction that creates electromagnetic energy. The spectrum of solar radiation is close to that of a black body with a temperature of about 5800 K. About half of the radiation is in the visible short-wave part of the electromagnetic spectrum. The other half is mostly in the near-infrared part, with some in the ultraviolet part of the spectrum.<p/>The units of measure are Watts per square meter.<p/>The device is typically used in agricultural applications, and is used in the calculation of Evapotranspiration, is the potential for evaporation of moisture from the soil (or the reverse of rainfall) and is a function solar energy, wind and temperature."
        }
        if (this.stem_getInstrument==='precip') {
            desc = "A <b>rain gauge</b> is a device that measures liquid precipitation (rain), as opposed to solid precipitation (snow gauge) over a set period of time.<p/>All digital rain gauges are self emptying or self dumping (also referred to as tipping rain gauge). The precision of the rain gauge is based on the volume of rain per emptying cycle.<p/>Data from this device are utilized in our Weather Grapher and Water Deficit Calculator."
        }
        if (this.stem_getInstrument==='rh_and_temp') {
            desc = "A <b>thermometer</b> is a device that measures temperature. Most digital thermometers are resistive thermal devices (RTD). RTDs predict change in temperature as a function of electrical resistance.<p/>A <b>hygrometer</b> is a device that measures relative humidity. Relative humidity is a term used to describe the amount or percentage of water vapor that exists in air.<p/>The <b>dew point</b> is the temperature at which a given parcel of humid air must be cooled, at constant barometric pressure, for water vapor to condense into water. The condensed water is called dew. The dew point is a saturation temperature.<p/>The dew point is associated with relative humidity. A high relative humidity indicates that the dew point is closer to the current air temperature. Relative humidity of 100% indicates the dew point is equal to the current temperature and the air is maximally saturated with water. When the dew point remains constant and temperature increases, relative humidity will decrease.<p/>Data from these sensors are utilized in our Weather Grapher, Growing Degree Day Calculator, and Livestock Heat Index."
        }
        if (this.stem_getInstrument==='soil') {
            desc = "A <b>soil moisture</b> sensor measures the quantity of water contained in a material, such as soil, on a volumetric or gravimetric basis. These sensors are paired with <b>soil temperature</b> sensors at specific depths below the ground surface. To obtain an accurate measurement, the soil temperature sensor is required for calibration.<p/>Data from these sensors are used in our Water Deficit Calculator."
        }
        return desc
    }

    // run these on initial load
    constructor() {
        this.downloadStationInfo()
    }

}

