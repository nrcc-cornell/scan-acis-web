///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import PropTypes from 'prop-types';
//import moment from 'moment';

const WaterDeficitModel = ({soilm,soilp,depthRangeTop,depthRangeBottom,unitsOutput}) => {
        // soilm: array of dates and soil moisture (volumetric, %) observed (5 depths, 2",4",8",20",40")
        // depthRangeTop: top of soil depth range (cm) - water deficit is calculated from depthRangeTop to depthRangeBottom
        // depthRangeBottom: bottom of soil depth range (cm) - water deficit is calculated from depthRangeTop to depthRangeBottom
        // waterret: array of water retention parameters (qr and qs units: cm^3/cm^3)
        // output: array of dates and water deficit, value of field capacity, value of wilting point
        //console.log('WaterDeficitModel params');
        //console.log(soilm);
        //console.log(depthRangeTop,depthRangeBottom);

        // units conversions
        let in_to_cm = (v) => { return v*2.54 }
        let cm_to_in = (v) => { return v/2.54 }

        // depth of observation soil depth, in cm
        //let depthObs = [ 2.*2.54, 4.*2.54, 8.*2.54, 20.*2.54, 40.*2.54 ]
        let depthObs = [ in_to_cm(2.), in_to_cm(4.), in_to_cm(8.), in_to_cm(20.), in_to_cm(40.) ]

        // calculate Field Capacity (FC) for each cm^3, to 1-meter depth
        // calculate Permanent Wilting Point (PWP) for each cm^3, to 1-meter depth
        // calculate Available Water Capacity (AWC) for each cm^3, to 1-meter depth
        let a,n,h,qr,qs,log10a,log10n
        let fc,pwp,awc,fawc
        let soilInfo = []
        for (let d=0; d<parseInt(depthObs.slice(-1)[0],10)+1; d++) {
            // reset values of equation (make sure we don't use values from previous depth)
            a=null; n=null; h=null; qr=null; qs=null; log10a=null; log10n=null;
            fc=null; pwp=null; awc=null; fawc=null;

            // find parameters for this depth
            for (let horizon of soilp) {
                if (d>=horizon.depthTop && d<horizon.depthBottom) {
                  qr=horizon.qr;
                  qs=horizon.qs;
                  log10a=horizon.log10a;
                  log10n=horizon.log10n;
                  a = Math.pow(10,log10a);
                  n = Math.pow(10,log10n);
                  break;
                }
            };

            // If soil parameters are not set after looping through horizons, then available parameters
            // do not extend to this depth (nor to the full depth of observations).
            // In this case, just assign parameters for this depth from the deepest available horizon.
            if (!qr && !qs && !log10a && !log10n && !a && !n) {
                qr=soilp.slice(-1)[0].qr
                qs=soilp.slice(-1)[0].qs
                log10a=soilp.slice(-1)[0].log10a
                log10n=soilp.slice(-1)[0].log10n
                a = Math.pow(10,log10a);
                n = Math.pow(10,log10n);
            }

            // calculate FC from parameters. For Field Capacity, we must use a soil matric potential of 33kPa.
            h = 33.*10.197162129779 //soil matric potential converted from kPa to cm of water
            fc = qr + ( (qs-qr) / Math.pow(1+Math.pow(a*h,n),1.-1./n) )
            
            // calculate PWP from parameters. For Permanent Wilting Point, we must use a soil matric potential of 1500kPa.
            h = 1500.*10.197162129779 //soil matric potential converted from kPa to cm of water
            pwp = qr + ( (qs-qr) / Math.pow(1+Math.pow(a*h,n),1.-1./n) )

            // calculate AWC
            awc = fc-pwp
            
            soilInfo.push({
                'depthTop':parseFloat(d),
                'depthBottom':parseFloat(d+1),
                'fc':fc,
                'pwp':pwp,
                'awc':awc,
            });
        }

        // calculate field capacity and permanent wilting point for sfc -> depth
        let fc_sfc_to_depth=0
        let pwp_sfc_to_depth=0
        for (let k=depthRangeTop; k<depthRangeBottom; k++) {
            fc_sfc_to_depth += soilInfo[k].fc
            pwp_sfc_to_depth += soilInfo[k].pwp
        }

        // calculate fraction of Available Water Capacity observed (fawc) at each observation depth
        // fawc = (OBS-PWP)/AWC)
        let depth,wdTotal;
        let output=[];
        let soilInfoObs=[];
        soilm.forEach(function(values,idx) {
            // init soilInfoObs, where we hold fawc (and other soil info) at the observation depths
            // with valid data for this date
            soilInfoObs=[]
            //console.log('soilm values');
            //console.log(values);

            // soil moisture values start with the second index. date is index=0.
            // the sm value must be valid and not unrealistically low.
            values.slice(1).forEach(function(v,i) {
                if (v && v/100.>soilInfo[parseInt(Math.floor(depthObs[i]),10)].pwp) {
                    soilInfoObs.push({
                        'depth':depthObs[i],
                        'fc':soilInfo[parseInt(Math.floor(depthObs[i]),10)].fc,
                        'pwp':soilInfo[parseInt(Math.floor(depthObs[i]),10)].pwp,
                        'awc':soilInfo[parseInt(Math.floor(depthObs[i]),10)].awc,
                        'fawc':(v/100.-soilInfo[parseInt(Math.floor(depthObs[i]),10)].pwp)/soilInfo[parseInt(Math.floor(depthObs[i]),10)].awc,
                    });
                }
            });

            //if (moment.utc(values[0]).format('YYYYMMDD')==='20190429') {
            //  console.log(soilInfoObs);
            //}

            // calculate fawc and water deficit for each cm^3, to 1-meter depth
            // if only one observed depth, assume fawc is constant from surface to 1-meter depth.
            // if more then one observed depth, interpolate fawc from observed depths to each cm^3 in profile

            wdTotal = 0;
            for (let k=depthRangeTop; k<depthRangeBottom; k++) {
                // depth we are interpolating to (cm)
                depth = k+0.5

                // calculate fawc for this depth
                if (soilInfoObs.length===0) {
                    // There are no soil moisture obs available for this day.
                    // Set water deficit to null and break out of this day.
                    wdTotal=null;
                    break;
                } else if (soilInfoObs.length===1) {
                    fawc=soilInfoObs[0].fawc
                } else {
                    // if depth is less than first observation depth, set to same value as shallowest observation depth
                    if (depth<soilInfoObs[0].depth) {
                        //if (moment.utc(values[0]).format('YYYYMMDD')==='20190429') {
                        //  console.log('fawc method 1');
                        //  console.log(fawc);
                        //}
                        fawc = soilInfoObs[0].fawc
                    // if depth is more than last observation depth, set to same value as deepest observation depth
                    } else if (depth>soilInfoObs[soilInfoObs.length-1].depth) {
                        //if (moment.utc(values[0]).format('YYYYMMDD')==='20190429') {
                        //  console.log('fawc method 2');
                        //  console.log(fawc);
                        //}
                        fawc = soilInfoObs[soilInfoObs.length-1].fawc
                    // between observation points, we will interpolate
                    } else {
                        for (let j=0; j<soilInfoObs.length-1; j++) {
                            if (depth>soilInfoObs[j].depth && depth<=soilInfoObs[j+1].depth) {
                                // linear interpolation between two closest observations
                                //fawc = ( soilInfoObs[j].fawc*(soilInfoObs[j+1].depth-depth) + soilInfoObs[j+1].fawc*(depth-soilInfoObs[j].depth) ) / (soilInfoObs[j+1].depth - soilInfoObs[j].depth)
                                //if (moment.utc(values[0]).format('YYYYMMDD')==='20190429') {
                                //  console.log('fawc method 3');
                                //  console.log(fawc);
                                //}
                                fawc = soilInfoObs[j].fawc + ( soilInfoObs[j].fawc*(soilInfoObs[j].depth-depth) + soilInfoObs[j+1].fawc*(depth-soilInfoObs[j].depth) ) / (soilInfoObs[j+1].depth - soilInfoObs[j].depth)
                                break;
                            }
                        }
                    }
                }

                // Calculate total water deficit from surface to selected depth by integrating through profile.
                // We do so by calculating water deficit for this depth and adding it to the total.
                wdTotal = wdTotal + (1.-fawc)*(soilInfo[k].fc-soilInfo[k].pwp)
                //if (moment.utc(values[0]).format('YYYYMMDD')==='20190429') {
                //  console.log(moment.utc(values[0]).format('YYYYMMDD'),depth,soilInfo[k].fc,soilInfo[k].pwp,fawc,(1.-fawc)*(soilInfo[k].fc-soilInfo[k].pwp),wdTotal);
                //}
            }

            // array to be returned. An array of arrays [date, water deficit]
            if (wdTotal && unitsOutput==='inches') { wdTotal = cm_to_in(wdTotal) }
            output.push([values[0],wdTotal])

        });

        if (unitsOutput==='inches') { fc_sfc_to_depth = cm_to_in(fc_sfc_to_depth) }
        if (unitsOutput==='inches') { pwp_sfc_to_depth = cm_to_in(pwp_sfc_to_depth) }
        return {data_series:output, fc_ref:fc_sfc_to_depth, pwp_ref:pwp_sfc_to_depth}
}

WaterDeficitModel.propTypes = {
  soilm: PropTypes.array.isRequired,
  soilp: PropTypes.array.isRequired,
  depthRangeTop: PropTypes.number.isRequired,
  depthRangeBottom: PropTypes.number.isRequired,
  unitsOutput: PropTypes.string.isRequired,
};

export default WaterDeficitModel;
