import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import LoadingOverlay from 'react-loading-overlay';
import moment from 'moment';
import { Button } from '@material-ui/core';

var app;

const statusPages = [
  [
    { name: 'Air Temperature', keys: ['avgt_last','maxt_last','mint_last'] },
    { name: 'Precipitation', keys: ['pcpn_last'] },
    { name: 'Relative Humidity', keys: ['humid_last'] },
    { name: 'Solar Radiation', keys: ['solar_last'] },
    { name: 'Wind Speed', keys: ['windspdmax_last','windspdave_last'] },
    { name: 'Wind Direction', keys: ['winddirave_last'] },
  ],[
    { name: 'Soil Temperature', keys: ['soilt_last'] },
    { name: '    2 inch', keys: ['soilt2in_last'] },
    { name: '    4 inch', keys: ['soilt4in_last'] },
    { name: '    8 inch', keys: ['soilt8in_last'] },
    { name: '    20 inch', keys: ['soilt20in_last'] },
    { name: '    40 inch', keys: ['soilt40in_last'] },
  ],[
    { name: 'Soil Moisture', keys: ['soilm_last'] },
    { name: '    2 inch', keys: ['soilm2in_last'] },
    { name: '    4 inch', keys: ['soilm4in_last'] },
    { name: '    8 inch', keys: ['soilm8in_last'] },
    { name: '    20 inch', keys: ['soilm20in_last'] },
    { name: '    40 inch', keys: ['soilm40in_last'] },
  ]
];

@inject('store') @observer
class StationExplorerStationStatus extends Component {
  constructor(props) {
    super(props);
    app = this.props.store.app;
  }

  change_page = (currPage) => {
    app.setExplorer_status_page((currPage + 1) % 3)
  };

  get_earliest_report_date_string = (keys, data, now) => {
    const lastReportDateString = keys.reduce((earliest, k) => {
      const newDt = data[k];
      if (earliest === 'M' || earliest === '--' || newDt < earliest) {
        earliest = newDt;
      }
      return earliest;
    }, 'M');

    let daysSinceLastReport = null;
    if (lastReportDateString !== 'M' && lastReportDateString !== '--') {
        daysSinceLastReport = now.diff(lastReportDateString, 'days');
    }
    return { lastReportDateString, daysSinceLastReport };
  }

  construct_table_info = (pageNum, hrlyData, dlyData) => {
    if (hrlyData && dlyData && 'avgt_last' in hrlyData && 'avgt_last' in dlyData) {
      const now = moment();
      return statusPages[pageNum].map(({ name, keys }) => {
        const { lastReportDateString: hrlyLatestReport, daysSinceLastReport: daysSinceLastHrlyReport } = this.get_earliest_report_date_string(keys, hrlyData, now);
        const { lastReportDateString: dlyLatestReport, daysSinceLastReport: daysSinceLastDlyReport } = this.get_earliest_report_date_string(keys, dlyData, now);

        let dotColor = 'rgba(0,0,0,0)';;
        if (hrlyLatestReport === 'M' || dlyLatestReport === 'M' || 30 < daysSinceLastHrlyReport || 30 < daysSinceLastDlyReport) {
          // More than 30 days since last report = red
          dotColor = 'rgb(211,44,44)';
        } else if (1 < daysSinceLastHrlyReport || 1 < daysSinceLastDlyReport) {
          // 1 - 30 days since last report = yellow
          dotColor = 'rgba(232,247,33,1)';
        } else if (daysSinceLastHrlyReport <= 1 || daysSinceLastDlyReport <= 1) {
          // One day or less since last report = green
          dotColor = 'rgba(49,155,35,1)';
        }
  
        return [dotColor, name, hrlyLatestReport, dlyLatestReport];
      });
    } else {
      return [];
    }
  };

  make_dot = (color) => {
    return (
      <div style={{
        height: '12px',
        width: '12px',
        backgroundColor: color,
        borderRadius: '50%',
        margin: '1px 3px 2px 0px',
        boxSizing: 'border-box'
      }}></div>
    );
  };

  render() {
    return (
      <div id="station_status">
        <LoadingOverlay
          active={app.explorer_dataIsLoading || app.explorer_dailyDataIsLoading}
          spinner
          background={'rgba(255,255,255,1.0)'}
          color={'rgba(34,139,34,1.0)'}
          spinnerSize={'10vw'}
        >
          <Typography variant="h6">
            Station Status
          </Typography>
          <Typography component="span" variant="body2" gutterBottom noWrap>
            <table cellPadding="1"><tbody>
              <tr>
                <td className='dot-column'>{this.make_dot('rgba(0,0,0,0)')}</td>
                <td style={{ textDecoration: 'underline', fontWeight: 'bold', minWidth: '116px' }}>Variable</td>
                <td style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Latest Hourly Report</td>
                <td style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Latest Daily Report</td>
                <td></td>
              </tr>
              {this.construct_table_info(app.getExplorer_status_page, app.explorer_latestConditions, app.explorer_latestDailyConditions).map(([dotColor, rowName, hrlyLatestReport, dlyLatestReport], i) => (
                <tr key={rowName}>
                  <td>{this.make_dot(dotColor)}</td>
                  <td style={{ fontWeight: 'bold', whiteSpace: 'pre' }}>{rowName}</td>
                  <td style={{ whiteSpace: 'pre' }}>{hrlyLatestReport === 'M' ? '>60 days ago' : (hrlyLatestReport === '--' ? '  --' : hrlyLatestReport)}</td>
                  <td style={{ whiteSpace: 'pre' }}>{dlyLatestReport === 'M' ? '>60 days ago' : (dlyLatestReport === '--' ? '  --' : dlyLatestReport)}</td>
                  {i === 0 ? (
                    <td rowSpan='100'>
                      <Button
                        onClick={() => this.change_page(app.getExplorer_status_page)}
                        style={{
                          height: '140px',
                          width: '45px',
                          minWidth: 'unset',
                          padding: 0,
                          border: 'none',
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000000"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4l3 8l-3 8" />
                        </svg>
                      </Button>
                    </td>
                  ) : (null)}
                </tr>
              ))}
            </tbody></table>
          </Typography>
        </LoadingOverlay>
      </div>
    );
  }
}

export default withRouter(StationExplorerStationStatus);
