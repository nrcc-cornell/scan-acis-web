///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components

// Styles
import '../../../../styles/TimeFrameButtonGroup.css';

var app;

@inject('store') @observer
class TimeFrameButtonGroup extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {
        console.log(app.wxgraph_getTimeFrame);
        let classes_entire_record = (app.wxgraph_getTimeFrame==='por') ? "btn-xl selected" : "btn-xl"
        let classes_two_years = (app.wxgraph_getTimeFrame==='two_years') ? "btn-xl selected" : "btn-xl"
        let classes_two_months = (app.wxgraph_getTimeFrame==='two_months') ? "btn-xl selected" : "btn-xl"
        let classes_two_days = (app.wxgraph_getTimeFrame==='two_days') ? "btn-xl selected" : "btn-xl"
        console.log(classes_two_days);
        console.log(classes_two_months);
        console.log(classes_two_years);
        console.log(classes_entire_record);

        return (
            <div class="modal-body">
                <div class="row-fluid">
                    <button className={classes_entire_record} onClick={()=>{app.wxgraph_setTimeFrame('por')}}>Entire Record</button>
                    <hr class="horizontal"/>
                    <button className={classes_two_years} onClick={()=>{app.wxgraph_setTimeFrame('two_years')}}>Two Years</button>
                    <hr class="horizontal"/>
                    <button className={classes_two_months} onClick={()=>{app.wxgraph_setTimeFrame('two_months')}}>Two Months</button>
                    <hr class="horizontal"/>
                    <button className={classes_two_days} onClick={()=>{app.wxgraph_setTimeFrame('two_days')}} disabled>Two Days</button>
                </div>
            </div>
        );

    }
}

export default TimeFrameButtonGroup;

