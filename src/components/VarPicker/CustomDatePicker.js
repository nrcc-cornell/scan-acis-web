import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CalendarToday from '@material-ui/icons/CalendarToday';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/PlantingDatePicker.css';

class DatePickerButton extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        value: PropTypes.string,
        label: PropTypes.string,
        ariaLabel: PropTypes.string
    };
    render() {
        const {ariaLabel, label, value, onClick} = this.props;

        return (
      <TextField
        className="date-text-input"
        id="date-text-input"
        variant="outlined"
        type={'string'}
        label={label}
        value={value}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label={ariaLabel}
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
class CustomDatePicker extends Component {
  render() {
        return (
              <div style={{ padding: '6px' }}>
                <DatePicker
                    customInput={<DatePickerButton />}
                    className='input-date'
                    calendarClassName='calendar-pdate'
                    fixedHeight={true}
                    selected={this.props.selected}
                    onChange={this.props.onChange}
                    minDate={moment(this.props.minDate)}
                    maxDate={moment(this.props.maxDate)}
                    showMonthDropdown
                    showYearDropdown
                    scrollableMonthDropdown
                    scrollableYearDropdown
                    dropdownMode="select"
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
                />
              </div>
        )
  }

};

export default CustomDatePicker;
