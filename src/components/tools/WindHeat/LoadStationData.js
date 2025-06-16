///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const protocol = window.location.protocol;

const LoadStationData = ({sid,period}) => {
        let params = {
          "sid": sid,
          "meta":"name,state,valid_daterange",
          "sdate":period[0],
          "edate":period[1],
          "elems":[
              {"vX":23},                              // temperature, inst, °F
              {"vX":24},                              // relitive humidity, inst, %
              {"vX":128, prec:1, units: 'miles/hr'},  // wind speed, inst, mph
            ]
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
  period: PropTypes.array.isRequired,
};

export default LoadStationData;
