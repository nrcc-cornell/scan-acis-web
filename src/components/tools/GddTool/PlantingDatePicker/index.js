///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
//import { calendar } from 'react-icons-kit/fa/calendar';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CalendarToday from '@material-ui/icons/CalendarToday';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import '../../../../styles/PlantingDatePicker.css';

class DatePickerButton extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        value: PropTypes.string
    };
    render() {
        const {value, onClick} = this.props;

        return (
      <TextField
        className="date-text-input"
        id="date-text-input"
        variant="outlined"
        type={'string'}
        label="Planting/Budbreak"
        value={value}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label="planting or budbreak date"
                onClick={onClick}
              >
                <CalendarToday color="primary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
        );
    }
}

@inject("store") @observer
class PlantingDatePicker extends Component {

  isMonthInGrowingSeason = (d) => {
    let month = moment(d).month() + 1
    let validMonths = [3,4,5,6,7,8,9,10]
    return validMonths.includes(month)
  }

  componentDidUpdate(prevProps) {
    this.props.store.app.gddtool_setClimateSummary();
  }

  render() {
        return (
              <DatePicker
                  ref='planting_datepicker'
                  customInput={<DatePickerButton />}
                  className='input-date'
                  calendarClassName='calendar-pdate'
                  //readOnly={true}
                  fixedHeight={true}
                  selected={this.props.store.app.getPlantingDate}
                  onChange={this.props.store.app.setPlantingDate}
                  minDate={moment("1981-01-01")}
                  maxDate={moment(this.props.store.app.latestSelectableYear.toString()+"-10-31")}
                  showMonthDropdown
                  showYearDropdown
                  scrollableMonthDropdown
                  scrollableYearDropdown
                  dropdownMode="select"
                  //filterDate={this.isMonthInGrowingSeason}
                  popperPlacement="bottom-start"
                  popperModifiers={{
                    flip: {
                      enabled: false
                    },
                    offset: {
                      enabled: true,
                      offset: '-40px, 5px'
                    },
                  }}
                  placeholderText="NONE"
              >
                <div className="calendar-message">
                  Select Planting/Budbreak Date
                </div>
              </DatePicker>
        )
  }

};

export default PlantingDatePicker;
