///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import moment from 'moment';
// to save charts in specific id
import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Tooltip from '@material-ui/core/Tooltip';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

//Components

// Styles
//import '../../../../styles/WxCharts.css';

//var app;

@inject('store') @observer
class DownloadCharts extends Component {

    //constructor(props) {
    //    super(props);
    //    app = this.props.store.app;
    //}

    render() {

        let filenameToSave = this.props.fname

        // download charts selected
        let downloadGraphs = (node) => {
            domtoimage.toBlob(document.getElementById(node))
                .then(function (blob) {
                    saveAs(blob, filenameToSave);
                });
        }

        return (
          <Tooltip title="Download Charts">
              <IconButton
                color="inherit"
                aria-label="Download Charts"
                onClick={() => {downloadGraphs('waterdef-charts')}}
              >
                <CloudDownloadIcon />
              </IconButton>
          </Tooltip>
        );

    }
}

export default DownloadCharts;

