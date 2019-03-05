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
        if (app.wxgraph_getExtSwitch) {
            columns.push({name:'Date/Time', options:{filter:true,sort:true,display:true,download:true}})
            columns.push({name:'Temp>100°F', options:{filter:false,sort:true,display:true,download:true}})
            columns.push({name:'Temp>90°F', options:{filter:false,sort:true,display:true,download:true}})
            columns.push({name:'Temp>80°F', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Prcp>4"', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Prcp>3"', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Prcp>2"', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Prcp>1"', options:{filter:false,sort:true,display:false,download:true}})
        } else {
            columns.push({name:'Date/Time', options:{filter:true,sort:true,display:true,download:true}})
            columns.push({name:'Air Temp', options:{filter:false,sort:true,display:true,download:true}})
            columns.push({name:'Rainfall', options:{filter:false,sort:true,display:true,download:true}})
            columns.push({name:'Soil Temp', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Soil Moisture', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Humidity', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Solar Rad', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Wind', options:{filter:false,sort:true,display:false,download:true}})
            columns.push({name:'Leaf Wetness', options:{filter:false,sort:true,display:false,download:true}})
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
          page: this.state.page,
          rowsPerPage: this.state.pageSize,
          rowsPerPageOptions: [10,50,data.length],
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

            tableTitle = 'Number of days exceeding thresholds'
        } else {
            tableData = data.map(row => {
                    row.avgt = !isNaN(row.avgt) ? row.avgt : '--'
                    row.pcpn = !isNaN(row.pcpn) ? row.pcpn : '--'
                    row.soilt = !isNaN(row.soilt) ? row.soilt : '--'
                    row.soilm = !isNaN(row.soilm) ? row.soilm : '--'
                    row.humid = !isNaN(row.humid) ? row.humid : '--'
                    row.solar = !isNaN(row.solar) ? row.solar : '--'
                    row.wind = !isNaN(row.wind) ? row.wind : '--'
                    //row.leafwet = !isNaN(row.leafwet) ? row.leafwet : '--'
                    //return [row.date,row.avgt,row.pcpn,row.soilt,row.soilm,row.humid,row.solar,row.wind,row.leafwet]
                    return [row.date,row.avgt,row.pcpn,row.soilt,row.soilm,row.humid,row.solar,row.wind]
                })

            tableTitle = 'Observed Data'
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

