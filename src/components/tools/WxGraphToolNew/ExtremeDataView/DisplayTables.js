///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import MUIDataTable from "mui-datatables";

const DisplayTables = ({data,stnName,loading,tmaxTitle,tminTitle,prcpTitle,tmaxSelected,tminSelected,prcpSelected}) => {

        let columns = [];
        columns.push({name:'Date/Time', options:{filter:true,sort:true,display:true,download:true}})
        columns.push({name:tmaxTitle, options:{filter:false,sort:true,display:tmaxSelected,download:tmaxSelected}})
        columns.push({name:tminTitle, options:{filter:false,sort:true,display:tminSelected,download:tminSelected}})
        columns.push({name:prcpTitle, options:{filter:false,sort:true,display:prcpSelected,download:prcpSelected}})

        let dataLength = (data) ? data.length : 0
        const options = {
          filterType: 'checkbox',
          responsive: 'scroll',
          selectableRows: false,
          fixedHeader: false,
          search: false,
          filter: false,
          print: false,
          page: 0,
          rowsPerPage: 10,
          rowsPerPageOptions: [10,50,dataLength],
          viewColumns: false,
        };

        let tableData=[]
        if (data) {
            tableData = data.map(row => {
                row.cnt_x = !isNaN(row.cnt_x) ? row.cnt_x : '--'
                row.cnt_n = !isNaN(row.cnt_n) ? row.cnt_n : '--'
                row.cnt_p = !isNaN(row.cnt_p) ? row.cnt_p : '--'
                return [row.date,row.cnt_x,row.cnt_n,row.cnt_p]
            })
        }

        let tableTitle = 'Number of exceedences @ '+stnName

        return (
                <MUIDataTable
                    title={tableTitle}
                    data={tableData.reverse()}
                    columns={columns}
                    options={options}
                />
        );

}

export default DisplayTables;

