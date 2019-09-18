///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import { withStyles } from '@material-ui/core/styles';
//import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Components
import LoadStationData from './LoadStationData';
import VarPopover from './VarPopover'
import VarPickerExtreme from './VarPickerExtreme'
//import WxChartsExtreme from './WxChartsExtreme'
import DisplayCharts from './DisplayCharts'
import WxTables from './WxTables'

// Styles
//import '../../../styles/WxGraphTool.css';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
});

var app;

@inject('store') @observer
class ExtremeDataView extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('wxgrapher')
        this.state = {
          temp_thresh: '90',
          temp_comparison: 'gt',
          temp_units: 'degreeF',
          temp_selected: true,
          prcp_thresh: '2',
          prcp_comparison: 'gt',
          prcp_units: 'inch',
          prcp_selected: true,
          data: null,
          data_is_loading: false,
        }
    }

    componentDidMount() {
        this.initStateForLoading()
        LoadStationData({sid:this.props.station,tthresh:this.state.temp_thresh,pthresh:this.state.prcp_thresh,tunits:this.state.temp_units,punits:this.state.prcp_units,tcomp:this.state.temp_comparison,pcomp:this.state.prcp_comparison})
          .then(response => {
            this.setState({
              data:this.formatDataForDisplay(response.data.data), 
              data_is_loading:false,
            })
          });
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.station!==this.props.station  ||
            prevState.temp_thresh!==this.state.temp_thresh  ||
            prevState.temp_comparison!==this.state.temp_comparison  ||
            prevState.temp_units!==this.state.temp_units  ||
            prevState.prcp_thresh!==this.state.prcp_thresh  ||
            prevState.prcp_comparison!==this.state.prcp_comparison  ||
            prevState.prcp_units!==this.state.prcp_units) {
                this.initStateForLoading()
                LoadStationData({sid:this.props.station,tthresh:this.state.temp_thresh,pthresh:this.state.prcp_thresh,tunits:this.state.temp_units,punits:this.state.prcp_units,tcomp:this.state.temp_comparison,pcomp:this.state.prcp_comparison})
                  .then(response => {
                    this.setState({
                      data:this.formatDataForDisplay(response.data.data), 
                      data_is_loading:false,
                    })
                  });
        }
    }

    handleChangeTempThresh = (v) => {
        this.setState({
            temp_thresh:v
        })
    }

    handleChangePrcpThresh = (v) => {
        this.setState({
            prcp_thresh:v
        })
    }

    handleChangeTempComparison = (e) => {
        this.setState({
          temp_comparison: e.target.value,
        })
    }

    handleChangePrcpComparison = (e) => {
        this.setState({
          prcp_comparison: e.target.value,
        })
    }

    formatDataForDisplay = (d) => {
        // d: data from acis call
        let i
        let oseries=[]
        if (!d) {return oseries}
        for (i=0; i<d.length; i++) {
            oseries.push({
              'date': d[i][0],
              'cnt_t': (d[i][1]==='M') ? NaN : parseInt(d[i][1],10),
              'cnt_p': (d[i][2]==='M') ? NaN : parseInt(d[i][2],10),
            })
        }
        return oseries
    }

    initStateForLoading = () => {
        this.setState({
          data_is_loading: true,
          data: null,
        })
    }

    dataIsLoading = () => {
        return this.state.data_is_loading
    }

    convert_in_to_cm = (v) => { return v*2.54 }

    render() {
        //const { classes } = this.props;

        let display;
        let tempComparisonSymbol = (this.state.temp_comparison==='gt') ? '>' : '<'
        let prcpComparisonSymbol = (this.state.prcp_comparison==='gt') ? '>' : '<'
        let tempUnitsLabel = (this.state.temp_units==='degreeF') ? '°F' : '°C'
        let prcpUnitsLabel = (this.state.prcp_units==='inch') ? 'in' : 'mm'
        let tempTitle = (this.state.temp_comparison==='gt') ?
            'Frequency of daily high temperature '+tempComparisonSymbol+' '+this.state.temp_thresh+tempUnitsLabel :
            'Frequency of daily low temperature '+tempComparisonSymbol+' '+this.state.temp_thresh+tempUnitsLabel
        let prcpTitle = 'Frequency of daily precipitation '+prcpComparisonSymbol+' '+this.state.prcp_thresh+' '+prcpUnitsLabel
        if (this.props.outputtype==='chart') {
            display = <DisplayCharts
                        data={this.state.data}
                        stnName={this.props.stnname}
                        loading={this.state.data_is_loading}
                        tempTitle={tempTitle}
                        prcpTitle={prcpTitle}
                      />
        }
        if (this.props.outputtype==='table') { display = <WxTables /> }

        let display_VarPicker;
        if (this.props.outputtype==='chart') {
            display_VarPicker = <VarPickerExtreme
                                  tempUnits={this.state.temp_units}
                                  prcpUnits={this.state.prcp_units}
                                  tempThreshold={this.state.temp_thresh}
                                  prcpThreshold={this.state.prcp_thresh}
                                  tempComparison={this.state.temp_comparison}
                                  prcpComparison={this.state.prcp_comparison}
                                  onchangeTemp={this.handleChangeTempThresh}
                                  onchangePrcp={this.handleChangePrcpThresh}
                                  onchangeTempComparison={this.handleChangeTempComparison}
                                  onchangePrcpComparison={this.handleChangePrcpComparison}
                                />
        }
        if (this.props.outputtype==='table') { display_VarPicker = null }

        let display_VarPopover;
        display_VarPopover = <VarPopover
                               contents={display_VarPicker}
                             />

        return (
            <Grid container direction="row" justify="center" alignItems="flex-start" xs={12}>
                <Hidden smDown>
                    <Grid item container className="nothing" direction="column" md={3}>
                        <Grid item>
                            {display_VarPicker}
                        </Grid>
                    </Grid>
                </Hidden>
                    <Grid item container className="nothing" direction="column" xs={12} md={9}>
                        <Grid item container direction="row" justify="flex-start" alignItems="flex-start" spacing="1">
                          <Hidden mdUp>
                            <Grid item>
                              {display_VarPopover}
                            </Grid>
                          </Hidden>
                        </Grid>
                        <Grid item>
                            <LoadingOverlay
                              active={this.dataIsLoading()}
                              spinner
                              background={'rgba(255,255,255,1.0)'}
                              color={'rgba(34,139,34,1.0)'}
                              spinnerSize={'10vw'}
                              >
                                {display}
                            </LoadingOverlay>
                        </Grid>
                    </Grid>
            </Grid>
        );

    }
}

export default withStyles(styles)(ExtremeDataView);
