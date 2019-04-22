///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import { withBaseIcon } from 'react-icons-kit';
import { calendar } from 'react-icons-kit/fa/calendar';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import '../../../../styles/GrapherDatePicker.css';

class DatePickerButton extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        value: PropTypes.string
    };
    render() {
        const {value, onClick} = this.props;
        //const IconGreen14 = withBaseIcon({ size: 14, style: {color:'#4ca20b'}});
        const IconGreen14 = withBaseIcon({ size: 14, style: {color:'#006600'}});

        return (
            <div className="grapher-date-picker-button-group">
                <button
                  className="grapher-date-picker-button"
                  onClick={onClick}>
                  {value}
                  <IconGreen14 icon={calendar} className="cal-icon" onClick={onClick} />
                </button>
            </div>
        );
    }
}

@inject("store") @observer
class GrapherDatePicker extends Component {

  //componentDidUpdate(prevProps) {
  //  this.props.store.app.wxgraph_setClimateSummary();
  //}

  render() {
        return (
            <div className='grapher-datepicker-input-div'>
            <div className='grapher-datepicker-div'>
              <DatePicker
                  ref='grapher_datepicker'
                  customInput={<DatePickerButton />}
                  className='input-date'
                  calendarClassName='calendar-pdate'
                  //readOnly={true}
                  fixedHeight={true}
                  selected={this.props.store.app.getGrapherDate}
                  onChange={this.props.store.app.setGrapherDate}
                  //minDate={moment("1981-01-01")}
                  minDate={(this.props.store.app.getLocation) ? moment(this.props.store.app.getLocation.sdate) : moment('1983-01-01')}
                  maxDate={moment()}
                  showMonthDropdown
                  showYearDropdown
                  scrollableMonthDropdown
                  scrollableYearDropdown
                  dropdownMode="select"
                  //filterDate={this.isMonthInGrowingSeason}
                  //popperPlacement="right"
                  popperModifiers={{
                    offset: {
                      enabled: true,
                      offset: '-40px, 5px'
                    },
                  }}
                  placeholderText="NONE"
              />
            </div>
            </div>
        )
  }

};

export default GrapherDatePicker;
