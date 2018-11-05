///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import ReactTable from 'react-table';

import 'react-table/react-table.css'

//Components

// Styles
import '../../../../styles/GddTable.css';

var app;

@inject('store') @observer
class GddTable extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;

        let pageSize = 11;

        let setPage = () => {
                let data = app.gddtool_getClimateSummary;
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
        columns.push({Header:'Date', accessor:'date', sortable:true})
        columns.push({Header:'Observed', accessor:'obs', sortable:false})
        columns.push({Header:'15-yr ave', accessor:'recent', sortable:false})
        columns.push({Header:'30-yr normal', accessor:'normal', sortable:false})
        columns.push({Header:'Period min', accessor:'min_por', sortable:false})
        columns.push({Header:'Period max', accessor:'max_por', sortable:false})

        //let data = app.gddtool_getClimateSummary

        return (
            <div id="gdd-table">
                <ReactTable
                    data={app.gddtool_getClimateSummary}
                    resolveData={data => data.map(row => {
                            row.obs = !isNaN(row.obs) ? row.obs : '--'
                            row.recent = !isNaN(row.recent) ? row.recent : '--'
                            row.normal = !isNaN(row.normal) ? row.normal : '--'
                            row.min_por = !isNaN(row.min_por) ? row.min_por : '--'
                            row.max_por = !isNaN(row.max_por) ? row.max_por : '--'
                            return row
                        })
                    }
                    columns={columns}
                    defaultSorted={[
                        {
                            id: "date",
                            desc: true
                        }
                    ]}
                    defaultPageSize={this.state.pageSize}
                    page={this.state.page}
                    onPageChange={page => this.setState({page})}
                    showPageSizeOptions={false}
                />
            </div>
        );

    }
}

export default GddTable;

