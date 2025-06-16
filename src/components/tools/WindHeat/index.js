///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

import LoadStationData from './LoadStationData';
import YearSelect from './YearSelect';
import { heatindex, windchill } from './Models';
import DisplayWindChillChart from './DisplayWindChillChart';
import DisplayHeatIndexChart from './DisplayHeatIndexChart';
import DisplayTables from './DisplayTables';
import DownloadCharts from './DownloadCharts'

const styles = theme => ({
  wrapper: {
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

var app;

@inject('store') @observer
class WindHeat extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('windheat')
        this.state = {
          years: [moment().year()],
          year: moment().year(),
          data_is_loading: null,
          windchills: null,
          heatindices: null,
        }
    }

    componentDidMount() {
        this.initStateForLoading()
        this.handleDataUpdate(true)
    }

    componentDidUpdate(prevProps,prevState) {
      const stationChanged = prevProps.station!==this.props.station;
      const yearChanged = prevState.year!==this.state.year;
      if (stationChanged || yearChanged) {
        this.initStateForLoading()
        this.handleDataUpdate(stationChanged)
      }
    }

    handleDataUpdate = (updateYear=false) => {
      LoadStationData({sid:this.props.station, period:[this.state.year.toString()+'-01-01',this.state.year.toString()+'-12-31']})
          .then(response => {
            const yearState = {};
            if (updateYear) {
              let yearStart = (response.data.meta && response.data.meta.valid_daterange && response.data.meta.valid_daterange[1][0]) ? parseInt(response.data.meta.valid_daterange[1][0].split('-')[0],10) : moment().year()
              let yearEnd = (response.data.meta && response.data.meta.valid_daterange && response.data.meta.valid_daterange[1][1]) ? parseInt(response.data.meta.valid_daterange[1][1].split('-')[0],10) : moment().year()
              yearState['years'] = Array.from({length: yearEnd-yearStart+1}, (v, k) => k+yearStart)
              yearState['year'] = yearEnd;
            }

            const { windchills, heatindices } = response.data.data.reduce((acc, [date, temp, relHum, windSpd]) => {
              const timestamp = moment.utc(date,'YYYY-MM-DD');
              for (let i = 0; i < 24; i++) {
                acc.windchills.push([timestamp.valueOf(), windchill(temp[i], windSpd[i], null)]);
                acc.heatindices.push([timestamp.valueOf(), heatindex(temp[i], relHum[i], null)]);
                timestamp.add(1, 'hours');
              }
              return acc;
            }, { windchills: [], heatindices: [] });

            this.setState({
              ...yearState,
              data_is_loading: false,
              windchills, 
              heatindices
            })
          })
          .catch(err => {
            console.error(err);
            this.setState({
              windchills: null,
              heatindices: null,
            })
          });
    }

    handleYearChange = (e) => {
        this.setState({
          year: e.target.value,
        })
    }

    initStateForLoading = () => {
        this.setState({
          data_is_loading: true,
          windchills: null,
          heatindices: null,
        })
    }

    render() {
        const { classes } = this.props;

        let downloadFilename = (app.getLocation) ?
            app.getLocation.name+'_WindChillAndHeatStress.png' :
            'scan_data.png'
        downloadFilename = downloadFilename.replace(' ','-');

        return (
          <div>
            <Grid item container direction="row" justify="space-evenly" alignItems="flex-start">
              <Grid item>
                {this.state.year && this.state.years &&
                  <YearSelect
                    value={this.state.year}
                    values={this.state.years}
                    onchange={this.handleYearChange}
                  />
                }
              </Grid>
              <Grid item>
                {app.getOutputType==='chart' &&
                  <DownloadCharts fname={downloadFilename} />
                }
              </Grid>
            </Grid>

            {/* begin charts */}
            {app.getOutputType==='chart' &&
            <div id="windheat-charts">
              <Grid item>
                <div className={classes.wrapper}>
                  {(this.state.data_is_loading) ?
                    <CircularProgress size={64} className={classes.mapProgress} />
                    :
                    <DisplayWindChillChart
                      data={this.state.windchills || []}
                      stnName={this.props.stnname}
                    />
                  }
                </div>
              </Grid>
              <Grid item>
                <div className={classes.wrapper}>
                  {this.state.data_is_loading ?
                    <CircularProgress size={64} className={classes.mapProgress} />
                    :
                    <DisplayHeatIndexChart
                      data={this.state.heatindices || []}
                      stnName={this.props.stnname}
                    />
                  }
                </div>
              </Grid>
            </div>
            }
            {/* end charts */}

            {/* begin tables */}
            {app.getOutputType==='table' &&
              (this.state.data_is_loading ?
                <CircularProgress size={64} className={classes.mapProgress} />
                :
                <DisplayTables
                  windchills = {this.state.windchills || []}
                  heatindices = {this.state.heatindices || []}
                />
              )
            }
            {/* end tables */}

          </div>
        );
    }
}

export default withStyles(styles)(WindHeat);
