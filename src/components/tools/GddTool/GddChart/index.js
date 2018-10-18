///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
//import { ResponsiveContainer, Label, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

//Components

// Styles
import '../../../../styles/GddChart.css';

let formatXAxisForDate = (tickItem) => {
    return moment(tickItem).format('MMM DD')
}

var app;

@inject('store') @observer
class GddChart extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div id="gdd-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={app.gddtool_getChartData}>
                <Line type="monotone" dataKey="obs" stroke="green" dot={false} />
                <Line type="monotone" dataKey="normal" stroke="purple" dot={false} />
                <CartesianGrid stroke="#ccc" />
                <Tooltip />
                <Legend />
                <XAxis dataKey="date" tickFormatter={formatXAxisForDate} />
                <YAxis />
              </LineChart>
            </ResponsiveContainer>
            </div>
        );

    }
}

export default GddChart;

