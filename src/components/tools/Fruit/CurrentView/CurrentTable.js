import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import MUIDataTable from "mui-datatables";

import '../../../../styles/FruitTable.css';

var app;

@inject('store') @observer
class CurrentTable extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;

        let pageSize = 10;

        let setPage = () => {
                let data = app.fruittool_getClimateSummary;
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
        columns.push({name:'Date', options:{filter:true,sort:true,display:true}})
        columns.push({name:'Observed', options:{filter:false,sort:true,display:true}})
        columns.push({name:'Period ave', options:{filter:false,sort:true,display:false}})
        columns.push({name:'Period min', options:{filter:false,sort:true,display:false}})
        columns.push({name:'Period max', options:{filter:false,sort:true,display:false}})

        const data = JSON.parse(JSON.stringify(app.fruittool_getClimateSummary));
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
                    row.date = row.date.slice(5,7)+'/'+row.date.slice(-2)+'/'+row.date.slice(0,4)
                    row.obs = !isNaN(row.obs) ? row.obs : '--'
                    row.ave = !isNaN(row.ave) ? row.ave : '--'
                    row.min_por = !isNaN(row.min_por) ? row.min_por : '--'
                    row.max_por = !isNaN(row.max_por) ? row.max_por : '--'
                    return [row.date,row.obs,row.ave,row.min_por,row.max_por]
                })

        const base_label = "base "+app.gddtool_getBase+"°F"

        let fruitName;
        if (app.getToolName === 'pawpaw') {
          fruitName = 'Pawpaw Growth';
        } else if (app.getToolName === 'blueberryGrowth') {
          fruitName = 'Lowbush Blueberry Growth';
        } else {
          fruitName = 'Lowbush Blueberry Harvest';
        }

        const tableTitle = fruitName + ' and Accumulated GDD ('+base_label+') in '+app.fruittool_getSelectedYear


        return (
            <div style={{ padding: '0px 20px' }}>
                <MUIDataTable
                    title={tableTitle}
                    data={tableData.reverse()}
                    columns={columns}
                    options={options}
                />
            </div>
        );

    }
}

export default CurrentTable;

