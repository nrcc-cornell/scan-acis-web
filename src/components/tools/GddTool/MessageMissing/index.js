///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { inject, observer} from 'mobx-react';

//Components

// Styles
import '../../../../styles/MessageMissing.css';

var app;

@inject('store') @observer
class MessageMissing extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    isDataMissing = (data,year) => {
        // are there any missing values for the given year
        let miss = false;
        for (var i = 0, len = data.length-2; i < len; i++) {
            if (data[i][0].split('-')[0]===year && data[i][1]==='M') {
                miss = true;
                break;
            }
        }
        return miss
    }

    render() {

      if (app.gddtool_getClimateData && app.getPlantingYear && this.isDataMissing(app.gddtool_getClimateData,app.getPlantingYear)) {

        return (
            <div className="message-missing">
                <span>*<i>accumulation ends prematurely due to missing data</i></span>
            </div>
        );

      } else {

        return(false);

      }

    }
}

export default MessageMissing;

