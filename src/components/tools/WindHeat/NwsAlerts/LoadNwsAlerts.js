import axios from 'axios';
import PropTypes from 'prop-types';

const windchillEvents = [
  "Brisk Wind Advisory",
  "Cold Weather Advisory",
  "Extreme Cold Warning",
  "Extreme Cold Watch",
  "Extreme Wind Warning",
  "High Wind Warning",
  "High Wind Watch",
  "Lake Wind Advisory",
  "Wind Advisory"
];

const heatstressEvents = [
  "Extreme Heat Warning",
  "Extreme Heat Watch",
  "Heat Advisory"
];

const LoadNwsAlerts = ({lat, lon}) => {
  return axios
    .get(`https://api.weather.gov/alerts/active?point=${lat},${lon}`)
    .then(results => {
      const { updated, features } = results.data;
      const { windchill, heatstress } = features.reduce((res, feat) => {
        const { event, headline, description, instruction, parameters } = feat.properties;

        let web = 'https://www.weather.gov/';
        if (
          "AWIPSidentifier" in parameters &&
          parameters.AWIPSidentifier.length
        ) {
          web += parameters.AWIPSidentifier[0].slice(3).toLowerCase();
        }

        const alert = { web, event, headline, description, instruction };
        if (windchillEvents.includes(event)) {
          res.windchill.push(alert);
        } else if (heatstressEvents.includes(event)) {
          res.heatstress.push(alert);
        }
        return res;
      }, { windchill: [], heatstress: [] });

      return {
        updated: new Date(updated).toLocaleString(),
        windchill,
        heatstress,
      };
    })
    .catch(err => {
      console.error(err);
      return {};
    });
}

LoadNwsAlerts.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
};

export default LoadNwsAlerts;
