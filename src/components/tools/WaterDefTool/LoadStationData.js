///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const protocol = window.location.protocol;

const LoadStationData = ({sid,period}) => {
        //console.log('LoadStationData params');
        //console.log(sid,period);
        let params
        let network = sid.split(' ')[1]
        if (network==='17') {
          params = {
            "sid": sid,
            "meta":"name,state,valid_daterange",
            "sdate":period[0],
            "edate":period[1],
            "elems":[
                {"vX":4,"vN":22,"interval":[0,0,1],"duration":"dly"}, // daily precipitation, sum
                {"vX":68,"vN":65,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 2", ave
                {"vX":68,"vN":97,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 4", ave
                {"vX":68,"vN":161,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 8", ave
                {"vX":68,"vN":289,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 20", ave
                {"vX":68,"vN":321,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 40", ave
              ]
          }
        } else {
          params = {
            "sid": sid,
            "meta":"name,state,valid_daterange",
            "sdate":period[0],
            "edate":period[1],
            "elems":[
                {"vX":4,"vN":23,"interval":[0,0,1],"duration":"dly"}, // daily precipitation, sum
                {"vX":68,"vN":66,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 2", ave
                {"vX":68,"vN":98,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 4", ave
                {"vX":68,"vN":162,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 8", ave
                {"vX":68,"vN":290,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 20", ave
                {"vX":68,"vN":322,"interval":[0,0,1],"duration":"dly"}, // daily soil moisture @ 40", ave
              ]
          }
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
