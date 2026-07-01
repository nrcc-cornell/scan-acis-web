///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { inject, observer} from 'mobx-react';
import moment from 'moment';
import MUIDataTable from "mui-datatables";


//Components

// Styles

class DisplayTables extends Component {

    constructor(props) {
        super(props);

        let pageSize = 10;
        let setPage = () => {
                let data = this.props.data_wd.data_series
                let idxValid = 0;
                data.slice().reverse().some(function (value,index) {
                    idxValid=index;
                    //return !isNaN(value[1]);
                    return value[1];
                });
                return parseInt(Math.floor(idxValid/pageSize),10);
            }

        this.state = {
            page: setPage(),
            //page: null,
            pageSize: pageSize,
        }
    }

    componentDidUpdate(prevProps,prevState) {
        if (JSON.stringify(prevProps.data_wd) !== JSON.stringify(this.props.data_wd)) {
            this.setState({
                page:this.setPage()
            })
        }
    }

    setPage = () => {
        let data = this.props.data_wd.data_series
        let idxValid = 0;
        data.slice().reverse().some(function (value,index) {
            idxValid=index;
            //return !isNaN(value[1]);
            return value[1];
        });
        return parseInt(Math.floor(idxValid/this.state.pageSize),10);
    }

    render() {

        let columns = [];
        columns.push({name:'Date', options:{filter:true,sort:true,display:true,download:true}})
        columns.push({name:'Water Deficit (in)', options:{filter:false,sort:true,display:true,download:true}})

        const options = {
          filterType: 'checkbox',
          responsive: 'scrollFullHeight',
          selectableRows: 'none',
          fixedHeader: false,
          search: false,
          filter: false,
          print: false,
          page: this.state.page,
          rowsPerPage: this.state.pageSize,
          rowsPerPageOptions: [10,50,this.props.data_wd.data_series.length],
        };

        let tableData = this.props.data_wd.data_series.map(row => {
                    row.wd = !isNaN(row.wd) ? row.wd : '--'
                    return [moment.utc(row[0]).format('YYYY-MM-DD'),row[1]]
                })

        const tableTitle = 'Available Water Deficit'

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

DisplayTables.propTypes = {
  data_wd: PropTypes.object.isRequired,
  //data_soilm: PropTypes.array.isRequired,
  //data_precip: PropTypes.array.isRequired,
};

export default DisplayTables;

