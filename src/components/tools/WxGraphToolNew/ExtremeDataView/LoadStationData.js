///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const protocol = window.location.protocol;

const LoadStationData = ({sid,tthresh,pthresh,tunits,punits,tcomp,pcomp}) => {
        console.log('LoadStationData');
        console.log(sid);
        let params
        // use maxt for gt comparisons, use mint for lt comparisons
        let temp_vX = (tcomp==='gt') ? 1 : 2
        params = {
          "sid": sid,
          "meta":"name,state,valid_daterange",
          "sdate":"por",
          "edate":"por",
          "elems":[
              {"vX":temp_vX,"units":tunits,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_"+tcomp+"_"+tthresh},"maxmissing":10}, // number of days > temp threshold
              {"vX":4,"units":punits,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_"+pcomp+"_"+pthresh},"maxmissing":10}, // number of days > prcp threshold
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
  tthresh: PropTypes.string.isRequired,
  pthresh: PropTypes.string.isRequired,
  tunits: PropTypes.string.isRequired,
  punits: PropTypes.string.isRequired,
  tcomp: PropTypes.string.isRequired,
  pcomp: PropTypes.string.isRequired,
};

export default LoadStationData;
