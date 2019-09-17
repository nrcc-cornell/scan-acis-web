///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import MUIDataTable from "mui-datatables";


//Components

// Styles
//import '../../../../styles/WxTables.css';

var app;

@inject('store') @observer
class WxTables extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;

        let pageSize = 10;

        let setPage = () => {
                let data
                if (app.wxgraph_getExtSwitch) {
                    data = app.wxgraph_getClimateSummary['extremes']
                } else {
                    data = app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame]
                }
                let idxValid = 0;
                data.slice().reverse().some(function (value,index) {
                    idxValid=index;
                    return !isNaN(value['obs']);
                });
                return parseInt(Math.floor(idxValid/pageSize),10);
            }

        this.state = {
            page: setPage(),
            pageSize: pageSize,
        }
    }

    render() {

        let columns = [];
        let unitsTemp = (app.wxgraph_getUnitsTemp==='degreeF') ? '°F' : '°C'
        let unitsPrcp = (app.wxgraph_getUnitsPrcp==='inches') ? 'in' : 'mm'
        if (app.wxgraph_getExtSwitch) {
            columns.push({name:'Date/Time', options:{filter:true,sort:true,display:true,download:true}})
            columns.push({name:'Temp>100°F', options:{filter:false,sort:true,display:true,download:true}})
            columns.push({name:'Prcp>2"', options:{filter:false,sort:true,display:true,download:true}})
        } else {
            columns.push({name:'Date/Time', options:{filter:true,sort:true,display:true,download:true}})
            columns.push({name:'Ave Air Temp ('+unitsTemp+')', options:{filter:false,sort:true,display:true,download:true}})
            columns.push({name:'Max Air Temp ('+unitsTemp+')', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'MIn Air Temp ('+unitsTemp+')', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Rainfall ('+unitsPrcp+')', options:{filter:false,sort:true,display:true,download:true}})
            columns.push({name:'Soil Temp 2in ('+unitsTemp+')', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Temp 4in ('+unitsTemp+')', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Temp 8in ('+unitsTemp+')', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Temp 20in ('+unitsTemp+')', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Temp 40in ('+unitsTemp+')', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Moisture 2in (%)', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Moisture 4in (%)', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Moisture 8in (%)', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Moisture 20in (%)', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Moisture 40in (%)', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Rel Humidity (%)', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Solar Rad ('+app.wxgraph_getVarUnits['solarrad_units']+')', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Wind Speed Max (mph)', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Wind Speed Ave (mph)', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Wind Dir (deg)', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Leaf Wetness (min)', options:{filter:false,sort:true,display:false,download:true}})
        }

        let data
        if (app.wxgraph_getExtSwitch) {
            data = JSON.parse(JSON.stringify(app.wxgraph_getClimateSummary['extremes']));
        } else {
            data = JSON.parse(JSON.stringify(app.wxgraph_getClimateSummary[app.wxgraph_getTimeFrame]));
        }

        const options = {
          filterType: 'checkbox',
          responsive: 'scroll',
          selectableRows: false,
          fixedHeader: false,
          search: false,
          filter: false,
          print: false,
          page: 0,
          rowsPerPage: this.state.pageSize,
          rowsPerPageOptions: [10,50,data.length],
          viewColumns: (app.wxgraph_getExtSwitch) ? false : true,
        };

        let tableData
        let tableTitle
        if (app.wxgraph_getExtSwitch) {
            tableData = data.map(row => {
                    row.cnt_t_gt_100 = !isNaN(row.cnt_t_gt_100) ? row.cnt_t_gt_100 : '--'
                    row.cnt_t_gt_90 = !isNaN(row.cnt_t_gt_90) ? row.cnt_t_gt_90 : '--'
                    row.cnt_t_gt_80 = !isNaN(row.cnt_t_gt_80) ? row.cnt_t_gt_80 : '--'
                    row.cnt_p_gt_4 = !isNaN(row.cnt_p_gt_4) ? row.cnt_p_gt_4 : '--'
                    row.cnt_p_gt_3 = !isNaN(row.cnt_p_gt_3) ? row.cnt_p_gt_3 : '--'
                    row.cnt_p_gt_2 = !isNaN(row.cnt_p_gt_2) ? row.cnt_p_gt_2 : '--'
                    row.cnt_p_gt_1 = !isNaN(row.cnt_p_gt_1) ? row.cnt_p_gt_1 : '--'
                    return [row.date,row.cnt_t_gt_100,row.cnt_t_gt_90,row.cnt_t_gt_80,row.cnt_p_gt_4,row.cnt_p_gt_3,row.cnt_p_gt_2,row.cnt_p_gt_1]
                })

            tableTitle = 'Number of exceedences @ '+app.getLocation_explorer.name+', '+app.getLocation_explorer.state
        } else {
            tableData = data.map(row => {
                    row.avgt = !isNaN(row.avgt) ? row.avgt : '--'
                    row.maxt = !isNaN(row.maxt) ? row.maxt : '--'
                    row.mint = !isNaN(row.mint) ? row.mint : '--'
                    row.pcpn = !isNaN(row.pcpn) ? row.pcpn : '--'
                    row.soilt2in = !isNaN(row.soilt2in) ? row.soilt2in : '--'
                    row.soilt4in = !isNaN(row.soilt4in) ? row.soilt4in : '--'
                    row.soilt8in = !isNaN(row.soilt8in) ? row.soilt8in : '--'
                    row.soilt20in = !isNaN(row.soilt20in) ? row.soilt20in : '--'
                    row.soilt40in = !isNaN(row.soilt40in) ? row.soilt40in : '--'
                    row.soilm2in = !isNaN(row.soilm2in) ? row.soilm2in : '--'
                    row.soilm4in = !isNaN(row.soilm4in) ? row.soilm4in : '--'
                    row.soilm8in = !isNaN(row.soilm8in) ? row.soilm8in : '--'
                    row.soilm20in = !isNaN(row.soilm20in) ? row.soilm20in : '--'
                    row.soilm40in = !isNaN(row.soilm40in) ? row.soilm40in : '--'
                    row.humid = !isNaN(row.humid) ? row.humid : '--'
                    row.solar = !isNaN(row.solar) ? row.solar : '--'
                    row.windspdmax = !isNaN(row.windspdmax) ? row.windspdmax : '--'
                    row.windspdave = !isNaN(row.windspdave) ? row.windspdave : '--'
                    row.winddirave = !isNaN(row.winddirave) ? row.winddirave : '--'
                    row.leafwet = !isNaN(row.leafwet) ? row.leafwet : '--'
                    //return [row.date,row.avgt,row.pcpn,row.soilt,row.soilm,row.humid,row.solar,row.wind,row.leafwet]
                    //return [row.date,row.avgt,row.pcpn,row.soilt,row.soilm,row.humid,row.solar,row.wind]
                    return [row.date,row.avgt,row.maxt,row.mint,row.pcpn,row.soilt2in,row.soilt4in,row.soilt8in,row.soilt20in,row.soilt40in,row.soilm2in,row.soilm4in,row.soilm8in,row.soilm20in,row.soilm40in,row.humid,row.solar,row.windspdmax,row.windspdave,row.winddirave,row.leafwet]
                })

            tableTitle = 'Data @ '+app.getLocation_explorer.name+', '+app.getLocation_explorer.state
        }

        return (
                <MUIDataTable
                    title={tableTitle}
                    data={tableData.reverse()}
                    columns={columns}
                    options={options}
                />
        );

    }
}

export default WxTables;

