const dateRangeOptions = {
  'windchill': {
    'default': { 'start': '10-01', 'end': '04-30', 'text': 'Oct. - Apr.' }
  },
  'heatindex': {
    'default': { 'start': '01-01', 'end': '12-31', 'text': 'Jan. - Dec.' }
  }
};

// To change from 'default' add an option to the objects above like: [option name]: { 'type': ['include'|'exclude'], 'start': date string formatted like 'MM-DD', 'end': date string formatted like 'MM-DD' }
//  and below add: [state abbreviation]: { 'windchill': [option name], 'heatindex': [option name] }
const rangeByState = {};

export const getDateRangeForState = (stateAbbr, optionType) => {
  let optionKey = 'default';
  if (Object.keys(rangeByState).includes(stateAbbr)) {
    optionKey = rangeByState[stateAbbr][optionType];
  }
  return dateRangeOptions[optionType][optionKey];
}