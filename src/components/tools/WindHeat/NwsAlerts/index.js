import React from 'react';
import { inject, observer} from 'mobx-react';
import Typography from '@material-ui/core/Typography';

import LoadNwsAlerts from './LoadNwsAlerts';

import '../../../../styles/NwsAlerts.css';

var app;

@inject('store') @observer
class NwsAlerts extends React.Component {
  constructor(props) {
      super(props);
      app = this.props.store.app;
      this.state = {
        updated: '',
        windchill: [],
        heatstress: [],
        isLoading: true
      }
  }

  componentDidMount() {
    LoadNwsAlerts({ lat: this.props.stncoords[1], lon: this.props.stncoords[0]})
      .then(response => {
        this.setState({
          updated: '',
          windchill: [],
          heatstress: [],
          isLoading: false,
          ...response
        })
      });
  }
  
  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.stncoords) !== JSON.stringify(this.props.stncoords)) {
      LoadNwsAlerts({ lat: this.props.stncoords[1], lon: this.props.stncoords[0]})
        .then(response => {
          this.setState({
            updated: '',
            windchill: [],
            heatstress: [],
            isLoading: false,
            ...response
          })
        });
    }
  }

  render() {
    const alertType = app.windheat_windheatType === 'windchill' ? 'Wind Chill' : 'Heat Stress';

    return (
      <div id='nws-alerts'>
        <Typography variant="h6" id='nws-alerts-title'>
          Current {alertType} Related Watches, Warnings, and Advisories
        </Typography>
        
        <div id='nws-alerts-info'>
          <p id='nws-alerts-station-name'>{this.props.stnname}</p>
          <p id='nws-alerts-updated-at'>(Last Update: {this.state.updated})</p>
        </div>
        
        {this.state[app.windheat_windheatType].length ? (
          this.state[app.windheat_windheatType].map(({ web, event, headline, description, instruction }, i) => 
            <div key={i} className='nws-alerts-alert'>
              <div className='nws-alerts-alert-divider'></div>
              <a className='nws-alerts-alert-title-link' href={web} target='_blank' rel='noreferrer'>
                <h6 className='nws-alerts-alert-title'>{event}</h6>
              </a>
              <div className='nws-alerts-alert-body'>
                <p className='nws-alerts-alert-body-headline'>{headline}</p>
                <pre className='nws-alerts-alert-body-description'>{description}</pre>
                <pre className='nws-alerts-alert-body-instruction'>{instruction}</pre>
              </div>
            </div>
        )) : (
          <div className='nws-alerts-alert'>
            <div className='nws-alerts-alert-divider'></div>
            <p id='nws-alerts-no-alerts'>No alerts at this time.</p>
          </div>
        )}
      </div>
    );
  }
}

export default NwsAlerts;
