//compute heat index for a single hour or all hours in a day
export function heatindex(tempVals, rhumVals, nacode = 'na') {
  const hindx = [];

  // Allows single hour or array of hours to be passed in
  const temps = typeof tempVals !== 'object' ? [tempVals] : tempVals;
  const rhums = typeof rhumVals !== 'object' ? [rhumVals] : rhumVals;

  for (let i = 0; i < temps.length; i += 1) {
    if (temps[i] === 'M' || rhums[i] === 'M') {
      // Add missing value if required data is missing
      hindx.push(null);
    } else if (parseFloat(temps[i]) >= 80) {
      // Only calculate heat index if the temperature is at least 80°F
      
      // Parse temperature and humidity values
      let temp = parseFloat(temps[i]);
      let rhum = parseFloat(rhums[i]);

      // Calculate initial heat index
      let hi = Math.round(
        -42.379 +
          2.04901523 * temp +
          10.1433127 * rhum -
          0.22475541 * temp * rhum -
          0.00683783 * temp ** 2 -
          0.05481717 * rhum ** 2 +
          0.00122874 * temp ** 2 * rhum +
          0.00085282 * temp * rhum ** 2 -
          0.00000199 * temp ** 2 * rhum ** 2
      );

      // Adjust if temperature is between 80-112°F and humidity is less than 13%
      if (rhum < 13 && temp >= 80 && temp <= 112) {
        const adj =
          ((13.0 - rhum) / 4.0) *
          Math.sqrt((17.0 - Math.abs(temp - 95.0)) / 17.0);

        hi -= adj;
      }

      // Adjust if temperature is between 80-87°F and humidity is greater than than 85%
      if (rhum > 85 && temp >= 80 && temp <= 87) {
        const adj2 = ((rhum - 85.0) / 10.0) * ((87.0 - temp) / 5.0);

        hi -= adj2;
      }

      // Add final heat index value to the return
      hindx.push(hi);
    } else {
      // If temperature is less than 80°F push nacode
      hindx.push(nacode);
    }
  }

  // Return will be single value if single value passed in or array of values if array passed in
  return typeof tempVals === 'object' ? hindx : hindx[0];
}


//compute wind chill from temp and wind speed for single hour or all hours in a day
export function windchill(tempVals, windVals, nacode = 'na') {
  const wchill = [];

  // Allows single hour or array of hours to be passed in
  const temps = typeof tempVals !== 'object' ? [tempVals] : tempVals;
  const winds = typeof windVals !== 'object' ? [windVals] : windVals;

  for (let i = 0; i < temps.length; i += 1) {
    if (temps[i] === 'M' || winds[i] === 'M') {
      // Add missing value if required data is missing
      wchill.push(null);
    } else if (parseFloat(temps[i]) <= 50 && parseFloat(winds[i]) > 3) {
      // Only calculate wind chill if temperature is less than 50°F and windspeed is greater than 3 mph
      
      // Parse temperature and wind values
      let temp = parseFloat(temps[i]);
      let wind = parseFloat(winds[i]);

      // Calculate and add wind chill value to return
      wchill.push(
        Math.round(
          35.74 +
            0.6215 * temp -
            35.75 * wind ** 0.16 +
            0.4275 * temp * wind ** 0.16
        )
      );
    } else {
      // If temperature and wind speed requirements are not met then push nacode value
      wchill.push(nacode);
    }
  }

  // Return will be single value if single value passed in or array of values if array passed in
  return typeof tempVals === 'object' ? wchill : wchill[0];
}
