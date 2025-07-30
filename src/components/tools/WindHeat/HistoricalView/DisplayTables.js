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
        tableInfo.dataInfo &&
            tableInfo.dataInfo.reverse().map((info,i) => (
                columns.push({name:info.label, options:{filter:false,sort:true,display:true,download:true}})
            ))
        columns.push({name:'Missing Data', options:{filter:false,sort:true,display:true,download:true}})
        
        let tableData=[]
        if (data, tableInfo.dataInfo) {
            tableData = data.map(row => {
                let outArray=[
                    row.year
                ];
                tableInfo.dataInfo.reverse().forEach((info) => {
                    const value = row.categories[info.key];
                    outArray.push((value === 0 && row.percentMissing > 0) ? '--' : value);
                });
                outArray.push(Math.round(row.percentMissing * 10) / 10 + '%');
                return outArray;
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

