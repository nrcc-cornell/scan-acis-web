///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import MUIDataTable from "mui-datatables";


//Components

// Styles

var app;

@inject('store') @observer
class WindHeatTables extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;

        this.state = {
            page: 0,
            pageSize: 10,
        }
    }

    render() {

        let columns = [];
        columns.push({name:'Date/Time (*: Forecast)', options:{filter:true,sort:true,display:true,download:true}})
        columns.push({name:'Wind Chill', options:{filter:false,sort:true,display:true,download:true}})
        columns.push({name:'Heat Stress Index', options:{filter:false,sort:true,display:true,download:true}})
        columns.push({name:'Air Temp (°F)', options:{filter:false,sort:true,display:true,download:true}})
        columns.push({name:'Rel Humidity (%)', options:{filter:false,sort:true,display:true,download:true}})
        columns.push({name:'Wind Speed (mph)', options:{filter:false,sort:true,display:true,download:true}})

        let data = JSON.parse(JSON.stringify(app.windheat_getClimateSummary));

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

        let tableData = data.map(row => {
            if (row.avgt !== '--' && row.fcstAvgt === '--') {
                return [row.date,row.windchill,row.heatstress,row.avgt,row.humid,row.wind];
            } else {
                return [row.date + '*',row.fcstWindchill,row.fcstHeatstress,row.fcstAvgt,row.fcstHumid,row.fcstWind];
            }
        });

        const tableTitle = 'Wind Chill & Heat Stress Index'

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

export default WindHeatTables;

