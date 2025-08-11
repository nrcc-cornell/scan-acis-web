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
      // console.log(results);
      // const { updated, features } = results.data;
      // const { windchill, heatstress } = features.reduce((res, feat) => {
      //   const { web, event, headline, description, instruction } = feat.properties;
      //   const alert = { web, event, headline, description, instruction };
      //   if (windchillEvents.includes(event)) {
      //     res.windchill.push(alert);
      //   } else if (heatstressEvents.includes(event)) {
      //     res.heatstress.push(alert);
      //   }
      //   return res;
      // }, { windchill: [], heatstress: [] });

      // return {
      //   updated: new Date(updated).toLocaleString(),
      //   windchill,
      //   heatstress,
      // };


      // STUB
      return {
        "updated": "8/8/2025, 2:38:45 PM",
        "windchill": [],
        "heatstress": [
          {
            "web": "http://www.weather.gov",
            "event": "Heat Advisory",
            "headline": "Heat Advisory issued August 8 at 1:38PM CDT until August 8 at 8:00PM CDT by NWS Topeka KS",
            "description": "* WHAT...Heat index values from 103 to 110.\n\n* WHERE...Portions of central, east central, north central, and\nnortheast Kansas.\n\n* WHEN...Until 8 PM CDT this evening.\n\n* IMPACTS...Hot temperatures and high humidity may cause heat\ncramps, heat exhaustion, and even heat stroke.",
            "instruction": "Take extra precautions when outside. Wear lightweight and loose\nfitting clothing. Try to limit strenuous activities to early morning\nor evening. Take action when you see symptoms of heat exhaustion and\nheat stroke.\n\nTo reduce risk during outdoor work, the Occupational Safety and\nHealth Administration recommends scheduling frequent rest breaks in\nshaded or air conditioned environments. Anyone overcome by heat\nshould be moved to a cool and shaded location. Heat stroke is an\nemergency! Call 9 1 1.\n\nDo not leave young children and pets in unattended vehicles. Car\ninteriors will reach lethal temperatures in a matter of minutes."
          }
        ]
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
