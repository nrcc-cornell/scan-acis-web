///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const protocol = window.location.protocol;

const LoadStationData = ({sid,period,wsunits}) => {
        //console.log('LoadStationData params');
        //console.log(sid,period,wsunits);
        let params
        params = {
          "sid": sid,
          "sdate":period[0],
          "edate":period[1],
          "elems":[
              {"vX": 128, prec: 1, units: wsunits},
              {"vX": 130}
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
  wsunits: PropTypes.string.isRequired,
};

export default LoadStationData;
