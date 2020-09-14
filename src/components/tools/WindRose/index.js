///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
//import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';

import ChangeOptions from './ChangeOptions';
import LoadStationData from './LoadStationData';
import UserInput from './UserInput.jsx';
import ObtainData from './ObtainData.jsx'
import Windrose from './Windrose.jsx'
import WindroseTable from './WindroseTable.jsx'
import WindroseEmpty from './WindroseEmpty.jsx'
import WindroseTableEmpty from './WindroseTableEmpty.jsx'
import Footer from './Footer.jsx'

// Styles
//import '../../../styles/WindRose.css';

const styles = theme => ({
  wrapper: {
    //margin: theme.spacing(1),
    position: 'relative',
  },
  mapProgress: {
    color: green[500],
    position: 'absolute',
    zIndex: 1000,
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[800],
    },
  },
  typography: {
    h1: {
      fontSize: "1.3rem",
      fontWeight: "500",
    },
  },
  overrides: {
    MuiListItem: {
      root: {
        paddingTop: "0.25em",
        paddingBottom: "0.25em",
      },
    },
    MuiTableRow: {
      root: {
        height: "1em",
      },
      head: {
        height: "1.5em",
      },
    },
    MuiTableCell: {
      root: {
        fontSize: "80%",
	      padding: "0 3px",
	      border: "1pt solid " + green[700],
        textAlign: "center",
      },
      head: {
        fontSize: "80%",
        fontWeight: "500",
	      padding: "0 3px",
	      border: "1pt solid " + green[700],
        textAlign: "center",
      },
      footer: {
        fontSize: "80%",
	      padding: "0 3px",
	      border: "1pt solid " + green[700],
	      borderBottom: "1pt solid " + green[700],
        textAlign: "center",
        color: grey[800],
      },
      body: {
        fontSize: "80%",
	      padding: "0 3px",
	      border: "1pt solid " + green[700],
        textAlign: "center",
      },
    },
  },
})

var app;
var history;

@inject('store') @observer
class WindRose extends Component {

    constructor(props) {
        super(props);
        const today = new Date()
        const dmonth = ('0' + (today.getMonth() + 1)).slice(-2)
        const ddate = ('0' + today.getDate()).slice(-2)
        app = this.props.store.app;
        history = this.props.history;
        app.setToolName('windrose')
        this.state = {
          highChartOptions: { series: null },
          windtableData: null,
          //userParams: null,
          userParams: {
            sid: this.props.station.split(' ')[0],
            selectedNetwork: this.props.station.includes(' 17') ? 'scan' : 'tscan',
            directbincnt: 36,
            pctcnt: 'percent',
            wsunits: 'miles/hr',
            speedbins: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
            //fromDate: [today.getFullYear(), dmonth, "01"].join("-"),
            fromDate: this.props.por_start,
            toDate: [today.getFullYear(), dmonth, ddate].join("-"),
            fromFilterMonth: '01',
            fromFilterDay: '01',
            toFilterMonth: '12',
            toFilterDay: '31',
            fromFilterHour: 1,
            toFilterHour: 24,
          },
          acisWindResults: null,
          showResults: true,
          data_is_loading: false
        }
    }

    loadWindRoseData = (windroseData, windtableData, stnName) => {
      let dayFilter = "", hourFilter = ""
      const sd = [this.state.userParams.fromFilterMonth, this.state.userParams.fromFilterDay].join("-")
      const ed = [this.state.userParams.toFilterMonth, this.state.userParams.toFilterDay].join("-")
      if (sd !== '01-01' || ed !== '12-31') {
        dayFilter = 'Day filter: ' + sd + " through " + ed
      }
      if (this.state.userParams.fromFilterHour !== 1 || this.state.userParams.toFilterHour !== 24) {
        hourFilter = 'Hour filter: ' + this.state.userParams.fromFilterHour + "-" + this.state.userParams.toFilterHour
      }
      //const titleText = stnName +
      //    " (" + this.state.userParams.fromDate + " to " + this.state.userParams.toDate + ")"
      const subtitleText = this.state.userParams.pctcnt.charAt(0).toUpperCase() + this.state.userParams.pctcnt.slice(1) +
          " of winds blowing from the indicated direction" +
          "<br />Date range: " + this.state.userParams.fromDate + " through " + this.state.userParams.toDate +
          "<br />" + dayFilter + (dayFilter && hourFilter ? "; " : "") + hourFilter
      this.setState({
        highChartOptions: {
          series: windroseData,
          //title: {text: titleText},
          title: {text: stnName},
          subtitle: {text: subtitleText},
        },
        windtableData: {...windtableData, dayFilter:dayFilter, hourFilter:hourFilter}
      })
    }

