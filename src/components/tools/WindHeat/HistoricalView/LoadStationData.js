///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const protocol = window.location.protocol;

const LoadStationData = ({sid}) => {
        let params
        params = {
          "sid": sid,
          "sdate":"por",
          "edate":"por",
          "elems":[
              {"vX":23}, //temp
              {"vX":24}, //relative humidity
              {"vX":128}, //wind speed
            ],
          "meta":""
        }
        return axios
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, params)
          .then(res => {
            return res
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
}

LoadStationData.propTypes = {
  sid: PropTypes.string.isRequired,
};

export default LoadStationData;
