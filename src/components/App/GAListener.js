import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactGA from 'react-ga4';

class GAListener extends React.Component {
  componentDidMount() {
    // Initialize GA
    ReactGA.initialize('G-EESNBW09S1');

    // Track the initial page load
    this.sendPageView(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    // Only send pageview if the location has changed
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.sendPageView(this.props.location.pathname);
    }
  }

  sendPageView(path) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(GAListener);
