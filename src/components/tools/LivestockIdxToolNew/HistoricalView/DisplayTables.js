///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import MUIDataTable from "mui-datatables";

const DisplayTables = ({data,stnName,loading,tableTitle,tableInfo}) => {

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

        let columns = [];
        columns.push({name:'Date/Time', options:{filter:true,sort:true,display:true,download:true}})
        {tableInfo.dataInfo &&
            tableInfo.dataInfo.map((info,i) => (
                columns.push({name:info.label, options:{filter:false,sort:true,display:true,download:true}})
            ))
        }

        let tableData=[]
        if (data) {
            tableData = data.map(row => {
                let prop
                let outArray=[]
                for (prop in row) {
                    if (Object.prototype.hasOwnProperty.call(row, prop)) {
                        row[prop] = (row[prop]) ? row[prop] : '--'
                        outArray.push(row[prop])
                    }
                }
                return outArray
            })
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

export default DisplayTables;

