import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import MUIDataTable from "mui-datatables";
import moment from 'moment';

import '../../../../styles/FruitTable.css';

var app;

@inject('store') @observer
class HistoricalTable extends Component {
    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.state = {
            page: 0,
            pageSize: 10,
        }
    }

    idxToDate = (idx) => {
      const fruitSeasonStart = app.fruit_info[app.getToolName].seasonStart;
      const referenceDate = new Date(2025, fruitSeasonStart[0] - 1, fruitSeasonStart[1]);
      const date = new Date(
        referenceDate.getTime() + idx * 24 * 60 * 60 * 1000
      );
      return moment(date).format('M/D');
    };

    render() {
      const columns = [{name:'Year', options:{filter:true,sort:true,display:true}}];
      this.props.tableInfo.dataInfo.forEach(d => {
        if (d.key !== 'transparent') {
          columns.push({name:d.label, options:{filter:false,sort:true,display:true}})
        }
      });
      columns.push({name:'First Freeze', options:{filter:false,sort:true,display:true}})

      const tableData = this.props.data.map(({ year, categories, firstFreezeDate }) => {
        const missingValue = '--';
        const row = [year];

        let catSum = 0;
        this.props.tableInfo.dataInfo.forEach(({ key }) => {
          const prevSum = catSum;
          catSum += categories[key];
          if (key !== 'transparent') {
            if (prevSum === catSum) {
              row.push(missingValue);
            } else {
              const startDate = this.idxToDate(prevSum);
              const endDate = this.idxToDate(catSum);
              row.push(`${startDate} - ${endDate}`)
            }
          }
        });

        row.push(firstFreezeDate ? moment(firstFreezeDate).format('M/D') : missingValue);

        return row;
      });

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
        rowsPerPageOptions: [10,50,this.props.data.length],
      };

      let fruitName;
      if (app.getToolName === 'pawpaw') {
        fruitName = 'Pawpaw Growth';
      } else if (app.getToolName === 'blueberryGrowth') {
        fruitName = 'Lowbush Blueberry Growth';
      } else {
        fruitName = 'Optimal Harvest of Lowbush Blueberry';
      }

      const tableTitle = `Annual Timing of ${fruitName} (Base ${app.gddtool_getBase}°F GDDs)`

      return (
        <div style={{ padding: '0px 20px' }}>
          <MUIDataTable
            title={tableTitle}
            data={tableData.reverse()}
            columns={columns}
            options={options}
          />
        </div>
      )
    }
}

export default HistoricalTable;