    startRequest = (params) => {
      this.setState({
        highChartOptions:{ series:null },
        userParams:params,
        showResults: true
     })
    }

    componentDidMount() {
        this.initStateForLoading()
        LoadStationData({sid:this.state.userParams.sid, period:[this.state.userParams.fromDate,this.state.userParams.toDate], wsunits: this.state.userParams.wsunits})
          .then(response => {
            console.log(response);
            this.setState({
              acisWindResults: response,
              data_is_loading: false
            })
          });
    }

    componentDidUpdate(prevProps,prevState) {
      if (prevProps.station!==this.props.station) {
        this.setState(prevState => ({
          userParams: {
            ...prevState.userParams,
            sid: this.props.station.split(' ')[0],
            selectedNetwork: this.props.station.includes(' 17') ? 'scan' : 'tscan',
            fromDate: this.props.por_start,
          }
        }))
      }
      if (prevState.userParams!==this.state.userParams) {
        if (prevState.userParams.sid!==this.state.userParams.sid ||
            prevState.userParams.fromDate!==this.state.userParams.fromDate ||
            prevState.userParams.toDate!==this.state.userParams.toDate ||
            prevState.userParams.wsunits!==this.state.userParams.wsunits) {
          this.initStateForLoading()
          LoadStationData({sid:this.state.userParams.sid, period:[this.state.userParams.fromDate,this.state.userParams.toDate], wsunits: this.state.userParams.wsunits})
            .then(response => {
              this.setState({
                acisWindResults: response,
                data_is_loading: false,
                showResults: (response.data.error) ? false : true
              })
            })
        } else {
        }
      }
    }

    initStateForLoading = () => {
        this.setState({
          //highChartOptions:{ series:null },
          acisWindResults: null,
          data_is_loading: true,
        })
    }

    render() {

        const { classes } = this.props;
        let url_doc = app.getToolInfo(this.props.name).url_doc

        return (
          <MuiThemeProvider theme={theme}>

            <br/>
            {/* begin charts */}
            <Grid item container direction="column" justify="center" alignItems="center" spacing={2} xs={12}>
              <Grid item container direction="row" justify="center" alignItems="center" spacing={4}>
                <Hidden lgUp>
                  <Grid item>
                  <ChangeOptions
                    startRequest={this.startRequest}
                    userParams={this.state.userParams}
                  />
                  </Grid>
                </Hidden>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={()=>{history.push(url_doc)}}>
                    Documentation
                  </Button>
                </Grid>
              </Grid>

              <Grid item container direction="row" justify="space-evenly" alignItems="center">
                <Hidden mdDown>
                  <Grid item>
                  {!this.state.data_is_loading &&
                  <Box padding={1} border={2} borderRadius={4} borderColor="primary.main" bgcolor="#ffffff">
                  <UserInput
                    startRequest={this.startRequest}
                    userParams={this.state.userParams}
                    handleClose={() => {}}
                  />
                  </Box>
                  }
                  </Grid>
                </Hidden>
            {this.state.highChartOptions.series && this.state.showResults && !this.state.data_is_loading &&
                <Grid item>
                <Windrose
                  options={this.state.highChartOptions}
                  userParams={this.state.userParams}
                />
                </Grid>
            }
              </Grid>
            </Grid>

            {this.state.userParams && this.state.acisWindResults &&
              <ObtainData
                loadWindRoseData={this.loadWindRoseData}
                userParams={this.state.userParams}
                acisWindResults={this.state.acisWindResults}
              />
            }

            {this.state.highChartOptions.series && this.state.showResults && !this.state.data_is_loading &&
              <WindroseTable
                hcdata={this.state.highChartOptions}
                userParams={this.state.userParams}
                windtableData={this.state.windtableData}
              />
            }

            {this.state.data_is_loading &&
              <div>
              <WindroseEmpty />
              <WindroseTableEmpty />
              <CircularProgress size={64} className={classes.mapProgress} />
              </div>
            }

            <Footer />
            {/* end charts */}
          </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(WindRose);
