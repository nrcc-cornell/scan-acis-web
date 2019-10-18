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
import DisplayTables from './DisplayTables'
//import WxTablesExtreme from './WxTablesExtreme'

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
        this.year = new Date().getFullYear()
        this.state = {
          tmax_thresh: '90',
          tmax_comparison: 'gt',
          tmax_units: 'degreeF',
          tmax_selected: true,
          tmin_thresh: '32',
          tmin_comparison: 'lt',
          tmin_units: 'degreeF',
          tmin_selected: false,
          prcp_thresh: '2',
          prcp_comparison: 'gt',
          prcp_units: 'inch',
          prcp_selected: false,
          data: null,
          data_is_loading: false,
        }
    }

    componentDidMount() {
        this.initStateForLoading()
        LoadStationData({
            sid:this.props.station,
            xthresh:this.state.tmax_thresh,
            nthresh:this.state.tmin_thresh,
            pthresh:this.state.prcp_thresh,
            xunits:this.state.tmax_units,
            nunits:this.state.tmin_units,
            punits:this.state.prcp_units,
            xcomp:this.state.tmax_comparison,
            ncomp:this.state.tmin_comparison,
            pcomp:this.state.prcp_comparison
        })
          .then(response => {
            this.setState({
              data:this.formatDataForDisplay(response.data.data), 
              data_is_loading:false,
            })
          });
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.station!==this.props.station  ||
            prevState.tmax_thresh!==this.state.tmax_thresh  ||
            prevState.tmin_thresh!==this.state.tmin_thresh  ||
            prevState.tmax_comparison!==this.state.tmax_comparison  ||
            prevState.tmin_comparison!==this.state.tmin_comparison  ||
            prevState.tmax_units!==this.state.tmax_units  ||
            prevState.tmin_units!==this.state.tmin_units  ||
            prevState.prcp_thresh!==this.state.prcp_thresh  ||
            prevState.prcp_comparison!==this.state.prcp_comparison  ||
            prevState.prcp_units!==this.state.prcp_units) {
                this.initStateForLoading()
                LoadStationData({
                    sid:this.props.station,
                    xthresh:this.state.tmax_thresh,
                    nthresh:this.state.tmin_thresh,
                    pthresh:this.state.prcp_thresh,
                    xunits:this.state.tmax_units,
                    nunits:this.state.tmin_units,
                    punits:this.state.prcp_units,
                    xcomp:this.state.tmax_comparison,
                    ncomp:this.state.tmin_comparison,
                    pcomp:this.state.prcp_comparison
                })
                  .then(response => {
                    this.setState({
                      data:this.formatDataForDisplay(response.data.data), 
                      data_is_loading:false,
                    })
                  });
        }
    }

    handleChangeTmaxThreshold = (v) => {
        this.setState({
            tmax_thresh:v.value,
            tmax_units:v.units,
        })
    }

    handleChangeTminThreshold = (v) => {
        this.setState({
            tmin_thresh:v.value,
            tmin_units:v.units,
        })
    }

    handleChangePrcpThreshold = (v) => {
        this.setState({
            prcp_thresh:v.value,
            prcp_units:v.units,
        })
    }

    handleChangeTmaxSelected = () => {
        this.setState({
          tmax_selected: !this.state.tmax_selected,
        })
    }

    handleChangeTminSelected = () => {
        this.setState({
          tmin_selected: !this.state.tmin_selected,
        })
    }

    handleChangePrcpSelected = () => {
        this.setState({
          prcp_selected: !this.state.prcp_selected,
        })
    }

    handleChangeTmaxComparison = (e) => {
        this.setState({
          tmax_comparison: e.target.value,
        })
    }

    handleChangeTminComparison = (e) => {
        this.setState({
          tmin_comparison: e.target.value,
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
            if (this.year.toString()===d[i][0]) {
              // if current year, use year to date values without restrictions to missing data
              oseries.push({
                'date': d[i][0],
                'cnt_x': (d[i][4]==='M') ? 'M' : parseInt(d[i][4],10),
                'cnt_n': (d[i][5]==='M') ? 'M' : parseInt(d[i][5],10),
                'cnt_p': (d[i][6]==='M') ? 'M' : parseInt(d[i][6],10),
              })
            } else {
              // if not current year, use annual tallies with missing data limitations
              oseries.push({
                'date': d[i][0],
                'cnt_x': (d[i][1]==='M') ? 'M' : parseInt(d[i][1],10),
                'cnt_n': (d[i][2]==='M') ? 'M' : parseInt(d[i][2],10),
                'cnt_p': (d[i][3]==='M') ? 'M' : parseInt(d[i][3],10),
              })
            }
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
        let tmaxComparisonSymbol = (this.state.tmax_comparison==='gt') ? '>' : '<'
        let tminComparisonSymbol = (this.state.tmin_comparison==='gt') ? '>' : '<'
        let prcpComparisonSymbol = (this.state.prcp_comparison==='gt') ? '>' : '<'
        let tmaxUnitsLabel = (this.state.tmax_units==='degreeF') ? '°F' : '°C'
        let tminUnitsLabel = (this.state.tmin_units==='degreeF') ? '°F' : '°C'
        let prcpUnitsLabel = (this.state.prcp_units==='inch') ? 'in' : 'mm'
        let tmaxTitle = 'Frequency of daily high temperature '+tmaxComparisonSymbol+' '+this.state.tmax_thresh+tmaxUnitsLabel
        let tminTitle = 'Frequency of daily low temperature '+tminComparisonSymbol+' '+this.state.tmin_thresh+tminUnitsLabel
        let prcpTitle = 'Frequency of daily precipitation '+prcpComparisonSymbol+' '+this.state.prcp_thresh+' '+prcpUnitsLabel
        if (this.props.outputtype==='chart') {
            display = <DisplayCharts
                        data={this.state.data}
                        stnName={this.props.stnname}
                        loading={this.state.data_is_loading}
                        tmaxTitle={tmaxTitle}
                        tminTitle={tminTitle}
                        prcpTitle={prcpTitle}
                        tmaxSelected={this.state.tmax_selected}
                        tminSelected={this.state.tmin_selected}
                        prcpSelected={this.state.prcp_selected}
                      />
        }
        let tmaxTitleTableColumn = 'High Temp '+tmaxComparisonSymbol+' '+this.state.tmax_thresh+tmaxUnitsLabel+' (days)'
        let tminTitleTableColumn = 'Low Temp '+tminComparisonSymbol+' '+this.state.tmin_thresh+tminUnitsLabel+' (days)'
        let prcpTitleTableColumn = 'Precipitation '+prcpComparisonSymbol+' '+this.state.prcp_thresh+' '+prcpUnitsLabel+' (days)'
        if (this.props.outputtype==='table') {
            display = <DisplayTables
                        data={this.state.data}
                        stnName={this.props.stnname}
                        loading={this.state.data_is_loading}
                        tmaxTitle={tmaxTitleTableColumn}
                        tminTitle={tminTitleTableColumn}
                        prcpTitle={prcpTitleTableColumn}
                        tmaxSelected={this.state.tmax_selected}
                        tminSelected={this.state.tmin_selected}
                        prcpSelected={this.state.prcp_selected}
                      />
        }

        let display_VarPicker;
            display_VarPicker = <VarPickerExtreme
                                  tmaxUnits={this.state.tmax_units}
                                  tminUnits={this.state.tmin_units}
                                  prcpUnits={this.state.prcp_units}
                                  tmaxThreshold={this.state.tmax_thresh}
                                  tminThreshold={this.state.tmin_thresh}
                                  prcpThreshold={this.state.prcp_thresh}
                                  tmaxSelected={this.state.tmax_selected}
                                  tminSelected={this.state.tmin_selected}
                                  prcpSelected={this.state.prcp_selected}
                                  tmaxComparison={this.state.tmax_comparison}
                                  tminComparison={this.state.tmin_comparison}
                                  prcpComparison={this.state.prcp_comparison}
                                  onchangeTmaxThreshold={this.handleChangeTmaxThreshold}
                                  onchangeTminThreshold={this.handleChangeTminThreshold}
                                  onchangePrcpThreshold={this.handleChangePrcpThreshold}
                                  onchangeTmaxSelected={this.handleChangeTmaxSelected}
                                  onchangeTminSelected={this.handleChangeTminSelected}
                                  onchangePrcpSelected={this.handleChangePrcpSelected}
                                  onchangeTmaxComparison={this.handleChangeTmaxComparison}
                                  onchangeTminComparison={this.handleChangeTminComparison}
                                  onchangePrcpComparison={this.handleChangePrcpComparison}
                                />

        let display_VarPopover;
        display_VarPopover = <VarPopover
                               contents={display_VarPicker}
                             />

        if (this.props.outputtype==='chart') {

          return (
            <Grid container direction="row" justify="flex-start" alignItems="flex-start" xs={12}>
                <Hidden smDown>
                    <Grid item container direction="column" justify="flex-start" alignItems="flex-start" md={3}>
                            {display_VarPicker}
                    </Grid>
                </Hidden>
                    <Grid item container direction="column" xs={12} md={9}>
                        <Hidden mdUp>
                          <Grid item container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                              {display_VarPopover}
                          </Grid>
                        </Hidden>
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

        } else {

          return (
            <Grid container direction="column" justify="flex-start" alignItems="flex-start" xs={12}>
                        <Grid item xs={12}>
                            {display_VarPopover}
                        </Grid>
                        <Grid item xs={12}>
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
          );

        }

    }
}

export default withStyles(styles)(ExtremeDataView);
