///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const protocol = window.location.protocol;

const LoadStationData = ({sid,xthresh,nthresh,pthresh,xunits,nunits,punits,xcomp,ncomp,pcomp}) => {
        //console.log('LoadStationData');
        //console.log(sid);
        let params
        params = {
          "sid": sid,
          "meta":"name,state,valid_daterange",
          "sdate":"por",
          "edate":"por",
          "elems":[
              {"vX":1,"units":xunits,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_"+xcomp+"_"+xthresh},"maxmissing":10}, // number of days > tmax threshold
              {"vX":2,"units":nunits,"interval":[1],"duration":"yly","reduce":{"reduce":"cnt_"+ncomp+"_"+nthresh},"maxmissing":10}, // number of days < tmin threshold
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
  xthresh: PropTypes.string.isRequired,
  nthresh: PropTypes.string.isRequired,
  pthresh: PropTypes.string.isRequired,
  xunits: PropTypes.string.isRequired,
  nunits: PropTypes.string.isRequired,
  punits: PropTypes.string.isRequired,
  xcomp: PropTypes.string.isRequired,
  ncomp: PropTypes.string.isRequired,
  pcomp: PropTypes.string.isRequired,
};

export default LoadStationData;
