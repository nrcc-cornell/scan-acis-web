///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
//import axios from 'axios';
import PropTypes from 'prop-types';

let public_url = process.env.PUBLIC_URL

const LoadSoilParameters = ({sid}) => {
        return fetch(public_url + "/data/soil_parameters.json")
             .then(r => r.json())
             .then(data => {
               let foundStn = data['locs'].find(obj => obj.sid === sid)
               return (foundStn) ? foundStn['soil_params'] : null;
             });
}

LoadSoilParameters.propTypes = {
  sid: PropTypes.string.isRequired,
};

export default LoadSoilParameters;
