import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MUIDataTable from "mui-datatables";

class DisplayTables extends Component {

    constructor(props) {
        super(props);

        let pageSize = 10;
        let setPage = () => {
                let data = props.windchills
                let idxValid = 0;
                data.slice().reverse().some(function (value,index) {
                    idxValid=index;
                    return value[1];
                });
                return parseInt(Math.floor(idxValid/pageSize),10);
            }

        this.state = {
            page: setPage(),
            pageSize: pageSize,
        }
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.windchills) !== JSON.stringify(this.props.windchills)) {
            this.setState({
                page:this.setPage()
            })
        }
    }

    setPage = () => {
        let data = this.props.windchills
        let idxValid = 0;
        data.slice().reverse().some(function (value,index) {
            idxValid=index;
            return value[1];
        });
        return parseInt(Math.floor(idxValid/this.state.pageSize),10);
    }

    render() {

        let columns = [];
        columns.push({name:'Date', options:{filter:true,sort:true,display:true,download:true}})
        columns.push({name:'Wind Chill (°F)', options:{filter:false,sort:true,display:true,download:true}})
        columns.push({name:'Heat Index (°F)', options:{filter:false,sort:true,display:true,download:true}})

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
          rowsPerPageOptions: [10,50,100],
        };

        let tableData = [];
        for (let i = 0; i < this.props.windchills.length; i++) {
            let windchill = this.props.windchills[i][1];
            windchill = windchill === null ? '--' : windchill;
            let heatindex = this.props.heatindices[i][1];
            heatindex = heatindex === null ? '--' : heatindex;
            tableData.push([
                moment.utc(this.props.windchills[i][0]).format('YYYY-MM-DD HH:mm'),
                windchill,
                heatindex
            ]);
        }

        const tableTitle = 'Wind Chill and Heat Stress'

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
  windchills: PropTypes.array.isRequired,
  heatindices: PropTypes.array.isRequired,
};

export default DisplayTables;

